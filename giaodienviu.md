# 🎨 Giao Diện Site2Code — UI Specification Prompt

> **Dựa trên tài liệu:** README.md, docs/architecture.md, docs/api.md, docs/roadmap.md, skill.md, ai/prompts/*

---

## 1. TỔNG QUAN DỰ ÁN

**Site2Code** — Công cụ chuyển đổi **URL → Code hoàn chỉnh**. Người dùng nhập URL website, chọn stack công nghệ, AI sẽ phân tích, sinh mã nguồn và cho phép tải về dưới dạng ZIP.

### Công nghệ sử dụng (Frontend)
- **Next.js 16** (App Router)
- **React 19** 
- **Tailwind CSS v4**
- **TypeScript**
- **Geist Font** (từ next/font)

### Backend API
- Base URL: `http://localhost:3001/api` (dev)
- Proxy rewrite: `/api/:path*` → `http://localhost:3000/api/:path*`

---

## 2. LUỒNG NGƯỜI DÙNG (User Flow)

```
1. Home Page
   ├── Nhập URL website cần clone
   ├── Chọn Stack (Frontend + Backend + Database + CSS)
   ├── Xác nhận quyền sử dụng (checkbox pháp lý)
   └── Bấm "Generate" ──────────────────────────────┐
                                                     ↓
2. Progress Page (Job Tracking)
   ├── Crawling... (Playwright → Cheerio)
   ├── Analyzing Layout... (AI → JSON)
   ├── Generating Code... (AI sinh mã)
   ├── Reviewing Code... (AI review)
   ├── Optimizing... (AI tối ưu)
   └── Security Check... (AI bảo mật)
                                                     ↓
3. Result Page
   ├── Preview generated site (iframe)
   ├── Download ZIP button
   ├── View generated files tree
   └── "Generate Again" button
```

---

## 3. YÊU CẦU GIAO DIỆN CHI TIẾT

### 3.1. Layout Chung (RootLayout)

```tsx
// Dựa trên: apps/web/src/app/layout.tsx hiện tại
<html lang="en" className="h-full antialiased">
  <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950">
    {/* Header / Navbar */}
    {/* Main Content */}
    {/* Footer */}
  </body>
</html>
```

**Yêu cầu:**
- Dark mode support (prefers-color-scheme + toggle manual)
- Responsive: mobile-first breakpoints (mobile, tablet, desktop)
- Container: max-w-6xl mx-auto px-4 sm:px-6 lg:px-8
- Navigation: fixed/sticky top navbar với logo + theme toggle

### 3.2. Header / Navbar

| Element | Mô tả |
|---------|-------|
| Logo | "Site2Code" text logo bên trái, có icon nhỏ |
| Navigation | Home, API Docs (link đến /docs), GitHub (external) |
| Theme Toggle | Icon sun/moon, toggle dark/light mode |
| Trạng thái | Sticky trên cùng, có backdrop-blur |

### 3.3. Home Page (Trang chính — Hero + Input Form)

#### Hero Section
- Tiêu đề lớn: **"URL → Code. Trong 30 giây."**
- Subtitle: "Nhập bất kỳ website nào, chọn công nghệ bạn muốn, AI sẽ tái tạo thành project hoàn chỉnh."
- Màu sắc: Gradient text hoặc hiệu ứng nền động (animated gradient/particles)

#### URL Input Section
- Input field lớn, center, placeholder: `https://example.com`
- Nút "Paste" bên cạnh (dùng clipboard API)
- Validation: kiểm tra URL hợp lệ, không localhost/internal IP
- Hiệu ứng: focus ring, border glow khi nhập

#### Stack Selection (Bộ chọn công nghệ)
Dạng **Card Grid** với các mục sau:

**A. Frontend Framework** (chọn 1)
| Card | Mô tả |
|------|-------|
| React | Create React App, SPA |
| Next.js ⭐ | Next.js App Router + Tailwind *(mặc định MVP)* |
| Vue | Vue 3 + Vite |
| Nuxt | Nuxt 3 |
| Angular | Angular 18 |
| Svelte | SvelteKit |

**B. CSS Framework** (chọn 1)
| Card | Mô tả |
|------|-------|
| Tailwind CSS ⭐ | Utility-first *(mặc định)* |
| Bootstrap | Component framework |
| Material UI | Material Design components |
| ShadCN/ui | Modern Radix-based |
| Chakra UI | Accessible components |

**C. Backend Framework** (chọn 1)
| Card | Mô tả |
|------|-------|
| NestJS ⭐ | TypeScript, modular *(mặc định MVP)* |
| Express | Node.js minimal |
| FastAPI | Python async |
| Django | Python full-stack |
| Spring Boot | Java enterprise |
| Laravel | PHP MVC |
| Fiber | Go web framework |

**D. Database** (chọn 1)
| Card | Mô tả |
|------|-------|
| PostgreSQL ⭐ | SQL *(mặc định)* |
| MySQL | SQL |
| MongoDB | NoSQL |
| SQLite | Local file-based |

**E. ORM** (chọn 1)
| Card | Mô tả |
|------|-------|
| Prisma ⭐ | *(mặc định)* |
| TypeORM | |
| Drizzle | |
| Mongoose | *(nếu MongoDB)* |

> **UI Design:**
> - Cards dạng chọn (selectable), click để chọn
> - Card được chọn có border highlight + check icon
> - Mỗi card có icon riêng (có thể dùng emoji hoặc SVG)
> - Grid responsive: 2 cols (mobile) → 3-4 cols (desktop)
> - Mỗi section có label rõ ràng

#### Legal Confirmation
- Checkbox: "Tôi xác nhận có quyền sử dụng nội dung từ website này"
- Link nhỏ: "Xem điều khoản sử dụng"
- Nếu chưa check → disabled "Generate" button

#### Generate Button
- Button to lớn: **"🚀 Generate Project"**
- Variant: gradient/primary
- Hiệu ứng: pulse/glow khi có thể click
- Click → chuyển sang Progress Page

### 3.4. Progress Page (Trang theo dõi tiến trình)

**Layout:** Centered card, width tối đa 640px

**Steps Timeline:**
```
✅ Crawling         [████████░░] 80%  ← Step đang chạy
⏳ Analyzing         [░░░░░░░░░░] 0%
⏳ Generating Code   [░░░░░░░░░░] 0%
⏳ Reviewing Code    [░░░░░░░░░░] 0%
⏳ Optimizing        [░░░░░░░░░░] 0%
⏳ Security Check    [░░░░░░░░░░] 0%
```

**Yêu cầu:**
- Mỗi step là một row: icon trạng thái + tên step + progress bar + timer
- Icon trạng thái:
  - ✅ Hoàn thành (xanh)
  - ⏳ Đang chạy (xanh dương + animation pulse)
  - ⏹ Chờ (xám)
  - ❌ Lỗi (đỏ)
- Progress bar: thanh ngang với màu gradient
- Auto-poll API: GET `/api/jobs/:id` mỗi 2 giây
- Estimate time hiển thị: "Khoảng 45 giây còn lại"
- Animation: mượt mà khi chuyển step

**States:**
- **Thành công:** Tự động chuyển sang Result Page
- **Lỗi:** Hiển thị error message + nút "Try Again" + nút "Report"

### 3.5. Result Page (Trang kết quả)

**Layout:** Split screen hoặc tabs

#### Tab 1: Preview
- iframe hiển thị preview generated site
- Controls: Desktop / Tablet / Mobile view toggle
- Nút "Open in new tab"

#### Tab 2: Files
- File tree dạng collapsible (giống VS Code sidebar)
- Click file → xem code (syntax highlighted)
- Icon cho mỗi loại file (tsx, ts, css, json, etc.)

#### Tab 3: Review Report
- Score: circular progress (0-100)
- Issues list: error/warning/info với severity badges
- Copyright risk indicator

#### Action Buttons
- **📥 Download ZIP** (primary) — Calls GET `/api/export/:id`
- **🔄 Generate Again** (secondary) — Quay lại Home
- **📋 Copy Project ID** (ghost)

### 3.6. Footer
- "Powered by AI" / "Built with Next.js"
- Links: GitHub, Documentation, Terms
- Copyright năm hiện tại

---

## 4. DESIGN SYSTEM

### 4.1. Colors

```css
/* Theme Light */
--background: #ffffff;
--foreground: #0a0a0a;
--primary: #6366f1;        /* Indigo */
--primary-foreground: #ffffff;
--secondary: #f4f4f5;
--muted: #a1a1aa;
--accent: #8b5cf6;          /* Violet */
--border: #e4e4e7;
--success: #22c55e;
--warning: #f59e0b;
--error: #ef4444;

/* Theme Dark */
--background: #0a0a0a;
--foreground: #fafafa;
--primary: #818cf8;
--primary-foreground: #0a0a0a;
--secondary: #27272a;
--muted: #71717a;
--accent: #a78bfa;
--border: #27272a;
```

### 4.2. Typography
- **Font:** Geist Sans (heading + body), Geist Mono (code)
- **Scale:** text-xs → text-6xl
- **Heading weights:** semibold (600)
- **Body weight:** normal (400)

### 4.3. Spacing
- **Container:** max-w-6xl
- **Section padding:** py-16 sm:py-24
- **Card gap:** gap-4 sm:gap-6
- **Stack (form gap):** space-y-6

### 4.4. Border Radius
- **Cards/Badges:** rounded-xl
- **Buttons:** rounded-full (primary) hoặc rounded-lg
- **Inputs:** rounded-lg

### 4.5. Shadows
- **Cards:** shadow-sm hover:shadow-md transition
- **Modals:** shadow-2xl
- **Buttons:** shadow-md hover:shadow-lg

### 4.6. Transitions & Animations
- **Hover:** transition-all duration-200
- **Page load:** fade-in-up animation
- **Progress:** progress bar animate (width transition)
- **Cards:** scale-[1.02] on hover
- **Step transitions:** slide between steps

---

## 5. STATES XỬ LÝ

Mỗi component cần xử lý đầy đủ các state:

| State | Mô tả | UI Treatment |
|-------|-------|-------------|
| **Loading** | Dữ liệu đang tải | Skeleton shimmer / Spinner |
| **Empty** | Không có dữ liệu | Empty state illustration + message |
| **Error** | Lỗi xảy ra | Error banner + retry button |
| **Success** | Thành công | Success animation + kết quả |
| **Disabled** | Không thể tương tác | Opacity 50%, cursor not-allowed |

Ví dụ cụ thể:
- **URL Input:** Loading (đang validate) → Error (URL không hợp lệ) → Success (URL hợp lệ)
- **Stack Cards:** Loading (đang load stacks) → Empty (không có stack) → Selected/Unselected
- **Generate Button:** Disabled (chưa đủ điều kiện) → Active → Loading (đang generate)
- **Progress:** Processing từng step → Error step → Completed all
- **Preview iframe:** Loading → Loaded → Error (không preview được)

---

## 6. COMPONENT TREE (Cấu trúc thư mục đề xuất)

```
src/
├── app/
│   ├── layout.tsx          # RootLayout + metadata
│   ├── page.tsx            # Home Page (hero + form)
│   ├── globals.css         # Global styles + theme vars
│   ├── progress/
│   │   └── page.tsx        # Progress Page (job tracking)
│   └── result/
│       └── page.tsx        # Result Page (preview + download)
├── components/
│   ├── ui/                 # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── Spinner.tsx
│   │   ├── Skeleton.tsx
│   │   └── ThemeToggle.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── HeroSection.tsx
│   ├── home/
│   │   ├── UrlInput.tsx
│   │   ├── StackPicker.tsx
│   │   ├── StackCard.tsx
│   │   └── LegalCheckbox.tsx
│   ├── progress/
│   │   ├── StepTimeline.tsx
│   │   ├── StepItem.tsx
│   │   └── ProgressHeader.tsx
│   └── result/
│       ├── PreviewFrame.tsx
│       ├── FileTree.tsx
│       ├── FileViewer.tsx
│       └── ReviewReport.tsx
├── hooks/
│   ├── useTheme.ts
│   ├── useJobPolling.ts
│   └── useLocalStorage.ts
├── lib/
│   ├── api.ts              # API client functions
│   ├── constants.ts        # Stack options, steps
│   └── utils.ts            # cn() + helpers
└── types/
    └── index.ts            # TypeScript types
```

---

## 7. DỮ LIỆU MẪU (Constants/Stacks)

```typescript
// stacks.ts
export const FRONTEND_STACKS = [
  { id: 'react', name: 'React', icon: '⚛️', desc: 'Create React App, SPA' },
  { id: 'nextjs', name: 'Next.js', icon: '▲', desc: 'App Router + Tailwind', default: true },
  { id: 'vue', name: 'Vue', icon: '💚', desc: 'Vue 3 + Vite' },
  { id: 'nuxt', name: 'Nuxt', icon: '🟢', desc: 'Nuxt 3' },
  { id: 'angular', name: 'Angular', icon: '🔴', desc: 'Angular 18' },
  { id: 'svelte', name: 'Svelte', icon: '🧡', desc: 'SvelteKit' },
];

export const CSS_STACKS = [
  { id: 'tailwind', name: 'Tailwind CSS', icon: '🌊', desc: 'Utility-first', default: true },
  { id: 'bootstrap', name: 'Bootstrap', icon: '🟣', desc: 'Component framework' },
  { id: 'material-ui', name: 'Material UI', icon: '🔵', desc: 'Material Design' },
  { id: 'shadcn', name: 'ShadCN/ui', icon: '✨', desc: 'Radix components' },
  { id: 'chakra', name: 'Chakra UI', icon: '🟢', desc: 'Accessible' },
];

// Tương tự cho BACKEND_STACKS, DATABASE_STACKS, ORM_STACKS
```

```typescript
// pipeline-steps.ts
export const PIPELINE_STEPS = [
  { id: 'crawl', label: 'Crawling', icon: '🕷️' },
  { id: 'analyze', label: 'Analyzing Layout', icon: '🔍' },
  { id: 'generate', label: 'Generating Code', icon: '⚡' },
  { id: 'review', label: 'Reviewing Code', icon: '👁️' },
  { id: 'optimize', label: 'Optimizing', icon: '🚀' },
  { id: 'security', label: 'Security Check', icon: '🛡️' },
] as const;
```

---

## 8. API INTEGRATION

```typescript
// api.ts
const API_BASE = '/api';

export const api = {
  crawl: (url: string, confirmedRights: boolean) =>
    fetch(`${API_BASE}/crawl`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, confirmedRights }),
    }).then(r => r.json()),

  getJobStatus: (jobId: string) =>
    fetch(`${API_BASE}/jobs/${jobId}`).then(r => r.json()),

  downloadExport: (jobId: string) =>
    `${API_BASE}/export/${jobId}`,  // Direct link for download
};
```

---

## 9. RESPONSIVE BREAKPOINTS

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | < 640px | 1 col, stacked cards |
| Tablet | 640px - 1024px | 2 cols grid |
| Desktop | > 1024px | 3-4 cols grid, side-by-side |

---

## 10. PROMPT CHO AI SINH GIAO DIỆN

> **Copy đoạn sau để gửi cho AI:**

---

```
Bạn là senior frontend developer. Hãy tạo giao diện **Site2Code** — công cụ chuyển URL website thành mã nguồn — bằng **Next.js 16 + Tailwind CSS v4 + TypeScript**.

## Yêu cầu:

### 1. Layout
- Sticky navbar (logo + nav links + theme toggle dark/light)
- Hero section với gradient text và animated background
- Footer

### 2. Home Page
- URL input lớn (center) với nút Paste
- Stack picker dạng card grid: chọn Frontend (6 options), CSS (5 options), Backend (6 options), Database (4 options), ORM (4 options)
  - Card được chọn có border highlight + check icon
  - Mỗi card có emoji icon + tên + mô tả ngắn
- Legal checkbox: "Tôi xác nhận có quyền sử dụng nội dung"
- Nút "Generate Project" gradient to, disabled đến khi đủ điều kiện

### 3. Progress Page
- Timeline 6 bước: Crawling → Analyzing → Generating → Reviewing → Optimizing → Security
- Mỗi bước có icon trạng thái (✅ ⏳ ⏹ ❌) + progress bar + tên
- Auto-poll API mỗi 2 giây

### 4. Result Page
- 3 tabs: Preview (iframe với device toggle), Files (file tree + code viewer), Review Report (score + issues)
- Nút download ZIP + Generate Again

### 5. Design System
- Colors: Indigo primary, Violet accent (dark mode support)
- Font: Geist Sans (heading/body) + Geist Mono (code)
- Border radius: rounded-xl (cards), rounded-full (buttons)
- Transitions: smooth hover/active states
- Skeleton loading states

### 6. State Handling
Mỗi component xử lý: loading → empty → error → success → disabled

Tạo đầy đủ file:
- src/app/layout.tsx
- src/app/page.tsx (Home)
- src/app/progress/page.tsx (Progress)
- src/app/result/page.tsx (Result)
- src/app/globals.css
- src/components/ui/*.tsx
- src/components/layout/*.tsx
- src/components/home/*.tsx
- src/components/progress/*.tsx
- src/components/result/*.tsx
- src/hooks/*.ts
- src/lib/*.ts
- src/types/index.ts

Dùng semantic HTML, ARIA labels, keyboard navigation. KHÔNG dùng thư viện UI ngoài Tailwind.
```

---

## 11. GHI CHÚ BỔ SUNG

- **Tooltip** cho mỗi stack card khi hover: hiển thị mô tả chi tiết
- **Keyboard shortcut:** Enter để submit form
- **URL validation real-time:** kiểm tra khi gõ, hiển thị error inline
- **LocalStorage:** lưu lại lựa chọn stack gần nhất
- **Accessibility:** đầy đủ aria-label, role, focus trap cho modal, keyboard navigation
- **SEO:** metadata title/description cho mỗi page
- **Performance:** lazy load preview iframe, dynamic import cho heavy components
