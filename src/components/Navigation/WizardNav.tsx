import React from 'react';
import { makeStyles, tokens, mergeClasses } from '@fluentui/react-components';
import { Checkmark16Filled, ErrorCircle16Regular } from '@fluentui/react-icons';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type WizardStepStatus = 'not-started' | 'current' | 'completed' | 'error';

export interface WizardStep {
  /** Unique key for the step */
  key: string;
  /** Display label */
  label: string;
  /** Step status — defaults to 'not-started' */
  status?: WizardStepStatus;
  /** Optional sublabel / description shown beneath the label */
  description?: string;
}

export interface WizardNavProps {
  /** Ordered list of wizard steps */
  steps: WizardStep[];
  /** Layout orientation */
  orientation?: 'vertical' | 'horizontal';
  /** Called when a completed (previously visited) step is clicked */
  onStepClick?: (key: string) => void;
  /** Additional className on the root */
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*  Styles                                                                    */
/* -------------------------------------------------------------------------- */

const CIRCLE_SIZE = 32;
const CONNECTOR_THICKNESS = 2;

const useStyles = makeStyles({
  /* ── Root ── */
  root: {
    display: 'flex',
    userSelect: 'none',
  },
  vertical: {
    flexDirection: 'column',
    gap: '0',
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  /* ── Step wrapper ── */
  step: {
    display: 'flex',
    alignItems: 'flex-start',
    position: 'relative',
  },
  stepVertical: {
    flexDirection: 'row',
    gap: tokens.spacingHorizontalM,
  },
  stepHorizontal: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    minWidth: '80px', // functional layout
  },

  /* ── Indicator column (circle + connector) ── */
  indicatorCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexShrink: 0,
  },
  indicatorRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    width: '100%',
    justifyContent: 'center',
  },

  /* ── Circle ── */
  circle: {
    width: `${CIRCLE_SIZE}px`, // functional layout
    height: `${CIRCLE_SIZE}px`, // functional layout
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: tokens.fontSizeBase300,
    fontWeight: 600,
    flexShrink: 0,
    transitionProperty: 'background, color, border-color',
    transitionDuration: '150ms',
    zIndex: 1,
  },
  circleCurrent: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    border: 'none',
  },
  circleCompleted: {
    backgroundColor: tokens.colorStatusSuccessBackground3,
    color: tokens.colorNeutralForegroundOnBrand,
    border: 'none',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorStatusSuccessForeground1,
    },
  },
  circleNotStarted: {
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground3,
    border: `${CONNECTOR_THICKNESS}px solid ${tokens.colorNeutralStroke1}`, // functional layout
  },
  circleError: {
    backgroundColor: tokens.colorStatusDangerBackground3,
    color: tokens.colorNeutralForegroundOnBrand,
    border: 'none',
  },

  /* ── Connector lines ── */
  connectorVertical: {
    width: `${CONNECTOR_THICKNESS}px`, // functional layout
    minHeight: '24px', // functional layout
    flex: 1,
    backgroundColor: tokens.colorNeutralStroke1,
  },
  connectorVerticalCompleted: {
    backgroundColor: tokens.colorStatusSuccessBackground3,
  },
  connectorHorizontalWrapper: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    minWidth: '24px', // functional layout
  },
  connectorHorizontal: {
    height: `${CONNECTOR_THICKNESS}px`, // functional layout
    width: '100%',
    backgroundColor: tokens.colorNeutralStroke1,
  },
  connectorHorizontalCompleted: {
    backgroundColor: tokens.colorStatusSuccessBackground3,
  },

  /* ── Labels ── */
  labelBlock: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: tokens.spacingVerticalXS,
    paddingBottom: tokens.spacingVerticalL,
  },
  labelBlockHorizontal: {
    alignItems: 'center',
    textAlign: 'center',
    paddingTop: tokens.spacingVerticalS,
    paddingBottom: '0',
  },
  label: {
    fontSize: tokens.fontSizeBase300,
    fontWeight: 600,
    lineHeight: tokens.lineHeightBase300,
    color: tokens.colorNeutralForeground1,
  },
  labelNotStarted: {
    color: tokens.colorNeutralForeground3,
    fontWeight: 400,
  },
  description: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: 400,
    lineHeight: tokens.lineHeightBase200,
    color: tokens.colorNeutralForeground3,
    marginTop: tokens.spacingVerticalXXS,
  },
});

/* -------------------------------------------------------------------------- */
/*  Step indicator                                                            */
/* -------------------------------------------------------------------------- */

const StepCircle: React.FC<{
  index: number;
  status: WizardStepStatus;
  className: string;
}> = ({ index, status, className }) => {
  if (status === 'completed') {
    return (
      <div className={className}>
        <Checkmark16Filled />
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className={className}>
        <ErrorCircle16Regular />
      </div>
    );
  }
  return <div className={className}>{index + 1}</div>;
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export const WizardNav: React.FC<WizardNavProps> = ({
  steps,
  orientation = 'vertical',
  onStepClick,
  className,
}) => {
  const styles = useStyles();
  const isVertical = orientation === 'vertical';

  return (
    <nav
      className={mergeClasses(
        styles.root,
        isVertical ? styles.vertical : styles.horizontal,
        className,
      )}
      aria-label="Wizard navigation"
    >
      {steps.map((step, i) => {
        const status = step.status ?? 'not-started';
        const isLast = i === steps.length - 1;
        const clickable = status === 'completed' && !!onStepClick;

        const circleClass = mergeClasses(
          styles.circle,
          status === 'current' && styles.circleCurrent,
          status === 'completed' && styles.circleCompleted,
          status === 'not-started' && styles.circleNotStarted,
          status === 'error' && styles.circleError,
        );

        const handleClick = clickable ? () => onStepClick!(step.key) : undefined;

        if (isVertical) {
          return (
            <div key={step.key} className={mergeClasses(styles.step, styles.stepVertical)}>
              {/* Indicator column: circle + connector */}
              <div className={styles.indicatorCol}>
                <StepCircle index={i} status={status} className={circleClass} />
                {!isLast && (
                  <div
                    className={mergeClasses(
                      styles.connectorVertical,
                      status === 'completed' && styles.connectorVerticalCompleted,
                    )}
                  />
                )}
              </div>

              {/* Label */}
              <div
                className={styles.labelBlock}
                onClick={handleClick}
                style={{ cursor: clickable ? 'pointer' : undefined }}
                role={clickable ? 'button' : undefined}
                tabIndex={clickable ? 0 : undefined}
                aria-current={status === 'current' ? 'step' : undefined}
              >
                <span
                  className={mergeClasses(
                    styles.label,
                    status === 'not-started' && styles.labelNotStarted,
                  )}
                >
                  {step.label}
                </span>
                {step.description && <span className={styles.description}>{step.description}</span>}
              </div>
            </div>
          );
        }

        /* ── Horizontal ── */
        return (
          <React.Fragment key={step.key}>
            <div className={mergeClasses(styles.step, styles.stepHorizontal)}>
              {/* Circle */}
              <StepCircle index={i} status={status} className={circleClass} />
              {/* Label below */}
              <div
                className={mergeClasses(styles.labelBlock, styles.labelBlockHorizontal)}
                onClick={handleClick}
                style={{ cursor: clickable ? 'pointer' : undefined }}
                role={clickable ? 'button' : undefined}
                tabIndex={clickable ? 0 : undefined}
                aria-current={status === 'current' ? 'step' : undefined}
              >
                <span
                  className={mergeClasses(
                    styles.label,
                    status === 'not-started' && styles.labelNotStarted,
                  )}
                >
                  {step.label}
                </span>
                {step.description && <span className={styles.description}>{step.description}</span>}
              </div>
            </div>
            {/* Horizontal connector between steps */}
            {!isLast && (
              <div className={styles.connectorHorizontalWrapper}>
                <div
                  className={mergeClasses(
                    styles.connectorHorizontal,
                    status === 'completed' && styles.connectorHorizontalCompleted,
                  )}
                  style={{ marginTop: `${CIRCLE_SIZE / 2}px` }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
