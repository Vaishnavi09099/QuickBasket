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
- **Live Location Sharing**: Real-time location updates for tracking
- **Order Completion**: Complete deliveries with OTP verification
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

### Socket Server
- **Express** - Web server
- **Socket.io** - Real-time bidirectional communication
- **Mongoose** - Database access

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
- Stripe account
- Cloudinary account

### Installation

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

   Create `.env` files in both `quickbasket/` and `socketServer/` directories with the following variables:

   **quickbasket/.env**
   ```
   MONGODB_URI=your_mongodb_uri
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   MAILER_EMAIL=your_email
   MAILER_PASSWORD=your_email_password
   ```

   **socketServer/.env**
   ```
   MONGODB_URI=your_mongodb_uri
   PORT=3001
   ```

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
