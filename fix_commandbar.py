import re

with open('/tmp/design-system-skins/src/components/CommandBar.tsx', 'r') as f:
    content = f.read()

content = content.replace("padding: '0 8px',", "padding: `0 ${tokens.spacingHorizontalS}`,")
content = content.replace("minHeight: '36px',", "minHeight: tokens.spacingHorizontalXXXL, // closest available token")
content = content.replace("borderBottom: `1px solid", "borderBottom: `${tokens.strokeWidthThin} solid")
content = content.replace("gap: '0px',", "gap: '0',")
content = content.replace("padding: '4px 8px',", "padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,")
content = content.replace("height: '32px',", "height: tokens.spacingHorizontalXXXL, // closest available token")
content = content.replace("fontSize: '13px',", "fontSize: tokens.fontSizeBase200,")
content = content.replace("gap: '4px',", "gap: tokens.spacingHorizontalXS,")
content = content.replace("fontSize: '12px',", "fontSize: tokens.fontSizeBase200,")
content = content.replace("minWidth: '32px',", "minWidth: tokens.spacingHorizontalXXXL, // closest available token")
content = content.replace("padding: '4px 6px',", "padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalSNudge}`,")
content = content.replace("height: '20px',", "height: tokens.spacingHorizontalXL, // closest available token")
content = content.replace("margin: '0 4px',", "margin: `0 ${tokens.spacingHorizontalXS}`,")
content = content.replace("fontSize: '20px',", "fontSize: tokens.fontSizeBase500,")

with open('/tmp/design-system-skins/src/components/CommandBar.tsx', 'w') as f:
    f.write(content)
