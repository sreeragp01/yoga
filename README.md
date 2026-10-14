# Prāṇa Yoga Booking Platform — Full-Stack Production Architecture

A full-stack, enterprise-grade yoga class scheduling and instant booking platform built with a calm, editorial aesthetic, atomic 10-minute slot holds, real Razorpay payment processing, PostgreSQL GiST exclusion constraints, and zero-latency WebSocket synchronization.

---

## 🏗️ Architecture Overview

```mermaid
flowchart TD
    subgraph Frontend ["Client Layer (Port 3000)"]
        A[Student Web View]
        B[Mobile Simulator]
        C[Teacher Portal]
        D[Admin Dashboard]
        E[Dual-Screen Sync Demo]
    end

    subgraph Backend ["Backend API & Gateway (Port 4000)"]
        API[Express REST API]
        WS[WebSocket Gateway /ws]
        RZP[Razorpay Payment Service]
        AVL[Availability & Hold Engine]
    end

    subgraph Persistence ["Data & Services"]
        DB[(PostgreSQL 16 + btree_gist)]
        PRISMA[Prisma ORM]
        GATEWAY[Razorpay Standard / Webhook]
    end

    Frontend <-->|REST & /ws Proxy| Backend
    Backend --> PRISMA --> DB
    Backend <-->|HMAC-SHA256 & Orders| GATEWAY
```

---

## ⚡ Quick Start

### 1. Run Frontend & Backend Concurrently
```bash
npm run dev
```
* **Frontend Web:** [http://localhost:3000](http://localhost:3000)
* **Backend API:** [http://localhost:4000](http://localhost:4000)
* **API Health Check:** [http://localhost:4000/api/health](http://localhost:4000/api/health)
* **Live WebSocket Stream:** `ws://localhost:4000/ws`

### 2. Available Scripts
| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts both Frontend and Backend API concurrently with live reload |
| `npm run dev:api` | Starts only the Backend API (`apps/api`) with TypeScript watch |
| `npm run dev:web` | Starts only the Vite Frontend (`src`) |
| `npm run build` | Compiles production bundle for the frontend (`dist/`) |
| `npm run build:api` | Compiles backend TypeScript to `apps/api/dist/` |
| `npm run db:generate` | Generates the Prisma client from `apps/api/prisma/schema.prisma` |
| `npm run db:migrate` | Runs database migrations on your PostgreSQL instance |
| `npm run db:seed` | Populates initial teacher, class type, and availability slots |

---

## 🗄️ Database Setup (PostgreSQL with GiST Exclusion)

The database schema is defined in [`apps/api/prisma/schema.prisma`](apps/api/prisma/schema.prisma) and configured for PostgreSQL with the `btree_gist` extension to prevent double bookings.

### Step 1: Set your `DATABASE_URL`
In [`apps/api/.env`](apps/api/.env):
```env
# Example for local Docker / PostgreSQL:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/prana_yoga?schema=public"

# Example for Supabase or Neon:
DATABASE_URL="postgresql://user:password@ep-xxxx.neon.tech/neondb?sslmode=require"
```

### Step 2: Run Migrations and Seed
```bash
npm run db:migrate
npm run db:seed
```

> **Note:** If no PostgreSQL server is running yet, the backend automatically operates in **Developer Sandbox Mode** with an in-memory transactional cache, ensuring zero downtime while developing locally.

---

## 💳 Razorpay Payment Gateway Integration

The platform includes the official `razorpay` SDK, order creation, HMAC-SHA256 signature verification, and automated refunds:

1. Obtain your API keys from the [Razorpay Dashboard](https://dashboard.razorpay.com/#/app/keys).
2. Configure [`apps/api/.env`](apps/api/.env):
   ```env
   RAZORPAY_KEY_ID="rzp_live_xxxxxxxxxxxxxx"        # or rzp_test_...
   RAZORPAY_KEY_SECRET="your_razorpay_secret_here"
   RAZORPAY_WEBHOOK_SECRET="your_webhook_secret_here"
   ```
3. Set your Razorpay Webhook URL to:
   ```
   https://your-domain.com/api/payments/webhook
   ```
   Subscribe to `payment.captured`, `payment.failed`, and `refund.processed`.

---

## 📡 Real-Time WebSocket Synchronization

The backend exposes a bi-directional WebSocket server at `/ws` that broadcasts slot and booking state changes across all connected devices:
* `SLOT_HELD` — Sent when a student selects a slot, locking it for 10 minutes (TTL 600s).
* `SLOT_RELEASED` — Sent when a student cancels checkout or the hold timer expires.
* `BOOKING_CONFIRMED` — Sent upon payment verification, instantly marking the slot as confirmed on the Teacher Portal and Admin Panel without requiring a page reload.
* `BOOKING_CANCELLED` — Sent upon cancellation with refund details.
* `SLOT_TOGGLED` — Sent when a teacher blocks or unblocks availability.
