import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbDivider,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Home24Regular } from '@fluentui/react-icons';

export interface BreadcrumbPath {
  label: string;
  href?: string;
  current?: boolean;
}

export interface AzureBreadcrumbProps {
  items: BreadcrumbPath[];
}

const useStyles = makeStyles({
  root: {
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalL}`,
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
  },
});

export const AzureBreadcrumb: React.FC<AzureBreadcrumbProps> = ({ items }) => {
  const styles = useStyles();
  return (
    <div className={styles.root}>
      <Breadcrumb aria-label="Breadcrumb" size="small">
        <BreadcrumbItem>
          <BreadcrumbButton icon={<Home24Regular />}>Home</BreadcrumbButton>
        </BreadcrumbItem>
        {items.map((item, _i) => (
          <React.Fragment key={item.label}>
            <BreadcrumbDivider />
            <BreadcrumbItem>
              <BreadcrumbButton current={item.current}>{item.label}</BreadcrumbButton>
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </Breadcrumb>
    </div>
  );
};
