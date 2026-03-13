import React from 'react';
import { Button, Link, Text, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${tokens.spacingVerticalXXXL} ${tokens.spacingHorizontalXXL}`,
    textAlign: 'center',
    gap: tokens.spacingVerticalM,
    minHeight: '300px', // functional layout
  },
  illustration: {
    width: '120px', // layout constant (illustration size)
    height: '120px', // layout constant (illustration size)
    marginBottom: tokens.spacingVerticalS,
  },
  title: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  description: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
    maxWidth: '400px', // functional layout max-width
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: tokens.spacingVerticalS,
    marginTop: tokens.spacingVerticalS,
  },
  inlineText: {
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalXXL}`,
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase300,
  },
});

const PlaceholderIllustration: React.FC = () => (
  <svg
    width="120"
    height="120"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect x="30" y="20" width="60" height="50" rx="4" fill={tokens.colorNeutralStroke2} />
    <rect x="36" y="28" width="36" height="6" rx="2" fill={tokens.colorNeutralBackground5} />
    <rect x="36" y="38" width="48" height="4" rx="2" fill={tokens.colorNeutralBackground5} />
    <rect x="36" y="46" width="48" height="4" rx="2" fill={tokens.colorNeutralBackground5} />
    <rect x="36" y="54" width="28" height="4" rx="2" fill={tokens.colorNeutralBackground5} />
    <circle cx="76" cy="70" r="12" fill={tokens.colorNeutralStroke2} />
    <circle cx="82" cy="76" r="6" fill={tokens.colorNeutralBackground5} />
    <line
      x1="60"
      y1="70"
      x2="70"
      y2="80"
      stroke={tokens.colorNeutralStroke2}
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

export interface NullStateProps {
  /** Variant: "illustration" shows a centered graphic + text, "text" shows inline text only */
  variant?: 'illustration' | 'text';
  /** Title text shown below illustration or as the inline text */
  title: string;
  /** Optional description text */
  description?: string;
  /** Primary action button label */
  primaryActionLabel?: string;
  /** Primary action callback */
  onPrimaryAction?: () => void;
  /** Learn more link label */
  learnMoreLabel?: string;
  /** Learn more callback */
  onLearnMore?: () => void;
  /** Custom illustration element (defaults to a placeholder) */
  illustration?: React.ReactNode;
}

export const NullState: React.FC<NullStateProps> = ({
  variant = 'illustration',
  title,
  description,
  primaryActionLabel,
  onPrimaryAction,
  learnMoreLabel = 'Learn more',
  onLearnMore,
  illustration,
}) => {
  const styles = useStyles();

  if (variant === 'text') {
    return (
      <div className={styles.inlineText}>
        <Text size={300}>{title}</Text>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.illustration}>{illustration ?? <PlaceholderIllustration />}</div>
      <Text className={styles.title}>{title}</Text>
      {description && <Text className={styles.description}>{description}</Text>}
      {(primaryActionLabel || onLearnMore) && (
        <div className={styles.actions}>
          {primaryActionLabel && (
            <Button appearance="primary" onClick={onPrimaryAction}>
              {primaryActionLabel}
            </Button>
          )}
          {onLearnMore && <Link onClick={onLearnMore}>{learnMoreLabel}</Link>}
        </div>
      )}
    </div>
  );
};
