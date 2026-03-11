import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardHeader,
  CardFooter,
  Button,
  Text,
  Body1,
  Caption1,
  Badge,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Open24Regular, MoreHorizontal24Regular, ArrowRight24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
    padding: '16px',
  },
  heroCard: {
    padding: '24px',
    minHeight: '160px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  kpiValue: {
    fontSize: tokens.fontSizeHero800,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1,
    lineHeight: '1',
  },
});

const meta: Meta<typeof Card> = {
  title: 'Components/Cards/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'], description: 'Card size variant' },
    orientation: { control: 'select', options: ['horizontal', 'vertical'], description: 'Layout direction' },
    appearance: { control: 'select', options: ['filled', 'filled-alternative', 'outline', 'subtle'], description: 'Visual style' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Fluent UI Card is a surface container for grouping related information and actions with optional selection behavior. Use this when you need to present a bounded content block — such as a resource summary, metric tile, or action shortcut. Choose this over plain divs when you need hover elevation, focus ring, and selection states.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card style={{ maxWidth: 360 }}>
      <CardHeader
        header={<Text weight="semibold">Virtual Machines</Text>}
        description={<Caption1>3 running instances</Caption1>}
        action={<Button appearance="transparent" icon={<MoreHorizontal24Regular />} aria-label="More" />}
      />
      <Body1>
        Manage your virtual machine resources. View status, performance metrics, and configuration.
      </Body1>
      <CardFooter>
        <Button appearance="primary" icon={<Open24Regular />}>Open</Button>
        <Button appearance="outline">Settings</Button>
      </CardFooter>
    </Card>
  ),

  parameters: {
    docs: {
      description: {
        story:
          'Basic Card with icon, title, and description text. Cards are surface containers that group related information.',
      },
    },
  },
};

/** Card with a status badge in the header and inline metrics below. */
export const WithStatusBadge: Story = {
  render: () => (
    <Card style={{ maxWidth: 360 }}>
      <CardHeader
        header={<Text weight="semibold">Item name</Text>}
        description={<Caption1>Category | Region</Caption1>}
        action={<Badge appearance="filled" color="success">Active</Badge>}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 16px 12px' }}>
        <div>
          <Caption1>Metric A</Caption1>
          <Text size={500} weight="semibold" block>12,847</Text>
        </div>
        <div>
          <Caption1>Metric B</Caption1>
          <Text size={500} weight="semibold" block>142ms</Text>
        </div>
        <div>
          <Caption1>Errors</Caption1>
          <Text size={500} weight="semibold" style={{ color: tokens.colorPaletteRedForeground1 }} block>23</Text>
        </div>
      </div>
    </Card>
  ),
};

/** Large single-metric card with a KPI value, trend indicator, and action link. */
export const WithLargeMetric: Story = {
  render: () => {
    const styles = useStyles();
    return (
      <Card className={styles.heroCard} style={{ maxWidth: 360 }}>
        <div>
          <Caption1>Primary metric</Caption1>
          <div className={styles.kpiValue}>$2,847</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Caption1>↓ 12% from previous period</Caption1>
          <Button appearance="subtle" icon={<ArrowRight24Regular />}>View details</Button>
        </div>
      </Card>
    );
  },
};

/** Responsive grid of cards using auto-fill columns. */
export const GridLayout: Story = {
  render: () => {
    const styles = useStyles();
    const services = [
      { name: 'Category A', count: 12, status: 'Active' },
      { name: 'Category B', count: 8, status: 'Active' },
      { name: 'Category C', count: 5, status: 'Active' },
      { name: 'Category D', count: 15, status: 'Active' },
      { name: 'Category E', count: 3, status: 'Active' },
      { name: 'Category F', count: 4, status: 'Active' },
    ];
    return (
      <div className={styles.cardGrid}>
        {services.map((svc) => (
          <Card key={svc.name}>
            <CardHeader
              header={<Text weight="semibold">{svc.name}</Text>}
              description={<Caption1>{svc.count} resources</Caption1>}
              action={<Badge appearance="tint" color="success">{svc.status}</Badge>}
            />
            <CardFooter>
              <Button appearance="subtle" icon={<ArrowRight24Regular />}>View all</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  },
};
