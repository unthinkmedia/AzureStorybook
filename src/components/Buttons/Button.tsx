import React from 'react';
import {
  Button as FluentButton,
  CompoundButton as FluentCompoundButton,
  ToggleButton as FluentToggleButton,
  makeStyles,
  tokens,
  type ButtonProps as FluentButtonProps,
  type CompoundButtonProps as FluentCompoundButtonProps,
  type ToggleButtonProps as FluentToggleButtonProps,
} from '@fluentui/react-components';

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const useStyles = makeStyles({
  base: {
    fontFamily: tokens.fontFamilyBase,
  },
});

/* ------------------------------------------------------------------ */
/*  Button                                                             */
/* ------------------------------------------------------------------ */

export type ButtonProps = FluentButtonProps;

/**
 * Azure-styled wrapper around Fluent UI `Button`.
 *
 * Accepts the same props as `@fluentui/react-components` `Button`
 * and applies base Azure Portal font-family.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const styles = useStyles();
    return (
      <FluentButton
        ref={ref}
        {...props}
        className={props.className ? `${styles.base} ${props.className}` : styles.base}
      />
    );
  },
);
Button.displayName = 'Button';

/* ------------------------------------------------------------------ */
/*  CompoundButton                                                     */
/* ------------------------------------------------------------------ */

export type CompoundButtonProps = FluentCompoundButtonProps;

/**
 * Azure-styled wrapper around Fluent UI `CompoundButton`.
 */
export const CompoundButton = React.forwardRef<HTMLButtonElement, CompoundButtonProps>(
  (props, ref) => {
    const styles = useStyles();
    return (
      <FluentCompoundButton
        ref={ref}
        {...props}
        className={props.className ? `${styles.base} ${props.className}` : styles.base}
      />
    );
  },
);
CompoundButton.displayName = 'CompoundButton';

/* ------------------------------------------------------------------ */
/*  ToggleButton                                                       */
/* ------------------------------------------------------------------ */

export type ToggleButtonProps = FluentToggleButtonProps;

/**
 * Azure-styled wrapper around Fluent UI `ToggleButton`.
 */
export const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(
  (props, ref) => {
    const styles = useStyles();
    return (
      <FluentToggleButton
        ref={ref}
        {...props}
        className={props.className ? `${styles.base} ${props.className}` : styles.base}
      />
    );
  },
);
ToggleButton.displayName = 'ToggleButton';
