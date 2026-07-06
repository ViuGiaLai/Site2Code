# Material UI (MUI)

> **Status: CUSTOM STUB** — Skill `mui/material-ui@material-ui-styling` chưa tải được (176 installs).
> Tham khảo: https://mui.com/material-ui/

## Khi dùng trong Site2Code

Áp dụng khi user chọn **Material UI** làm component library.

## Quy tắc sinh code

1. Setup: `@mui/material`, `@emotion/react`, `@emotion/styled`
2. ThemeProvider với custom palette từ design system JSON
3. Layout: `Container`, `Grid`, `Box`, `Stack`
4. Components: `AppBar`, `Button`, `Card`, `Typography`, `TextField`
5. Responsive: `Grid` với `xs`, `md`, `lg` breakpoints

## Mapping layout → MUI

| Section | Pattern |
|---------|---------|
| hero | `Container` + `Typography variant="h2"` |
| navbar | `AppBar` + `Toolbar` |
| features | `Grid container spacing={3}` |
| footer | `Box sx={{ bgcolor: 'grey.900', color: 'white' }}` |
