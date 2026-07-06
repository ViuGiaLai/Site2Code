# DOM Parser

> **Status: CUSTOM STUB** — Không có skill DOM parser chuyên dụng trên skills.sh.
> Site2Code dùng Cheerio (Node.js) cho DOM parsing.

## Khi dùng trong Site2Code

Bước sau Playwright crawl — rút gọn DOM trước khi gửi cho AI phân tích layout.

## Quy tắc parse DOM

1. **Giữ lại**: semantic tags (`header`, `nav`, `main`, `section`, `footer`, `article`)
2. **Loại bỏ**: `<script>`, `<style>`, inline event handlers, comments
3. **Rút gọn**: attributes chỉ giữ `class`, `id`, `href`, `src`, `alt`, `role`, `aria-*`
4. **Text**: truncate text nodes > 200 ký tự
5. **Depth limit**: tối đa 8 cấp nesting

## Output schema

```json
{
  "title": "Page Title",
  "meta": { "description": "...", "og:image": "..." },
  "sections": [
    {
      "tag": "section",
      "role": "hero",
      "children": 3,
      "textPreview": "Welcome to...",
      "classes": ["hero", "bg-primary"]
    }
  ],
  "links": 12,
  "images": 5,
  "forms": 1
}
```

## Thư viện

- **Cheerio** (primary): `cheerio.load(html)`
- **Playwright**: `page.content()` cho rendered HTML

Xem thêm: `crawler/cheerio.md`
