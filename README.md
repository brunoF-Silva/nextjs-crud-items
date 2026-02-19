# CRUD Items Frontend

A modern, responsive frontend application built with Next.js for managing items and users. This project serves as the user interface for the [CRUD Items Backend API](https://github.com/brunoF-Silva/nestjs-crud-items), featuring dynamic routing, server-side rendering, and modern UX patterns.

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS & CSS Modules
- **Deployment**: [Vercel](https://vercel.com/)

## ✨ Features

- **Complete CRUD Interface**: Seamlessly create, read, update, and delete items and clients.
- **Modern UX/UI**: Responsive design with loading states and pagination controls.
- **Toast Notifications**: Floating, auto-dismissing toast alerts for successful user actions (e.g., deletions).
- **Hybrid Rendering**: Strategic use of Server Components and Client Components for optimal performance.
- **Environment-Aware**: Dynamically connects to local or production APIs using environment variables.

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A running instance of the [CRUD Items API](https://github.com/brunoF-Silva/nestjs-crud-items) (Local or Hosted)

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/brunoF-Silva/nextjs-crud-items.git
   cd nextjs-crud-items
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory to point to your backend API:

   ```env
   # Fallback is http://localhost:4000 if not provided
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

---

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

Open `http://localhost:3000` in your browser to view the application.

### Production Build

To test the optimized production build locally:

```bash
npm run build
npm run start
```

---

## ☁️ Deployment (Vercel)

This application is highly optimized for deployment on Vercel.

1. Create a new Project on Vercel and import your GitHub repository.
2. During the setup phase, expand the **Environment Variables** section.
3. Add your production backend URL:

   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-backend-url.onrender.com`  
     (Ensure there is no trailing slash `/`)

4. Click **Deploy**.

---

## 🏗️ Architecture Notes

### React Suspense & CSR Bailout

To ensure optimal static generation during the build process, components that rely on browser-specific hooks (like `useSearchParams`) are isolated into dedicated Client Components (e.g., `ItemsContent.tsx`). These are then wrapped in React `<Suspense>` boundaries within the Server Components (`page.tsx`) to prevent "CSR bailout" errors during Vercel deployments.

---

## 📊 Project Structure

```plaintext
src/
├── app/
│   ├── items/
│   │   └── page.tsx           # Server wrapper for items
│   ├── clients/
│   │   └── page.tsx           # Server wrapper for clients
│   └── page.tsx               # Main entry point
├── components/
│   ├── ItemCard.tsx           # Reusable UI components
│   └── Header.tsx
└── styles/
    └── globals.css            # Global styles and Tailwind imports
```
