# DAFC OTB Platform - Monorepo

Hệ thống quản lý Open-to-Buy cho ngành thời trang cao cấp.

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[Setup Guide](SETUP.md)** | Complete environment setup instructions |
| **[Git Workflow](docs/GIT_WORKFLOW.md)** | Branching strategy and PR process |
| **[Commit Convention](docs/COMMIT_CONVENTION.md)** | How to write commit messages |
| **[Changelog](CHANGELOG.md)** | Project history and changes |

### Quick Links

- [API Documentation](http://localhost:3001/api/docs) (when running locally)
- [GitHub Issues](https://github.com/nclamvn/dafc-otb-monorepo/issues)

---

## Báo cáo hoàn thành yêu cầu khách hàng

### Tổng quan các yêu cầu

| # | Yêu cầu | Trạng thái | Mô tả |
|---|---------|------------|-------|
| 1 | Tách Frontend và Backend riêng | ✅ DONE | Monorepo với apps/web (Next.js) và apps/api (NestJS) |
| 2 | API thiết kế theo dạng API Wrapper | ✅ DONE | Transform Interceptor + Service Layer Pattern |
| 3 | Cung cấp bản thiết kế để Vibe code | ✅ DONE | Prisma Schema + Swagger Docs + Architecture docs |
| 4 | Tích hợp tính năng import Excel | ✅ DONE | Full Excel import/export với validation |

---

## 1. Tách Frontend và Backend riêng

### Kiến trúc Monorepo

```
dafc-otb-monorepo/
├── apps/
│   ├── web/                    # Frontend - Next.js 14 (Port 3000)
│   │   ├── app/               # App Router pages
│   │   ├── components/        # React components (shadcn/ui)
│   │   ├── lib/               # Utilities, API client
│   │   ├── hooks/             # Custom React hooks
│   │   └── Dockerfile
│   │
│   └── api/                    # Backend - NestJS (Port 3001)
│       ├── src/
│       │   ├── modules/       # Feature modules
│       │   │   ├── auth/
│       │   │   ├── budgets/
│       │   │   ├── otb-plans/
│       │   │   ├── sku-proposals/
│       │   │   ├── workflows/
│       │   │   ├── analytics/
│       │   │   ├── integrations/
│       │   │   ├── ai/
│       │   │   ├── notifications/
│       │   │   ├── reports/
│       │   │   ├── users/
│       │   │   └── master-data/
│       │   ├── common/        # Interceptors, Guards, Filters
│       │   └── prisma/        # Prisma service
│       └── Dockerfile
│
├── packages/
│   ├── shared/                 # @dafc/shared - Types, schemas, utils
│   │   ├── src/
│   │   │   ├── types/         # TypeScript interfaces
│   │   │   ├── schemas/       # Zod validation schemas
│   │   │   └── utils/         # Shared utilities
│   │   └── package.json
│   │
│   └── database/               # @dafc/database - Prisma
│       ├── prisma/
│       │   ├── schema.prisma  # Database schema (2000+ lines)
│       │   └── seed.ts        # Demo data seeding
│       └── package.json
│
├── docker-compose.yml          # Docker deployment
├── render.yaml                 # Render.com deployment
└── turbo.json                  # Turborepo config
```

### Chạy Frontend và Backend độc lập

```bash
# Chạy Frontend riêng (port 3000)
pnpm dev:web

# Chạy Backend riêng (port 3001)
pnpm dev:api

# Chạy cả hai
pnpm dev
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Zustand, React Query |
| Backend | NestJS, TypeScript, Prisma ORM, JWT Auth, Swagger |
| Database | PostgreSQL 15 |
| Monorepo | Turborepo, pnpm workspaces |
| AI | OpenAI GPT-4 |

---

## 2. API Wrapper Design

### Global Response Wrapper

Tất cả API responses được chuẩn hóa qua `TransformInterceptor`:

**File**: `apps/api/src/common/interceptors/transform.interceptor.ts`

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

### Service Layer Pattern

Mỗi module tuân theo kiến trúc 3 lớp:

```
Controller (HTTP Layer)
    ↓
Service (Business Logic)
    ↓
Prisma (Data Access)
```

### External Integration Wrappers

**File**: `apps/api/src/modules/integrations/integrations.service.ts`

| Wrapper | Chức năng |
|---------|-----------|
| ERP Connection | Kết nối SAP B1, SAP HANA, Oracle NetSuite, MS Dynamics |
| Webhook Manager | Quản lý outbound webhooks với retry logic |
| S3 Storage | Presigned URL generation, file management |
| API Key Manager | Authentication keys với scopes và rate limiting |

### Design Patterns sử dụng

- **Repository Pattern** - Prisma ORM abstraction
- **Adapter Pattern** - Multi-ERP type support
- **Strategy Pattern** - Sync direction options
- **Interceptor Pattern** - Response transformation
- **Guard Pattern** - JWT authentication

---

## 3. Bản thiết kế để Vibe Code

### 3.1 Database Schema (Prisma)

**File**: `packages/database/prisma/schema.prisma` (2090 lines)

#### Core Entities

```prisma
// User & Authentication
model User { ... }
model Account { ... }
model Session { ... }

// Master Data
model Division { ... }
model Brand { ... }
model Collection { ... }
model Category { ... }
model Subcategory { ... }
model SalesLocation { ... }
model Season { ... }

// Business Modules
model BudgetAllocation { ... }
model OTBPlan { ... }
model OTBLineItem { ... }
model SKUProposal { ... }
model SKUItem { ... }

// Workflow Engine
model Workflow { ... }
model WorkflowStep { ... }

// Analytics & KPI
model KPIDefinition { ... }
model KPITarget { ... }
model KPIValue { ... }
model DashboardWidget { ... }

// AI Features
model AIConversation { ... }
model AIMessage { ... }
model AISuggestion { ... }

// Integrations
model ERPConnection { ... }
model Webhook { ... }
model APIKey { ... }
```

### 3.2 API Documentation (Swagger)

**URL**: http://localhost:3001/api/docs

#### API Endpoints Summary

| Module | Endpoints | Description |
|--------|-----------|-------------|
| Auth | `/api/v1/auth/*` | Login, Register, Profile |
| Budgets | `/api/v1/budgets/*` | CRUD, Submit, Approve |
| OTB Plans | `/api/v1/otb-plans/*` | Planning, Analysis |
| SKU Proposals | `/api/v1/sku-proposals/*` | Import, Validate |
| Workflows | `/api/v1/workflows/*` | Approval flows |
| Analytics | `/api/v1/analytics/*` | KPIs, Dashboards |
| Integrations | `/api/v1/api-keys/*`, `/api/v1/webhooks/*`, `/api/v1/integrations/*` | External systems |
| Master Data | `/api/v1/master-data/*` | Divisions, Brands, Categories |
| AI | `/api/v1/ai/*` | Chat, Suggestions |

### 3.3 Frontend Components Structure

```
apps/web/components/
├── ui/                    # shadcn/ui base components
├── forms/                 # Form components with validation
├── layout/                # Layout components
├── dashboard/             # Dashboard widgets
├── budgets/               # Budget management
├── otb/                   # OTB planning
├── sku/                   # SKU management
├── excel/                 # Excel import/export
├── workflows/             # Approval workflows
└── analytics/             # Charts, KPIs
```

---

## 4. Tích hợp Import Excel

### Tính năng đã triển khai

| Feature | Status | Description |
|---------|--------|-------------|
| File Upload | ✅ | Drag-and-drop, file validation |
| Excel Parsing | ✅ | Flexible column mapping (50+ aliases) |
| Data Validation | ✅ | Business rules, duplicate check |
| Size Matrix | ✅ | Auto-detect size columns (XS-XXL) |
| Preview & Edit | ✅ | Inline editing before import |
| Error Reporting | ✅ | Row-by-row errors/warnings |
| Template Download | ✅ | Pre-formatted Excel templates |
| Excel Export | ✅ | Export data to Excel |

### Library

- **xlsx** v0.18.5 - Excel parsing and generation

### File Structure

```
apps/web/lib/excel/
├── parser.ts              # parseExcelFile() - Parse Excel to JSON
├── validator.ts           # validateSKUs() - Business validation
└── template.ts            # generateSKUTemplate() - Template generation

apps/web/components/excel/
├── excel-importer.tsx     # Multi-step import wizard
├── import-preview.tsx     # Data preview table
└── validation-summary.tsx # Error/warning display

apps/web/app/api/v1/sku-proposals/[id]/
├── upload/route.ts        # POST - Upload Excel file
├── import/route.ts        # POST - Import parsed data
└── validate/route.ts      # POST - Validate imported data
```

### Validation Rules

- SKU code format: `^[A-Z]{2,4}-[A-Z0-9]{2,4}-[A-Z0-9]{2,8}$`
- Duplicate SKU detection
- Category/Subcategory validation
- Gender: MEN, WOMEN, UNISEX, KIDS
- Margin range: 40-85%
- Cost < Retail price
- MOQ compliance
- Size breakdown totals
- Lead time warnings (>180 days)
- High-value order detection (>10% budget)

### Import Workflow

```
1. Upload      → Drag-drop .xlsx file
2. Parse       → Extract data with column mapping
3. Preview     → Review and edit data
4. Validate    → Check business rules
5. Import      → Save to database
6. Complete    → Redirect to proposal
```

---

## Quick Start

### Prerequisites

- Node.js >= 18
- pnpm >= 9
- PostgreSQL database

### Installation

```bash
# Clone & install
git clone <repo-url>
cd dafc-otb-monorepo
pnpm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Seed demo data
pnpm db:seed
```

### Development

```bash
# Start all apps
pnpm dev

# Start specific app
pnpm dev:web    # Frontend only (port 3000)
pnpm dev:api    # Backend only (port 3001)
```

### Build

```bash
pnpm build
```

---

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dafc_otb"

# Auth
AUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="7d"

# API
API_PORT=3001
NEXT_PUBLIC_API_URL="http://localhost:3001"
CORS_ORIGIN="http://localhost:3000"

# OpenAI
OPENAI_API_KEY="sk-..."
```

---

## Deployment

### Docker Compose

```bash
docker-compose up -d
```

Services:
- **db**: PostgreSQL 15 (port 5432)
- **api**: NestJS Backend (port 3001)
- **web**: Next.js Frontend (port 3000)

### Render.com

1. **API Service**: Deploy from `apps/api`
2. **Web Service**: Deploy from `apps/web`
3. **Database**: Use Render PostgreSQL

---

## URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001 |
| Swagger Docs | http://localhost:3001/api/docs |
| Prisma Studio | http://localhost:5555 |

---

## License

Private - DAFC Vietnam
