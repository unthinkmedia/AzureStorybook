"""
Azure Portal Page Specification Schema
=======================================

Pydantic v2 models that describe the full structure of an Azure Portal page.
An LLM fills in a PageSpec and the builder uses it to compose Storybook
components into a working page.

Usage
-----
1. LLM receives a user prompt ("build me the Monitor Overview page")
2. LLM outputs a JSON blob conforming to PageSpec
3. Builder reads the spec, maps each section to a Storybook component,
   and generates the .stories.tsx / .tsx files

The schema is intentionally *compositional* — each page section is a
separate model that maps 1:1 to an existing Storybook component or
pattern.  The body uses a discriminated union so the LLM picks one
template and fills in only the fields that template needs.

Export JSON Schema for non-Python consumers
-------------------------------------------
    python -c "from azure_page_spec import PageSpec; print(PageSpec.model_json_schema())"
"""

from __future__ import annotations

from enum import Enum
from typing import Annotated, Literal, Optional, Union

from pydantic import BaseModel, Field, model_validator


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------

class LayoutType(str, Enum):
    """
    Top-level layout decision.

    side_panel  – resource detail / service blade (220 px side nav + content)
    full_width  – home, create wizard, browse-all, marketplace
    dashboard   – multi-column widget grid (Azure Dashboard)
    """
    side_panel = "side_panel"
    full_width = "full_width"
    dashboard = "dashboard"


class PageType(str, Enum):
    """Semantic page type — drives default component selection."""
    browse = "browse"              # Resource list (DataGrid)
    detail = "detail"              # Resource overview / sub-page
    settings = "settings"          # Settings form with toggles / radios
    create = "create"              # Create wizard / form
    landing = "landing"            # Service landing page (illustrations + CTAs)
    diagnostics = "diagnostics"    # Diagnose & solve problems
    marketing = "marketing"        # Feature upsell / informational
    overview = "overview"          # Service overview with card grid sections


class NavItemType(str, Enum):
    """Side-nav item types."""
    link = "link"
    divider = "divider"
    group_header = "group_header"


class FieldType(str, Enum):
    """Form field control types used in SettingsForm body template."""
    toggle = "toggle"
    radio_group = "radio_group"
    checkbox = "checkbox"
    text_input = "text_input"
    dropdown = "dropdown"
    combobox = "combobox"
    slider = "slider"
    spin_button = "spin_button"


class BadgeColor(str, Enum):
    """Semantic badge colors — maps to Fluent Badge `color` prop."""
    success = "success"
    danger = "danger"
    warning = "warning"
    informative = "informative"
    important = "important"
    subtle = "subtle"
    brand = "brand"


# ---------------------------------------------------------------------------
# Storybook Component Reference
# ---------------------------------------------------------------------------

class StorybookRef(BaseModel):
    """
    Points the LLM (and builder) at the exact Storybook component / story
    to use.  Every structural section carries one of these so generated
    code always traces back to a documented component.

    The `component` and `story` values must match entries in
    src/component-registry.json.  The `import_path` is the story file
    path from the registry (e.g. 'src/stories/composed/CommandBar.stories.tsx').
    """
    component: str = Field(
        description=(
            "Component name matching the 'name' field in component-registry.json, "
            "e.g. 'AzureBreadcrumb', 'CommandBar', 'DataGrid', 'PageTabs'"
        )
    )
    story: Optional[str] = Field(
        default=None,
        description=(
            "Specific story variant matching one of the 'stories' entries "
            "in component-registry.json, e.g. 'Default', 'WithActiveTags'"
        )
    )
    import_path: Optional[str] = Field(
        default=None,
        description=(
            "Story file path matching the 'storyFile' field in "
            "component-registry.json, e.g. 'src/stories/composed/CommandBar.stories.tsx'"
        )
    )


# ---------------------------------------------------------------------------
# Section: Breadcrumb
# ---------------------------------------------------------------------------

class BreadcrumbItem(BaseModel):
    label: str = Field(description="Display text, e.g. 'Home', 'Resource Manager'")
    href: Optional[str] = Field(default=None, description="Navigation target (None = current page)")
    is_current: bool = Field(default=False, description="True for the last item in the trail")


class BreadcrumbSpec(BaseModel):
    """
    Maps to → Storybook: AzureBreadcrumb (Composed)

    LLM prompt: "List the navigation hierarchy from Home down to the
    current page."
    """
    storybook_ref: StorybookRef = Field(
        default_factory=lambda: StorybookRef(
            component="AzureBreadcrumb",
            story="WithMultipleLevels",
            import_path="src/stories/composed/AzureBreadcrumb.stories.tsx",
        )
    )
    items: list[BreadcrumbItem] = Field(
        min_length=1,
        description="Ordered breadcrumb trail.  First item is usually Home."
    )


# ---------------------------------------------------------------------------
# Section: Page Header (Title Bar + Copilot Suggestions)
# ---------------------------------------------------------------------------

class CopilotSuggestion(BaseModel):
    """One Copilot suggestion pill shown below the page title."""
    label: str = Field(description="Short action description shown in the pill")
    prompt: str = Field(
        description=(
            "The full prompt sent to Copilot when clicked. This is the "
            "data the LLM should fill in — the *intent* behind the suggestion."
        )
    )


class PageHeaderSpec(BaseModel):
    """
    Maps to → Storybook: PageTitleBar (Composed)

    LLM prompt: "What is the page title?  What icon represents this
    service?  Should there be a star/favorite button?  List 0-5
    Copilot suggestions that would be useful on this page."
    """
    storybook_ref: StorybookRef = Field(
        default_factory=lambda: StorybookRef(
            component="PageTitleBar",
            story="WithPipeTitleAndSuggestions",
            import_path="src/stories/composed/PageTitleBar.stories.tsx",
        )
    )
    title: str = Field(description="Page title, e.g. 'Monitor | Overview'")
    subtitle: Optional[str] = Field(
        default=None,
        description="Secondary text below title, e.g. 'Microsoft', 'Default Directory'"
    )
    icon: Optional[str] = Field(
        default=None,
        description="Fluent icon name (24Regular), e.g. 'Heart24Regular', 'People24Regular'"
    )
    show_star: bool = Field(
        default=False,
        description="Show a favorite/star toggle button"
    )
    show_more_actions: bool = Field(
        default=False,
        description="Show a '...' more-actions overflow button"
    )
    copilot_suggestions: list[CopilotSuggestion] = Field(
        default_factory=list,
        description=(
            "Copilot suggestion pills.  Leave empty for pages that don't "
            "have Copilot integration.  Typically 0-5 items."
        )
    )


# ---------------------------------------------------------------------------
# Section: Side Navigation
# ---------------------------------------------------------------------------

class NavItem(BaseModel):
    """One item in the side navigation panel."""
    type: NavItemType = Field(default=NavItemType.link)
    label: Optional[str] = Field(
        default=None,
        description="Display text (required for link and group_header)"
    )
    icon: Optional[str] = Field(
        default=None,
        description="Fluent icon name, e.g. 'Home24Regular'"
    )
    is_selected: bool = Field(default=False, description="Currently active nav item")
    children: Optional[list[NavItem]] = Field(
        default=None,
        description="Nested items for expandable groups"
    )


class SideNavSpec(BaseModel):
    """
    Maps to → Storybook: SideNavigation (Composed)

    LLM prompt: "List all navigation items in the left sidebar.
    Mark which one is currently selected.  Group items under
    expandable headers if applicable."
    """
    storybook_ref: StorybookRef = Field(
        default_factory=lambda: StorybookRef(
            component="SideNavigation",
            story="Default",
            import_path="src/stories/composed/SideNavigation.stories.tsx",
        )
    )
    width_px: int = Field(default=220, description="Sidebar width in pixels")
    collapsible: bool = Field(default=True, description="Can the sidebar be collapsed?")
    search_enabled: bool = Field(
        default=False,
        description="Show a search box at the top of the nav"
    )
    items: list[NavItem] = Field(
        min_length=1,
        description="Ordered list of navigation items"
    )


# ---------------------------------------------------------------------------
# Section: Command Bar
# ---------------------------------------------------------------------------

class CommandAction(BaseModel):
    """One action button in the command bar."""
    label: str = Field(description="Button text, e.g. 'Create', 'Refresh'")
    icon: Optional[str] = Field(
        default=None,
        description="Fluent icon name, e.g. 'Add24Regular', 'ArrowSync24Regular'"
    )
    is_primary: bool = Field(
        default=False,
        description="True for prominent actions (left group) vs. secondary (right group)"
    )
    has_dropdown: bool = Field(
        default=False,
        description="Shows a dropdown chevron (e.g. 'Export ▾', 'Manage view ▾')"
    )
    disabled: bool = Field(default=False)


class CommandBarSpec(BaseModel):
    """
    Maps to → Storybook: CommandBar (Composed)

    LLM prompt: "List the toolbar actions.  Split into primary
    (left-aligned, prominent) and secondary (right-aligned, subtle).
    Which actions have dropdown menus?"
    """
    storybook_ref: StorybookRef = Field(
        default_factory=lambda: StorybookRef(
            component="CommandBar",
            story="Default",
            import_path="src/stories/composed/CommandBar.stories.tsx",
        )
    )
    actions: list[CommandAction] = Field(
        min_length=1,
        description="All command bar actions in display order"
    )


# ---------------------------------------------------------------------------
# Section: Info Banner
# ---------------------------------------------------------------------------

class InfoBannerIntent(str, Enum):
    info = "info"
    warning = "warning"
    error = "error"
    success = "success"


class InfoBannerSpec(BaseModel):
    """
    Maps to → Fluent MessageBar (Storybook: DataDisplay > MessageBar)

    LLM prompt: "Is there an important banner at the top of the content
    area?  What does it say?  Is it info / warning / error?"
    """
    storybook_ref: StorybookRef = Field(
        default_factory=lambda: StorybookRef(
            component="DataDisplay",
            story="Overview",
            import_path="src/stories/components/DataDisplay.stories.tsx",
        )
    )
    intent: InfoBannerIntent = Field(description="Severity / visual intent")
    message: str = Field(description="Banner text")
    action_label: Optional[str] = Field(
        default=None,
        description="Optional CTA link text, e.g. 'Learn more', 'View guidance'"
    )
    dismissible: bool = Field(default=True)


# ---------------------------------------------------------------------------
# Section: Filter Bar
# ---------------------------------------------------------------------------

class FilterDefinition(BaseModel):
    """One dropdown filter control in the filter bar."""
    field: str = Field(description="Field name, e.g. 'Subscription', 'Location', 'Status'")
    placeholder: Optional[str] = Field(default=None)
    multi_select: bool = Field(default=True)
    options: list[str] = Field(
        default_factory=list,
        description="Predefined filter options.  Empty = dynamic / loaded at runtime."
    )


class ActiveFilter(BaseModel):
    """A currently-applied filter shown as a removable tag."""
    field: str
    value: str
    operator: str = Field(default="equals", description="e.g. 'equals', 'contains', 'gt'")


class FilterBarSpec(BaseModel):
    """
    Maps to → Storybook: FilterBar (Composed)

    LLM prompt: "Does this page have a filter bar?  List the filter
    dropdowns and any pre-applied filter tags."
    """
    storybook_ref: StorybookRef = Field(
        default_factory=lambda: StorybookRef(
            component="FilterBar",
            story="WithActiveTags",
            import_path="src/stories/composed/FilterBar.stories.tsx",
        )
    )
    search_placeholder: str = Field(
        default="Filter for any field...",
        description="Search box placeholder text"
    )
    filters: list[FilterDefinition] = Field(default_factory=list)
    active_filters: list[ActiveFilter] = Field(
        default_factory=list,
        description="Pre-applied filters shown as removable tags"
    )


# ---------------------------------------------------------------------------
# Section: Page Tabs
# ---------------------------------------------------------------------------

class TabDefinition(BaseModel):
    """
    One tab in the PageTabs strip.

    Mirrors the PageTab TypeScript interface:
      { value: string; label: string; icon?: ReactElement; disabled?: boolean }
    """
    value: str = Field(
        description=(
            "Unique identifier for this tab — used as the key in tab_bodies. "
            "Convention: lowercase-kebab, e.g. 'overview', 'getting-started'"
        )
    )
    label: str = Field(description="Display text, e.g. 'Overview', 'Getting started'")
    icon: Optional[str] = Field(
        default=None,
        description="Fluent icon name (20Regular), e.g. 'Home20Regular', 'Settings20Regular'"
    )
    disabled: bool = Field(default=False, description="Disable this tab")
    badge_count: Optional[int] = Field(
        default=None,
        description="Optional count badge on the tab, e.g. 5 for '5 alerts'"
    )


class TabsSpec(BaseModel):
    """
    Maps to → Storybook: PageTabs (Components/PageTabs)

    The PageTabs component renders a horizontal tab strip with an
    underline indicator.  Each tab's `value` is the key that maps
    to a body template in `BodySpec.tab_bodies`.

    LLM prompt: "Does the page have tabs?  List each tab with a
    unique value, display label, optional icon, and which one is
    selected by default."
    """
    storybook_ref: StorybookRef = Field(
        default_factory=lambda: StorybookRef(
            component="PageTabs",
            story="Default",
            import_path="src/stories/components/PageTabs.stories.tsx",
        )
    )
    tabs: list[TabDefinition] = Field(min_length=2)
    default_tab: str = Field(
        description=(
            "The `value` of the tab selected by default. "
            "Must match one of the tab values."
        )
    )
    size: Literal["small", "medium", "large"] = Field(default="medium")


# ---------------------------------------------------------------------------
# Body Templates — Discriminated Union
# ---------------------------------------------------------------------------
# Each body template is a separate model.  The LLM picks one (or nests
# them under tabs) and fills in only the fields that template requires.
# The `template` field is the discriminator.
# ---------------------------------------------------------------------------

# -- DataGrid Body ----------------------------------------------------------

class ColumnDefinition(BaseModel):
    """One column in a DataGrid."""
    key: str = Field(description="Unique column identifier")
    label: str = Field(description="Column header text")
    sortable: bool = Field(default=True)
    is_link: bool = Field(
        default=False,
        description="Render cell value as a brand-colored link (e.g. resource name)"
    )
    badge_color_map: Optional[dict[str, BadgeColor]] = Field(
        default=None,
        description=(
            "If set, cell values are rendered as Badges.  Keys are cell "
            "values, values are badge colors.  e.g. {'Running': 'success', "
            "'Stopped': 'danger'}"
        )
    )
    width: Optional[str] = Field(
        default=None,
        description="CSS width hint, e.g. '200px', '1fr'"
    )


class RowData(BaseModel):
    """One row of sample data for the DataGrid.  Keys match ColumnDefinition.key."""
    cells: dict[str, str] = Field(description="Column key → cell value")


class DataGridBody(BaseModel):
    """
    Maps to → Storybook: DataGrid > ResourceList

    Used for: resource lists, resource group tables, audit logs, etc.
    The LLM fills in columns, sample rows, and pagination config.

    LLM prompt: "Define the table columns.  Which columns are sortable?
    Which show status badges?  Provide 3-8 sample rows.  Is there pagination?"
    """
    template: Literal["data_grid"] = "data_grid"
    storybook_ref: StorybookRef = Field(
        default_factory=lambda: StorybookRef(
            component="DataGrid",
            story="Default",
            import_path="src/stories/components/DataGrid.stories.tsx",
        )
    )
    columns: list[ColumnDefinition] = Field(min_length=1)
    rows: list[RowData] = Field(
        default_factory=list,
        description="Sample data rows (3-8 recommended for story)"
    )
    selectable: bool = Field(default=True, description="Show row selection checkboxes")
    pagination: bool = Field(default=True)
    total_count: Optional[int] = Field(
        default=None,
        description="Total item count for pagination display, e.g. 28"
    )
    group_by: Optional[str] = Field(
        default=None,
        description="Column key to group rows by, e.g. 'resourceGroup'"
    )


# -- Card Grid Body ---------------------------------------------------------

class CardAction(BaseModel):
    """Action link/button at the bottom of a card."""
    label: str
    icon: Optional[str] = None
    href: Optional[str] = None


class CardItem(BaseModel):
    """One card in a card grid section."""
    title: str
    description: Optional[str] = None
    icon: Optional[str] = Field(
        default=None,
        description="Fluent icon name for the card header"
    )
    badge: Optional[str] = Field(
        default=None,
        description="Optional status badge text"
    )
    badge_color: Optional[BadgeColor] = None
    actions: list[CardAction] = Field(default_factory=list)
    metrics: Optional[dict[str, str]] = Field(
        default=None,
        description="KPI metrics grid, e.g. {'CPU': '45%', 'Memory': '2.3 GB'}"
    )


class CardGridSection(BaseModel):
    """A titled section containing a grid of cards."""
    title: str = Field(description="Section heading, e.g. 'Insights'")
    subtitle: Optional[str] = Field(
        default=None,
        description="Description below heading"
    )
    view_all_link: Optional[str] = Field(
        default=None,
        description="'View all' link text"
    )
    cards: list[CardItem] = Field(min_length=1)
    columns: int = Field(
        default=3,
        description="Number of card columns (uses CSS grid auto-fill)"
    )


class CardGridBody(BaseModel):
    """
    Maps to → Storybook: Card > CardGrid, Card > ResourceCard, Card > HeroCard

    Used for: service overview pages (Monitor), dashboard widgets,
    marketplace browse, resource overview KPIs.

    LLM prompt: "Break the content into titled sections.  Each section
    has a grid of cards.  For each card: title, description, icon, and
    any action links (View, More, etc.)."
    """
    template: Literal["card_grid"] = "card_grid"
    storybook_ref: StorybookRef = Field(
        default_factory=lambda: StorybookRef(
            component="Card",
            story="GridLayout",
            import_path="src/stories/components/Card.stories.tsx",
        )
    )
    sections: list[CardGridSection] = Field(min_length=1)


# -- Settings Form Body -----------------------------------------------------

class FormFieldOption(BaseModel):
    """Option for radio groups, dropdowns, etc."""
    label: str
    value: str
    is_default: bool = Field(default=False)


class FormField(BaseModel):
    """One form control in a settings section."""
    type: FieldType
    label: str
    description: Optional[str] = Field(
        default=None,
        description="Helper text / tooltip content"
    )
    value: Optional[str] = Field(
        default=None,
        description="Current value for toggles ('Yes'/'No'), text inputs, etc."
    )
    options: list[FormFieldOption] = Field(
        default_factory=list,
        description="Options for radio_group, dropdown, combobox"
    )
    info_tooltip: bool = Field(
        default=False,
        description="Show an (i) info icon next to the label"
    )
    disabled: bool = Field(default=False)


class FormSection(BaseModel):
    """A titled group of form fields."""
    title: str = Field(description="Section heading, e.g. 'Default user role permissions'")
    learn_more_link: bool = Field(
        default=False,
        description="Show a 'Learn more' link below the heading"
    )
    fields: list[FormField] = Field(min_length=1)


class SettingsFormBody(BaseModel):
    """
    Maps to → Storybook: Input, Selection (Composed form pattern)

    Used for: User settings, resource configuration, policy settings.

    LLM prompt: "Break the settings into sections.  For each section,
    list the form controls: toggles, radio groups, text inputs, dropdowns.
    Include current values and available options."
    """
    template: Literal["settings_form"] = "settings_form"
    storybook_ref: StorybookRef = Field(
        default_factory=lambda: StorybookRef(
            component="Selection",
            story="Overview",
            import_path="src/stories/components/Selection.stories.tsx",
        )
    )
    sections: list[FormSection] = Field(min_length=1)
    show_save_cancel: bool = Field(
        default=True,
        description="Show Save / Cancel buttons at the bottom"
    )


# -- Landing Page Body -------------------------------------------------------

class ActionButton(BaseModel):
    """A CTA button on a landing page."""
    label: str
    variant: Literal["primary", "secondary", "outline"] = "primary"
    icon: Optional[str] = None


class LandingCard(BaseModel):
    """An illustration card on a landing page."""
    title: str
    description: Optional[str] = None
    illustration: Optional[str] = Field(
        default=None,
        description="Illustration asset name or placeholder description"
    )
    actions: list[ActionButton] = Field(default_factory=list)


class LandingPageBody(BaseModel):
    """
    Maps to → Storybook: Card > Default + Button > Primary/Secondary

    Used for: Resource Manager overview, service landing pages,
    empty states, getting-started pages.

    LLM prompt: "What is the centered heading?  Describe 1-3 illustration
    cards with their titles, descriptions, and action buttons."
    """
    template: Literal["landing_page"] = "landing_page"
    storybook_ref: StorybookRef = Field(
        default_factory=lambda: StorybookRef(
            component="FeatureCardsPage",
            story="Default",
            import_path="src/stories/templates/FeatureCardsPage.stories.tsx",
        )
    )
    heading: str = Field(description="Main centered heading")
    learn_more_link: bool = Field(default=False)
    cards: list[LandingCard] = Field(min_length=1)
    layout: Literal["side_by_side", "stacked"] = Field(
        default="side_by_side",
        description="Card arrangement"
    )


# -- Diagnostics / Search Body ----------------------------------------------

class AlertCard(BaseModel):
    """An alert/status card in the diagnostics view."""
    title: str
    description: str
    severity: InfoBannerIntent = Field(description="Visual severity")
    action_label: Optional[str] = Field(
        default=None,
        description="CTA link text, e.g. 'View guidance'"
    )
    count: Optional[int] = Field(
        default=None,
        description="Numeric count shown as a link, e.g. '9 Sign-ins...'"
    )


class DiagnosticsBody(BaseModel):
    """
    Maps to → Storybook: Input > Search + Card > Default + DataDisplay > MessageBar

    Used for: Diagnose and solve problems, troubleshooting pages.

    LLM prompt: "What is the search prompt text?  List the alert cards
    with their title, description, and severity."
    """
    template: Literal["diagnostics"] = "diagnostics"
    storybook_ref: StorybookRef = Field(
        default_factory=lambda: StorybookRef(
            component="SupportPage",
            story="Default",
            import_path="src/stories/templates/SupportPage.stories.tsx",
        )
    )
    search_heading: str = Field(
        default="How can we help you?",
        description="Heading above the search box"
    )
    search_placeholder: str = Field(
        default="Briefly describe the issue",
        description="Search input placeholder"
    )
    info_note: Optional[str] = Field(
        default=None,
        description="Informational note below search, e.g. privacy notice"
    )
    alert_section_title: Optional[str] = Field(default="Alerts")
    alerts: list[AlertCard] = Field(default_factory=list)


# -- Marketing / Feature Promotion Body -------------------------------------

class BenefitCard(BaseModel):
    """A benefit/feature card in a marketing section."""
    title: str = Field(description="Benefit heading, e.g. 'REDUCE COST'")
    description: str
    icon: Optional[str] = None


class MarketingBody(BaseModel):
    """
    Maps to → Storybook: Card > Default + DataDisplay > Overview

    Used for: feature upsell pages, password reset, premium feature promos.

    LLM prompt: "What is the hero heading?  Describe the feature pitch
    paragraph.  List benefit cards with titles and descriptions."
    """
    template: Literal["marketing"] = "marketing"
    storybook_ref: StorybookRef = Field(
        default_factory=lambda: StorybookRef(
            component="Card",
            story="Default",
            import_path="src/stories/components/Card.stories.tsx",
        )
    )
    hero_heading: str
    hero_description: str
    hero_icon: Optional[str] = Field(
        default=None,
        description="Large icon/illustration for the hero section"
    )
    benefits_heading: Optional[str] = Field(
        default=None,
        description="Heading above benefit cards, e.g. 'Why use self-service password reset?'"
    )
    benefits: list[BenefitCard] = Field(default_factory=list)
    upsell_banner: Optional[str] = Field(
        default=None,
        description="CTA banner text, e.g. 'Get a free Premium trial to use this feature →'"
    )


# -- Dashboard Body ----------------------------------------------------------

class DashboardWidget(BaseModel):
    """One widget tile on a dashboard."""
    title: str
    widget_type: Literal["resource_list", "quickstart_list", "promo_card", "kpi", "chart"] = Field(
        description="Type of widget content"
    )
    col_span: int = Field(default=1, description="Grid column span (1-3)")
    row_span: int = Field(default=1, description="Grid row span")
    items: list[dict[str, str]] = Field(
        default_factory=list,
        description=(
            "Widget content items.  Structure depends on widget_type.  "
            "e.g. resource_list: [{'name': 'coherence-preview', 'type': 'Static Web App'}]"
        )
    )


class DashboardBody(BaseModel):
    """
    Maps to → Storybook: Card > CardGrid (multi-column layout)

    Used for: Azure Dashboard, custom dashboards.

    LLM prompt: "Describe each dashboard widget: title, type (resource list,
    KPI, chart, quickstart list, promo), grid position, and sample data."
    """
    template: Literal["dashboard"] = "dashboard"
    storybook_ref: StorybookRef = Field(
        default_factory=lambda: StorybookRef(
            component="Card",
            story="GridLayout",
            import_path="src/stories/components/Card.stories.tsx",
        )
    )
    dashboard_name: str = Field(description="Dashboard title, e.g. 'My Dashboard'")
    visibility: Literal["private", "shared"] = Field(default="private")
    auto_refresh: Optional[str] = Field(
        default=None,
        description="Auto-refresh interval label, e.g. 'Every hour'"
    )
    widgets: list[DashboardWidget] = Field(min_length=1)
    grid_columns: int = Field(
        default=3,
        description="Number of grid columns"
    )


# -- Union type for all body templates --------------------------------------

BodyTemplate = Annotated[
    Union[
        DataGridBody,
        CardGridBody,
        SettingsFormBody,
        LandingPageBody,
        DiagnosticsBody,
        MarketingBody,
        DashboardBody,
    ],
    Field(discriminator="template"),
]


# ---------------------------------------------------------------------------
# Body Spec — wraps a template with optional tabs
# ---------------------------------------------------------------------------

class TabBody(BaseModel):
    """
    Associates a tab (by value) with its body content template.

    The `tab_value` must match one of the TabDefinition.value entries
    in tabs_spec.  Each tab gets exactly one body template — the LLM
    picks the template type and fills in its fields.
    """
    tab_value: str = Field(
        description=(
            "Must match a TabDefinition.value from tabs_spec — this is "
            "the key that binds the tab to its content."
        )
    )
    body: BodyTemplate = Field(
        description="The body template rendered when this tab is active"
    )


class BodySpec(BaseModel):
    """
    The main content area of the page.

    Two modes:
    1. **Direct** — no tabs, single body template
    2. **Tabbed** — PageTabs strip + one template per tab

    When tabbed, each TabBody.tab_value must correspond 1:1 with a
    TabDefinition.value in tabs_spec.  The builder renders a <PageTabs>
    strip and swaps the body template based on the selected tab.

    LLM prompt: "Does the body have tabs?  If yes, define each tab and
    its content template.  If no, pick one template and fill it in."
    """
    has_tabs: bool = Field(
        default=False,
        description="True if the content area has a PageTabs strip"
    )
    tabs_spec: Optional[TabsSpec] = Field(
        default=None,
        description="PageTabs strip definition (required if has_tabs is True)"
    )
    tab_bodies: Optional[list[TabBody]] = Field(
        default=None,
        description=(
            "One body template per tab.  Each entry's tab_value must match "
            "a TabDefinition.value in tabs_spec.  Order should match tab order."
        )
    )
    direct_body: Optional[BodyTemplate] = Field(
        default=None,
        description="Single body template (required if has_tabs is False)"
    )

    @model_validator(mode="after")
    def validate_tab_body_consistency(self) -> "BodySpec":
        if self.has_tabs:
            if self.tabs_spec is None:
                raise ValueError("tabs_spec is required when has_tabs is True")
            if not self.tab_bodies:
                raise ValueError("tab_bodies is required when has_tabs is True")
            tab_values = {t.value for t in self.tabs_spec.tabs}
            body_values = {tb.tab_value for tb in self.tab_bodies}
            if tab_values != body_values:
                missing = tab_values - body_values
                extra = body_values - tab_values
                parts = []
                if missing:
                    parts.append(f"tabs without bodies: {missing}")
                if extra:
                    parts.append(f"bodies without tabs: {extra}")
                raise ValueError(
                    f"tab_bodies must match tabs_spec 1:1. {'; '.join(parts)}"
                )
            if self.tabs_spec.default_tab not in tab_values:
                raise ValueError(
                    f"default_tab '{self.tabs_spec.default_tab}' is not in "
                    f"tab values: {tab_values}"
                )
        else:
            if self.direct_body is None:
                raise ValueError(
                    "direct_body is required when has_tabs is False"
                )
        return self


# ---------------------------------------------------------------------------
# Top-Level Page Spec
# ---------------------------------------------------------------------------

class PageSpec(BaseModel):
    """
    Complete specification for one Azure Portal page.

    This is the root object the LLM fills in.  Each field maps to a
    visible section of the page and references the Storybook component
    that renders it.

    ┌─────────────────────────────────────────┐
    │  breadcrumb                             │  → AzureBreadcrumb
    ├─────────────────────────────────────────┤
    │  page_header  (+ copilot_suggestions)   │  → PageTitleBar
    ├────────┬────────────────────────────────┤
    │        │  info_banner (optional)         │  → MessageBar
    │  side  │  command_bar (optional)         │  → CommandBar
    │  _nav  │  filter_bar (optional)          │  → FilterBar
    │        │  tabs (optional)                │  → TabList
    │(opt.)  │  body  (template)               │  → DataGrid / Card / Form / …
    │        │                                 │
    └────────┴─────────────────────────────────┘

    LLM workflow:
    1. Pick layout type (side_panel / full_width / dashboard)
    2. Pick page type (browse / detail / settings / …)
    3. Fill in each section top-to-bottom
    4. Pick body template and fill in its fields
    """

    # -- Metadata --
    page_id: str = Field(
        description="Unique identifier for the page, e.g. 'monitor-overview', 'rg-list'"
    )
    page_type: PageType
    layout: LayoutType
    service_name: str = Field(
        description="Azure service name, e.g. 'Monitor', 'Resource Manager', 'Microsoft Entra ID'"
    )
    resource_type: Optional[str] = Field(
        default=None,
        description="Resource type if applicable, e.g. 'Resource groups', 'Users', 'Virtual machines'"
    )

    # -- Structural sections (top-to-bottom order) --
    breadcrumb: BreadcrumbSpec
    page_header: PageHeaderSpec
    side_nav: Optional[SideNavSpec] = Field(
        default=None,
        description="Present when layout is 'side_panel'.  Omit for full_width."
    )
    info_banner: Optional[InfoBannerSpec] = Field(
        default=None,
        description="Optional warning/info banner at the top of the content area"
    )
    command_bar: Optional[CommandBarSpec] = Field(
        default=None,
        description="Optional action toolbar below the header"
    )
    filter_bar: Optional[FilterBarSpec] = Field(
        default=None,
        description="Optional search + filter controls (typical on browse pages)"
    )
    body: BodySpec = Field(
        description="Main content area — pick a template and fill in its fields"
    )


# ---------------------------------------------------------------------------
# JSON Schema export helper
# ---------------------------------------------------------------------------

def export_json_schema(path: str = "azure_page_spec.schema.json") -> None:
    """Write the JSON Schema to a file for non-Python consumers."""
    import json
    from pathlib import Path

    schema = PageSpec.model_json_schema()
    Path(path).write_text(json.dumps(schema, indent=2))
    print(f"Wrote JSON Schema to {path}")


if __name__ == "__main__":
    export_json_schema()
