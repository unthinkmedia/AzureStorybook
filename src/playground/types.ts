/**
 * TypeScript types mirroring the Pydantic PageSpec schema.
 * These types match the JSON output from azure_page_spec.py 1:1.
 */

// ─── Enums ───────────────────────────────────────────────────────

export type LayoutType = 'side_panel' | 'full_width' | 'dashboard';
export type PageType = 'browse' | 'detail' | 'settings' | 'create' | 'landing' | 'diagnostics' | 'marketing' | 'overview';
export type NavItemType = 'link' | 'divider' | 'group_header';
export type FieldType = 'toggle' | 'radio_group' | 'checkbox' | 'text_input' | 'dropdown' | 'combobox' | 'slider' | 'spin_button';
export type BadgeColor = 'success' | 'danger' | 'warning' | 'informative' | 'important' | 'subtle' | 'brand';
export type InfoBannerIntent = 'info' | 'warning' | 'error' | 'success';

// ─── Structural Sections ─────────────────────────────────────────

export interface BreadcrumbItem {
  label: string;
  href?: string | null;
  is_current?: boolean;
}

export interface BreadcrumbSpec {
  items: BreadcrumbItem[];
}

export interface CopilotSuggestion {
  label: string;
  prompt: string;
}

export interface PageHeaderSpec {
  title: string;
  subtitle?: string | null;
  icon?: string | null;
  show_star?: boolean;
  show_more_actions?: boolean;
  copilot_suggestions?: CopilotSuggestion[];
}

export interface NavItem {
  type?: NavItemType;
  label?: string | null;
  icon?: string | null;
  is_selected?: boolean;
  children?: NavItem[] | null;
}

export interface SideNavSpec {
  width_px?: number;
  collapsible?: boolean;
  search_enabled?: boolean;
  items: NavItem[];
}

export interface CommandAction {
  label: string;
  icon?: string | null;
  is_primary?: boolean;
  has_dropdown?: boolean;
  disabled?: boolean;
}

export interface CommandBarSpec {
  actions: CommandAction[];
}

export interface InfoBannerSpec {
  intent: InfoBannerIntent;
  message: string;
  action_label?: string | null;
  dismissible?: boolean;
}

export interface FilterDefinition {
  field: string;
  placeholder?: string | null;
  multi_select?: boolean;
  options?: string[];
}

export interface ActiveFilter {
  field: string;
  value: string;
  operator?: string;
}

export interface FilterBarSpec {
  search_placeholder?: string;
  filters?: FilterDefinition[];
  active_filters?: ActiveFilter[];
}

export interface TabDefinition {
  value: string;
  label: string;
  icon?: string | null;
  disabled?: boolean;
  badge_count?: number | null;
}

export interface TabsSpec {
  tabs: TabDefinition[];
  default_tab: string;
  size?: 'small' | 'medium' | 'large';
}

// ─── Body Templates ──────────────────────────────────────────────

export interface ColumnDefinition {
  key: string;
  label: string;
  sortable?: boolean;
  is_link?: boolean;
  badge_color_map?: Record<string, BadgeColor> | null;
  width?: string | null;
}

export interface RowData {
  cells: Record<string, string>;
}

export interface DataGridBody {
  template: 'data_grid';
  columns: ColumnDefinition[];
  rows?: RowData[];
  selectable?: boolean;
  pagination?: boolean;
  total_count?: number | null;
  group_by?: string | null;
}

export interface CardAction {
  label: string;
  icon?: string | null;
  href?: string | null;
}

export interface CardItem {
  title: string;
  description?: string | null;
  icon?: string | null;
  badge?: string | null;
  badge_color?: BadgeColor | null;
  actions?: CardAction[];
  metrics?: Record<string, string> | null;
}

export interface CardGridSection {
  title: string;
  subtitle?: string | null;
  view_all_link?: string | null;
  cards: CardItem[];
  columns?: number;
}

export interface CardGridBody {
  template: 'card_grid';
  sections: CardGridSection[];
}

export interface FormFieldOption {
  label: string;
  value: string;
  is_default?: boolean;
}

export interface FormField {
  type: FieldType;
  label: string;
  description?: string | null;
  value?: string | null;
  options?: FormFieldOption[];
  info_tooltip?: boolean;
  disabled?: boolean;
}

export interface FormSection {
  title: string;
  learn_more_link?: boolean;
  fields: FormField[];
}

export interface SettingsFormBody {
  template: 'settings_form';
  sections: FormSection[];
  show_save_cancel?: boolean;
}

export interface ActionButton {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: string | null;
}

export interface LandingCard {
  title: string;
  description?: string | null;
  illustration?: string | null;
  actions?: ActionButton[];
}

export interface LandingPageBody {
  template: 'landing_page';
  heading: string;
  learn_more_link?: boolean;
  cards: LandingCard[];
  layout?: 'side_by_side' | 'stacked';
}

export interface AlertCard {
  title: string;
  description: string;
  severity: InfoBannerIntent;
  action_label?: string | null;
  count?: number | null;
}

export interface DiagnosticsBody {
  template: 'diagnostics';
  search_heading?: string;
  search_placeholder?: string;
  info_note?: string | null;
  alert_section_title?: string | null;
  alerts?: AlertCard[];
}

export interface BenefitCard {
  title: string;
  description: string;
  icon?: string | null;
}

export interface MarketingBody {
  template: 'marketing';
  hero_heading: string;
  hero_description: string;
  hero_icon?: string | null;
  benefits_heading?: string | null;
  benefits?: BenefitCard[];
  upsell_banner?: string | null;
}

export interface DashboardWidget {
  title: string;
  widget_type: 'resource_list' | 'quickstart_list' | 'promo_card' | 'kpi' | 'chart';
  col_span?: number;
  row_span?: number;
  items?: Record<string, string>[];
}

export interface DashboardBody {
  template: 'dashboard';
  dashboard_name: string;
  visibility?: 'private' | 'shared';
  auto_refresh?: string | null;
  widgets: DashboardWidget[];
  grid_columns?: number;
}

export type BodyTemplate =
  | DataGridBody
  | CardGridBody
  | SettingsFormBody
  | LandingPageBody
  | DiagnosticsBody
  | MarketingBody
  | DashboardBody;

export interface TabBody {
  tab_value: string;
  body: BodyTemplate;
}

export interface BodySpec {
  has_tabs: boolean;
  tabs_spec?: TabsSpec | null;
  tab_bodies?: TabBody[] | null;
  direct_body?: BodyTemplate | null;
}

// ─── Top-Level PageSpec ──────────────────────────────────────────

export interface PageSpec {
  page_id: string;
  page_type: PageType;
  layout: LayoutType;
  service_name: string;
  resource_type?: string | null;
  breadcrumb: BreadcrumbSpec;
  page_header: PageHeaderSpec;
  side_nav?: SideNavSpec | null;
  info_banner?: InfoBannerSpec | null;
  command_bar?: CommandBarSpec | null;
  filter_bar?: FilterBarSpec | null;
  body: BodySpec;
}
