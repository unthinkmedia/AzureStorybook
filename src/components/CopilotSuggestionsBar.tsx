import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import {
  Button,
  MenuList,
  MenuItem,
  Popover,
  PopoverSurface,
  PopoverTrigger,
  Tag,
  makeStyles,
} from '@fluentui/react-components';
import { Dismiss20Regular } from '@fluentui/react-icons';

/* -------------------------------------------------------------------------- */
/*  Copilot Icon (official Microsoft Copilot full-color icon)                 */
/* -------------------------------------------------------------------------- */

export const CopilotIcon: React.FC<{ size?: number }> = ({ size = 20 }) => {
  const uid = useId();
  const id = (n: string) => `${uid}-${n}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M22.9253 4.97196C22.5214 3.79244 21.4126 3 20.1658 3L18.774 3C17.3622 3 16.1532 4.01106 15.9033 5.40051L14.4509 13.4782L15.0163 11.5829C15.3849 10.347 16.5215 9.5 17.8112 9.5L23.0593 9.5L25.3054 10.809L27.4705 9.5H26.5598C25.313 9.5 24.2042 8.70756 23.8003 7.52804L22.9253 4.97196Z" fill={`url(#${id('p0')})`} />
      <path d="M9.39637 27.0147C9.79613 28.2011 10.9084 29 12.1604 29H14.5727C16.1772 29 17.4805 27.704 17.4893 26.0995L17.5315 18.4862L16.9699 20.4033C16.6058 21.6461 15.4659 22.5 14.1708 22.5H8.88959L6.96437 21.0214L4.88007 22.5H5.78013C7.03206 22.5 8.14435 23.299 8.54411 24.4853L9.39637 27.0147Z" fill={`url(#${id('p1')})`} />
      <path d="M19.7501 3H8.81266C5.68767 3 3.81268 7.08916 2.56269 11.1783C1.08177 16.0229 -0.856044 22.5021 4.75017 22.5021H9.66051C10.9615 22.5021 12.105 21.6415 12.4657 20.3915C13.2784 17.5759 14.7501 12.4993 15.9014 8.65192C16.4758 6.73249 16.9543 5.08404 17.6886 4.05749C18.1003 3.48196 18.7864 3 19.7501 3Z" fill={`url(#${id('p2')})`} />
      <path d="M19.7501 3H8.81266C5.68767 3 3.81268 7.08916 2.56269 11.1783C1.08177 16.0229 -0.856044 22.5021 4.75017 22.5021H9.66051C10.9615 22.5021 12.105 21.6415 12.4657 20.3915C13.2784 17.5759 14.7501 12.4993 15.9014 8.65192C16.4758 6.73249 16.9543 5.08404 17.6886 4.05749C18.1003 3.48196 18.7864 3 19.7501 3Z" fill={`url(#${id('p3')})`} />
      <path d="M12.2478 29H23.1852C26.3102 29 28.1852 24.9103 29.4352 20.8207C30.9161 15.9755 32.854 9.49548 27.2477 9.49548H22.3375C21.0364 9.49548 19.893 10.3562 19.5322 11.6062C18.7196 14.4221 17.2479 19.4994 16.0965 23.3474C15.5221 25.2671 15.0436 26.9157 14.3093 27.9424C13.8976 28.518 13.2115 29 12.2478 29Z" fill={`url(#${id('p4')})`} />
      <path d="M12.2478 29H23.1852C26.3102 29 28.1852 24.9103 29.4352 20.8207C30.9161 15.9755 32.854 9.49548 27.2477 9.49548H22.3375C21.0364 9.49548 19.893 10.3562 19.5322 11.6062C18.7196 14.4221 17.2479 19.4994 16.0965 23.3474C15.5221 25.2671 15.0436 26.9157 14.3093 27.9424C13.8976 28.518 13.2115 29 12.2478 29Z" fill={`url(#${id('p5')})`} />
      <defs>
        <radialGradient id={id('p0')} cx="0" cy="0" r="1" gradientTransform="matrix(-7.37821 -8.55084 -7.96607 7.17216 25.5747 13.5466)" gradientUnits="userSpaceOnUse">
          <stop offset="0.0955758" stopColor="#00AEFF" />
          <stop offset="0.773185" stopColor="#2253CE" />
          <stop offset="1" stopColor="#0736C4" />
        </radialGradient>
        <radialGradient id={id('p1')} cx="0" cy="0" r="1" gradientTransform="matrix(6.61516 7.92888 7.80904 -6.47171 7.1753 21.9482)" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFB657" />
          <stop offset="0.633728" stopColor="#FF5F3D" />
          <stop offset="0.923392" stopColor="#C02B3C" />
        </radialGradient>
        <radialGradient id={id('p2')} cx="0" cy="0" r="1" gradientTransform="matrix(-0.990905 -17.2799 98.0282 -5.51056 8.54161 22.4952)" gradientUnits="userSpaceOnUse">
          <stop offset="0.03" stopColor="#FFC800" />
          <stop offset="0.31" stopColor="#98BD42" />
          <stop offset="0.49" stopColor="#52B471" />
          <stop offset="0.843838" stopColor="#0D91E1" />
        </radialGradient>
        <linearGradient id={id('p3')} x1="9.52186" y1="3" x2="10.3572" y2="22.5029" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3DCBFF" />
          <stop offset="0.246674" stopColor="#0588F7" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={id('p4')} cx="0" cy="0" r="1" gradientTransform="matrix(-8.64067 24.4636 -29.4075 -10.797 27.8096 7.58585)" gradientUnits="userSpaceOnUse">
          <stop offset="0.0661714" stopColor="#8C48FF" />
          <stop offset="0.5" stopColor="#F2598A" />
          <stop offset="0.895833" stopColor="#FFB152" />
        </radialGradient>
        <linearGradient id={id('p5')} x1="28.6736" y1="8.30469" x2="28.6627" y2="13.617" gradientUnits="userSpaceOnUse">
          <stop offset="0.0581535" stopColor="#F8ADFA" />
          <stop offset="0.708063" stopColor="#A86EDD" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface CopilotSuggestion {
  label: string;
  onClick?: () => void;
}

export interface CopilotSuggestionsBarProps {
  suggestions: CopilotSuggestion[];
  /** @deprecated Use automatic viewport-aware truncation instead. */
  maxVisible?: number;
  /** Called when the dismiss (X) button is clicked. */
  onDismiss?: () => void;
}

/* -------------------------------------------------------------------------- */
/*  Styles                                                                    */
/* -------------------------------------------------------------------------- */

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
    overflow: 'hidden',
    minWidth: 0,
  },
  copilotIcon: {
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  suggestions: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    overflow: 'hidden',
    flex: 1,
    minWidth: 0,
  },
  suggestionTag: {
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  overflowTag: {
    whiteSpace: 'nowrap',
    flexShrink: 0,
    cursor: 'pointer',
  },
  dismissButton: {
    marginLeft: 'auto',
    flexShrink: 0,
  },
  overflowMenu: {
    padding: '4px 0',
  },
  overflowMenuItem: {
    cursor: 'pointer',
  },
  measureContainer: {
    position: 'absolute',
    visibility: 'hidden',
    pointerEvents: 'none',
    display: 'flex',
    gap: '6px',
    whiteSpace: 'nowrap',
    height: 0,
    overflow: 'hidden',
  },
});

/* -------------------------------------------------------------------------- */
/*  Overflow measurement hook                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Measures which suggestion pills fit within the available container width.
 * Uses ResizeObserver to recalculate on viewport/container resize.
 */
function useOverflowCount(
  containerRef: React.RefObject<HTMLDivElement | null>,
  measureRef: React.RefObject<HTMLDivElement | null>,
  totalCount: number,
) {
  const [visibleCount, setVisibleCount] = useState(1);

  const recalculate = useCallback(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const children = Array.from(measure.children) as HTMLElement[];
    if (children.length === 0) return;

    const containerWidth = container.getBoundingClientRect().width;
    const gap = 6;
    const overflowTagWidth = 50;

    let usedWidth = 0;
    let fitCount = 0;

    for (let i = 0; i < children.length; i++) {
      const childWidth = children[i].getBoundingClientRect().width;
      const gapBefore = i > 0 ? gap : 0;
      const wouldNeedOverflow = i < totalCount - 1;
      const reserve = wouldNeedOverflow ? overflowTagWidth + gap : 0;

      if (usedWidth + gapBefore + childWidth + reserve > containerWidth) break;
      usedWidth += gapBefore + childWidth;
      fitCount++;
    }

    setVisibleCount(Math.max(1, fitCount));
  }, [containerRef, measureRef, totalCount]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => recalculate());
    ro.observe(container);
    recalculate();

    return () => ro.disconnect();
  }, [containerRef, recalculate]);

  useEffect(() => {
    requestAnimationFrame(() => recalculate());
  }, [totalCount, recalculate]);

  return visibleCount;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export const CopilotSuggestionsBar: React.FC<CopilotSuggestionsBarProps> = ({
  suggestions,
  onDismiss,
}) => {
  const styles = useStyles();
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [overflowOpen, setOverflowOpen] = useState(false);

  const visibleCount = useOverflowCount(suggestionsRef, measureRef, suggestions.length);

  if (!suggestions || suggestions.length === 0) return null;

  const visible = suggestions.slice(0, visibleCount);
  const overflowItems = suggestions.slice(visibleCount);
  const overflowCount = overflowItems.length;

  return (
    <div className={styles.root}>
      <span className={styles.copilotIcon}>
        <CopilotIcon size={20} />
      </span>
      {/* Hidden measurement container — renders all pills for width calculation */}
      <div className={styles.measureContainer} ref={measureRef} aria-hidden="true">
        {suggestions.map((s) => (
          <Tag key={s.label} size="small" shape="circular" appearance="outline">
            {s.label}
          </Tag>
        ))}
      </div>
      <div className={styles.suggestions} ref={suggestionsRef}>
        {visible.map((s) => (
          <Tag
            key={s.label}
            size="small"
            shape="circular"
            appearance="outline"
            className={styles.suggestionTag}
            onClick={s.onClick}
          >
            {s.label}
          </Tag>
        ))}
        {overflowCount > 0 && (
          <Popover
            open={overflowOpen}
            onOpenChange={(_e, data) => setOverflowOpen(data.open)}
            positioning="below-start"
          >
            <PopoverTrigger disableButtonEnhancement>
              <Tag
                data-overflow="true"
                size="small"
                shape="circular"
                appearance="outline"
                className={styles.overflowTag}
                onClick={() => setOverflowOpen((prev) => !prev)}
                aria-label={`Show ${overflowCount} more suggestions`}
              >
                +{overflowCount}
              </Tag>
            </PopoverTrigger>
            <PopoverSurface>
              <MenuList className={styles.overflowMenu}>
                {overflowItems.map((s) => (
                  <MenuItem
                    key={s.label}
                    className={styles.overflowMenuItem}
                    onClick={() => {
                      setOverflowOpen(false);
                      s.onClick?.();
                    }}
                  >
                    {s.label}
                  </MenuItem>
                ))}
              </MenuList>
            </PopoverSurface>
          </Popover>
        )}
      </div>
      {onDismiss && (
        <Button
          appearance="subtle"
          icon={<Dismiss20Regular />}
          size="small"
          aria-label="Dismiss suggestions"
          className={styles.dismissButton}
          onClick={onDismiss}
        />
      )}
    </div>
  );
};
