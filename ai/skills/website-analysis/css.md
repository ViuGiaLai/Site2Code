# CSS Analysis & Generation

> **Status: CUSTOM STUB** — Skill `heygen-com/hyperframes@css-animations` không phù hợp (chỉ về animation).
> Site2Code cần skill phân tích CSS layout từ website nguồn.

## Khi dùng trong Site2Code

Phân tích styles từ HTML crawl để trích xuất design system cho code generation.

## Quy tắc phân tích CSS

1. **Computed styles** từ Playwright: `getComputedStyle()` cho key elements
2. **Trích xuất**: colors, fonts, spacing, border-radius, shadows
3. **Loại bỏ**: vendor prefixes, `!important`, inline styles dư thừa
4. **Map sang output stack**:
   - Tailwind → utility classes + `tailwind.config.ts`
   - Bootstrap → grid + component classes
   - CSS Modules → scoped `.module.css`

## Design tokens output

```json
{
  "colors": { "primary": "#3b82f6", "background": "#ffffff" },
  "typography": { "fontFamily": "Inter, sans-serif", "baseSize": "16px" },
  "spacing": { "unit": "4px", "scale": [0, 4, 8, 16, 24, 32, 48, 64] },
  "borderRadius": { "sm": "4px", "md": "8px", "lg": "16px" }
}
```

## Responsive breakpoints

Detect từ media queries hoặc computed layout changes:
- mobile: < 768px
- tablet: 768px – 1024px
- desktop: > 1024px

## Tham khảo

- MDN CSS: https://developer.mozilla.org/en-US/docs/Web/CSS
- Tailwind migration: map hex colors → `bg-primary`, spacing → `p-4`, etc.
