import React from 'react';

export interface AzureServiceIconProps {
  /** Name of the Azure service (matches filename in public/azure-icons/). */
  name: string;
  /** Icon size in pixels (default: 24). */
  size?: number;
  className?: string;
}

/**
 * Renders an official Azure service icon from IconCloud.design SVGs stored in
 * `public/azure-icons/`. The `name` maps to the filename (kebab-case).
 *
 * Available icons: management-groups, subscriptions, monitor, resource-groups, key-vaults
 *
 * To add more: download from https://iconcloud.design/browse/Azure%20Icons and
 * save to `public/azure-icons/<name>.svg`
 */
export const AzureServiceIcon: React.FC<AzureServiceIconProps> = ({
  name,
  size = 24,
  className,
}) => (
  <img
    src={`/azure-icons/${name}.svg`}
    alt={`${name} icon`}
    width={size}
    height={size}
    className={className}
    style={{ display: 'block' }}
  />
);
