# Ukrainian Food

A full-stack Next.js 15 application for sharing and discovering Ukrainian meal recipes. Built with TypeScript, React 19, TanStack Query, MongoDB, and AWS S3.

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5.9 (strict mode) |
| UI | React 19 |
| State Management | TanStack Query 5 |
| Database | MongoDB 7 |
| Image Storage | AWS S3 |
| Forms | React Hook Form 7 |
| Security | xss (sanitization), slugify (URL slugs) |
| Linting | ESLint 8 + next/core-web-vitals |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- AWS account with S3 bucket configured

### Installation

```bash
git clone <repository-url>
cd nextjs-ukr-food
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
```

> The S3 bucket name (`natalievirt-nextjs-users-image`) and region (`ap-southeast-2`) are configured in `lib/utils/s3.ts`.

### Running the App

```bash
npm run dev       # Start development server (http://localhost:3000)
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

### Type Checking

```bash
npx tsc --noEmit
```

## Architecture

```
Client Components (React 19 + TanStack Query)
        |
Custom Hooks (hooks/meals/)
        |
API Client (lib/api/meals.ts - fetch wrappers)
        |
API Routes (app/api/meals/)
        |
Service Layer (lib/services/meals.service.ts)
        |
MongoDB + AWS S3
```

### Directory Structure

```
nextjs-ukr-food/
├── app/                              # Next.js App Router
│   ├── api/meals/                    # REST API endpoints
│   │   ├── route.ts                  #   GET /api/meals, POST /api/meals
│   │   └── [slug]/route.ts          #   GET /api/meals/:slug
│   ├── meals/
│   │   ├── page.tsx                  # Browse all meals
│   │   ├── [order_slug]/page.tsx     # Meal detail page
│   │   ├── share/page.tsx            # Share a new meal (form)
│   │   ├── error.tsx                 # Error boundary
│   │   └── loading-out.tsx           # Loading state
│   ├── layout.tsx                    # Root layout (Providers + Header)
│   ├── page.tsx                      # Home page
│   ├── providers.tsx                 # QueryClientProvider setup
│   └── not-found.tsx                 # 404 page
│
├── components/
│   ├── images/
│   │   └── image-slideshow.tsx       # Auto-rotating hero slideshow
│   ├── main-header/
│   │   ├── main-header.tsx           # Site navigation
│   │   ├── main-header-background.tsx
│   │   └── nav-link.tsx              # Active route highlighting
│   ├── meals/
│   │   ├── meals-grid.tsx            # Responsive meal cards grid
│   │   ├── meal-item.tsx             # Individual meal card
│   │   └── image-picker.tsx          # Image upload with preview
│   └── modal-dialog/
│       └── modal-dialog.tsx          # Portal-based modal
│
├── hooks/meals/                      # TanStack Query hooks
│   ├── useMeals.ts                   # useQuery — fetch all meals
│   ├── useMeal.ts                    # useQuery — fetch meal by slug
│   └── useCreateMeal.ts             # useMutation — create new meal
│
├── lib/
│   ├── api/meals.ts                  # Client-side fetch wrappers
│   ├── services/meals.service.ts     # MongoDB CRUD operations
│   ├── utils/s3.ts                   # S3 image upload
│   └── mongodb.ts                    # Cached MongoDB connection
│
├── types/
│   ├── meal.ts                       # Meal, MealFormData, CreateMealInput
│   ├── css.d.ts                      # CSS module type declarations
│   └── images.d.ts                   # Image import type declarations
│
├── assets/                           # Static images (logo, food photos)
└── public/images/                    # Public static files
```

## Pages & Routes

| Route | Description |
|---|---|
| `/` | Home page with hero slideshow and intro sections |
| `/meals` | Browse all meals from MongoDB |
| `/meals/share` | Form to submit a new meal with image upload |
| `/meals/[slug]` | Individual meal detail page |

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/meals` | Fetch all meals |
| `POST` | `/api/meals` | Create a new meal (accepts FormData) |
| `GET` | `/api/meals/[slug]` | Fetch a single meal by slug |

### POST /api/meals — Request

Send as `multipart/form-data`:

| Field | Type | Required |
|---|---|---|
| `title` | string | Yes |
| `summary` | string | Yes |
| `instructions` | string | Yes |
| `name` | string | Yes |
| `email` | string | Yes |
| `image` | File | Yes |

### Response Format

```json
{
  "meals": [
    {
      "_id": "string",
      "title": "string",
      "slug": "string",
      "summary": "string",
      "instructions": "string",
      "creator": "string",
      "creator_email": "string",
      "image": "string"
    }
  ]
}
```

## Data Models

### Meal

```typescript
interface Meal {
    _id: string;
    title: string;
    slug: string;           // Auto-generated from title via slugify
    summary: string;
    instructions: string;   // XSS-sanitized
    creator: string;
    creator_email: string;
    image: string;          // S3 filename
}
```

### MealFormData (client-side form)

```typescript
interface MealFormData {
    name: string;
    email: string;
    title: string;
    summary: string;
    instructions: string;
    image: File | null;
}
```

## Key Implementation Details

### MongoDB Connection Caching

The MongoDB client is cached in `lib/mongodb.ts` to prevent connection exhaustion in serverless environments. A single connection is reused across requests.

### Image Upload Flow

1. User selects an image via `ImagePicker` component
2. `FileReader` creates a client-side preview
3. On form submit, the image is sent as `FormData` to the API route
4. The server generates a filename from the meal slug
5. Image is uploaded to S3 via `putObject`
6. The S3 filename is stored in MongoDB

### TanStack Query Caching

- All meals are cached with query key `['meals']`
- Single meals are cached with query key `['meals', slug]`
- Cache is automatically invalidated after a successful `createMeal` mutation
- Default stale time: 60 seconds
- `refetchOnWindowFocus` is disabled

### Security

- User-submitted instructions are sanitized with the `xss` library
- Email validation on both client and server
- Image file type restricted to PNG and JPEG
- All form fields validated before database insertion

## Styling

- **CSS Modules** for component-scoped styles (`.module.css`)
- **Global styles** in `app/globals.css`
- **Fonts**: Quicksand (body), Montserrat (headings)
- Gradient backgrounds and modern UI design
- Responsive layout using CSS Grid and Flexbox
