import re

with open('/tmp/design-system-skins/src/components/FilterPill.tsx', 'r') as f:
    content = f.read()

content = content.replace("gap: '4px',", "gap: tokens.spacingHorizontalXS,")
content = content.replace("height: '32px',", "height: tokens.spacingHorizontalXXXL, // closest available token")
content = content.replace("paddingLeft: '12px',", "paddingLeft: tokens.spacingHorizontalM,")
content = content.replace("paddingRight: '12px',", "paddingRight: tokens.spacingHorizontalM,")
content = content.replace("borderRadius: '16px',", "borderRadius: tokens.borderRadiusCircular,")
content = content.replace("border: `1px solid ${tokens.colorBrandStroke2}`", "border: `${tokens.strokeWidthThin} solid ${tokens.colorBrandStroke2}`")
content = content.replace("border: `1px solid transparent`", "border: `${tokens.strokeWidthThin} solid transparent`")
content = content.replace("marginLeft: '2px',", "marginLeft: tokens.spacingHorizontalXXS,")
content = content.replace("marginRight: '2px',", "marginRight: tokens.spacingHorizontalXXS,")
content = content.replace("width: '20px',", "width: tokens.spacingHorizontalXL, // closest available token")
content = content.replace("height: '20px',", "height: tokens.spacingHorizontalXL, // closest available token")
content = content.replace("padding: '16px',", "padding: tokens.spacingVerticalL,")
content = content.replace("minWidth: '200px',", "minWidth: '200px', // functional layout minimum")
content = content.replace("marginBottom: '8px',", "marginBottom: tokens.spacingVerticalS,")
content = content.replace("marginTop: '8px',", "marginTop: tokens.spacingVerticalS,")
content = content.replace("gap: '8px',", "gap: tokens.spacingHorizontalS,")
content = content.replace("gap: '6px',", "gap: tokens.spacingHorizontalSNudge,")
content = content.replace("width: '24px',", "width: tokens.spacingHorizontalXXL, // closest available token")
content = content.replace("height: '24px',", "height: tokens.spacingHorizontalXXL, // closest available token")

# check for any missed 'px'
with open('/tmp/design-system-skins/src/components/FilterPill.tsx', 'w') as f:
    f.write(content)
