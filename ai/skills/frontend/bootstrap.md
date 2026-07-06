# Bootstrap CSS

> **Status: CUSTOM STUB** — Không có skill Bootstrap chuyên dụng trên skills.sh.
> Cần viết nội dung custom hoặc tham khảo https://getbootstrap.com/docs/

## Khi dùng trong Site2Code

Áp dụng khi user chọn **Bootstrap** làm CSS framework cho output project.

## Quy tắc sinh code

1. Dùng Bootstrap 5.x grid system (`container`, `row`, `col-*`)
2. Ưu tiên utility classes thay vì custom CSS
3. Components: `navbar`, `card`, `btn`, `form-control`, `modal`
4. Responsive: `col-md-*`, `d-none d-md-block`
5. Không import toàn bộ Bootstrap JS — chỉ bundle components cần thiết

## Mapping layout → Bootstrap

| Layout section | Bootstrap pattern |
|----------------|-------------------|
| hero | `container py-5` + `display-4` heading |
| navbar | `navbar navbar-expand-lg` |
| features | `row` + `col-md-4` + `card` |
| footer | `bg-dark text-white py-4` |

## Install command (nếu tìm được skill sau)

```bash
# Chưa có trên skills.sh — cần custom
```
