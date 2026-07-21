# QuickBasket - Grocery Delivery Platform

A full-stack grocery delivery web application built with Next.js, featuring user, admin, and delivery boy roles, real-time tracking, AI chat suggestions, and secure payments via Stripe.

## Features

### User Features
- **User Registration & Authentication**: Secure sign up and login using NextAuth
- **Browse Groceries**: View and search grocery items by name or category
- **Shopping Cart**: Add/remove items and manage quantities
- **Checkout & Payments**: Secure payment processing with Stripe
- **Order Tracking**: Live order tracking with map integration
- **Order History**: View past orders
- **AI Chat Suggestions**: Get product recommendations and assistance

### Admin Features
- **Manage Groceries**: Add, edit, or delete grocery items
- **Order Management**: View and update order statuses
- **User Management**: Manage user roles

### Delivery Boy Features
- **Accept/Reject Assignments**: Manage delivery assignments
- **Live Location Sharing**: Real-time location updates for tracking (Redis-optimized for ~99% latency reduction)
- **Order Completion**: Complete deliveries with OTP verification (Redis-cached for auto-expiry)
- **Chat**: Communicate with users

## Tech Stack

### Frontend
- **Next.js 16** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Redux Toolkit** - State management
- **React Leaflet** - Map integration
- **Socket.io Client** - Real-time communication
- **Lucide React / React Icons** - Icons

### Backend
- **Next.js API Routes** - Server-side API
- **MongoDB & Mongoose** - Database & ODM
- **NextAuth.js** - Authentication
- **Stripe** - Payment processing
- **Cloudinary** - Image uploads
- **Nodemailer** - Email service
- **Redis** - Caching & session management

### Socket Server
- **Express** - Web server
- **Socket.io** - Real-time bidirectional communication
- **Mongoose** - Database access

### DevOps
- **Docker & Docker Compose** - Containerization for easy deployment

## Redis Use Cases

### 1️⃣ Delivery Boy Live Location Tracking
- **What**: Real-time location updates stored in Redis with 60-second auto-expiry
- **Why**: Location data changes every second and only the latest value is needed. MongoDB write latency: ~258ms vs Redis: ~2ms (~99% reduction)
- **Result**: Seamless real-time tracking without database overhead

### 2️⃣ Delivery OTP Verification
- **What**: Temporary OTP for order delivery verification cached in Redis with 10-minute auto-expiry
- **Why**: OTP is temporary by nature. Redis's built-in TTL eliminates manual cleanup and ensures fast verification
- **Result**: Automatic expiry prevents expired OTPs, keeps MongoDB clean from temporary data

## Background Email Processing (BullMQ)

QuickBasket uses BullMQ (backed by the same Redis instance) to send order-related emails asynchronously, so API responses aren't delayed by email delivery.

**How it works:**
- When an order is placed (`/api/user/order`), a job is added to the `email-queue` with order details (items, total, address, payment method).
- When a delivery is completed via OTP verification (`/api/delivery/otp/verify`), a job is added to send a delivery confirmation email.
- The `quickbasket` (Next.js) app acts as the **producer** — it only pushes jobs to the queue and returns a response immediately.
- The `socketServer` (Render, always-on) runs the **worker** — it picks up jobs from the queue and sends the actual emails via [Resend](https://resend.com).

**Why BullMQ:**
- Next.js on Vercel is serverless — it can't run a persistent worker process to consume jobs.
- The always-on `socketServer` on Render is used as the worker instead, sharing the same Redis instance as the producer.
- This decouples email sending from the API request lifecycle — if email delivery is slow or temporarily fails, it doesn't block or fail the order/delivery API response, and BullMQ automatically[...]

**Environment variables required (socketServer):**
REDIS_URL=your_redis_url
RESEND_API_KEY=your_resend_api_key

## QuickBasket AI Assistant

A floating, animated chat widget (available on every page) that lets logged-in users ask natural-language questions about their orders and products, powered by LangChain + LangGraph.

**What it can do:**
- Check order status and delivery history ("Where is my order?", "When was my last order delivered?")
- Search available products by name or category ("Is milk available?", "Suggest healthy snacks")
- Estimate cart cost before ordering ("How much for 2kg tomatoes and 1 packet of milk?")
- Guide users to the right place for cancellations/refunds (does not process them directly)
- Answer general food/seasonal questions using the model's own knowledge

**How it works:**
- Built with `createAgent` from LangChain (a ReAct-style agent that reasons about which tool to call).
- Three custom tools query MongoDB directly for structured data: `get_order_status`, `search_products`, `calculate_cart_total`.
- Each request is scoped to the logged-in user's ID, so the assistant only ever accesses that user's own orders.
- Uses Google's Gemini (`gemini-2.5-flash`) as the underlying model.
- A system prompt defines the assistant's role, available product categories, and behavioral rules (e.g., never revealing other users' data).

**Why a tool-calling agent instead of RAG:**
All the data the assistant needs (orders, products, prices) is structured and already lives in MongoDB. A tool-calling agent can query it directly and precisely — RAG (vector search over unstructured documents) would add unnecessary complexity for data that's already efficiently queryable via structured DB queries. RAG would be the right fit for future unstructured content, e.g. searching a long-form policy/FAQ document.

**Environment variables required:**

GEMINI_API_KEY=your_gemini_api_key


**Frontend:** `components/QuickBasketAI.tsx` — a floating action button that expands into a chat window, mounted globally in `app/layout.tsx`.

**Backend:** `app/api/ai-assistant/chat/route.ts` — receives the user's message and userId, invokes the LangChain agent, and returns the response.

## Project Structure

```
quickbasket/
├── quickbasket/          # Main Next.js application
│   ├── app/              # App Router pages and APIs
│   │   ├── admin/        # Admin pages
│   │   ├── api/          # API routes
│   │   ├── login/        # Login page
│   │   ├── register/     # Registration page
│   │   └── user/         # User pages
│   ├── components/       # React components
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utility libraries
│   ├── models/           # Mongoose models
│   ├── public/           # Static assets
│   └── redux/            # Redux store configuration
└── socketServer/         # Socket.io server for real-time features
    └── index.js
```

## Getting Started

### Prerequisites
- Node.js
- MongoDB
- Redis
- Stripe account
- Cloudinary account
- Docker & Docker Compose (optional, for containerized setup)

### Installation

#### Option 1: Manual Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quickbasket
   ```

2. **Install dependencies for Next.js app**
   ```bash
   cd quickbasket
   npm install
   ```

3. **Install dependencies for Socket Server**
   ```bash
   cd ../socketServer
   npm install
   ```

4. **Set up environment variables**

Create `.env.local` files in both `quickbasket/` and `socketServer/` directories with the following variables:

**quickbasket/.env.local**
```
MONGODB_URI=your_mongodb_uri
AUTH_SECRET=your_auth_secret
AUTH_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3001
AUTH_TRUST_HOST=true
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NEXT_BASE_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_SERVER=http://localhost:5001
INTERNAL_SOCKET_URL=http://socketserver:4000
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
GEMINI_API_KEY=your_gemini_api_key
EMAIL=your_email
PASS=your_email_app_password
REDIS_URL=redis://redis:6379
```

**socketServer/.env.local**
```
PORT=4000
CORS_ORIGIN=http://localhost:3001
INTERNAL_API_URL=http://host.docker.internal:3001
REDIS_URL=redis://redis:6379
```

> Note: If running via Docker Compose, `INTERNAL_API_URL` and `REDIS_URL` use Docker service names (`quickbasket`, `redis`) for container-to-container communication. If running without Docker, re[...]

5. **Run the applications**

   **Start Next.js app (in quickbasket directory):**
   ```bash
   npm run dev
   ```

   **Start Socket Server (in socketServer directory):**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

#### Option 2: Docker Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quickbasket
   ```

2. **Running with Docker Compose (recommended)**

From the project root:
```bash
docker compose up --build
```

This starts the frontend (`localhost:3001`), socket server (`localhost:5001`), and Redis together on a shared network.

3. **Access the application**
   Visit [http://localhost:3001](http://localhost:3001)

## Scripts

### Next.js App
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Socket Server
- `npm run dev` - Start development server with nodemon

## License

ISC
