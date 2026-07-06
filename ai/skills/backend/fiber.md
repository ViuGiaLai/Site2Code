# Go Fiber

> **Status: CUSTOM STUB** — Không có skill Go Fiber trên skills.sh.
> Tham khảo: https://docs.gofiber.io/

## Khi dùng trong Site2Code

Áp dụng khi user chọn **Go + Fiber** làm backend framework.

## Quy tắc sinh code

1. Project structure:
   ```
   cmd/server/main.go
   internal/handlers/
   internal/models/
   internal/routes/
   ```
2. Fiber v2 patterns: `fiber.New()`, route groups, middleware
3. JSON responses: `c.JSON(fiber.Map{...})`
4. Error handling: centralized error handler middleware
5. CORS: `github.com/gofiber/fiber/v2/middleware/cors`

## Ví dụ route

```go
app.Get("/api/health", func(c *fiber.Ctx) error {
    return c.JSON(fiber.Map{"status": "ok"})
})
```

## Database

Kết hợp với `go.md` skill + database skill (PostgreSQL/MySQL/SQLite).
