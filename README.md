# Thmanyah Fullstack Challenge - Podcast Search


## Local/Dev Setup

### 1. Database Setup (PostgreSQL)

```bash
docker run --name postgres-podcast -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=podcast_search -p 5432:5432 -d postgres:15
```

or 

```bash
createdb podcast_search
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev --name init

# Start development server
npm run start:dev
```

The backend will run on `http://localhost:3001`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | NestJS + TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS |

## Project Structure

```
thmanyah-fullstack-challenge/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── main.ts         # Entry point
│   │   ├── app.module.ts   # Root module
│   │   ├── prisma/         # Database service
│   │   └── search/         # Search module (controller, service, iTunes integration)
│   └── prisma/
│       └── schema.prisma   # Database schema
├── frontend/               # Next.js App
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # React components
│   │   ├── types/         # TypeScript types
│   └── tailwind.config.ts # Tailwind configuration
└── README.md
```

## Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

## API Endpoints

### Search Podcasts & Episodes

```
GET /api/search?term={keyword}
```

**Response:**
```json
{
  "success": true,
  "term": "keyword",
  "podcasts": [
    {
      "id": 1,
      "trackId": 985515827,
      "collectionName": "Podcast Name",
      "artistName": "Artist Name",
      "artworkUrl100": "...",
      "artworkUrl600": "...",
      "feedUrl": "...",
      "trackCount": 300,
      "primaryGenre": "Genre",
      "releaseDate": "2024-01-01T00:00:00.000Z",
      "searchTerm": "keyword",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "episodes": [
    {
      "trackId": 123456789,
      "collectionId": 985515827,
      "collectionName": "Podcast Name",
      "trackName": "Episode Title",
      "artistName": "Artist Name",
      "artworkUrl60": "...",
      "artworkUrl160": "...",
      "artworkUrl600": "...",
      "releaseDate": "2024-01-01T00:00:00.000Z",
      "trackTimeMillis": 1800000,
      "description": "Episode description...",
      "shortDescription": "Short description..."
    }
  ]
}
```

---


## Deploying to Vercel

This project deploys as **two separate Vercel projects** from the same repo (monorepo setup).

### Prerequisites

- A [Vercel](https://vercel.com) account
- A cloud PostgreSQL database ([Neon](https://neon.tech), [Supabase](https://supabase.com), or [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres))

### 1. Set Up a Cloud Database

Create a PostgreSQL database on your preferred provider and note the connection string (e.g. `postgresql://user:pass@host:5432/dbname`).

### 2. Deploy the Backend

1. Import the repo on Vercel → **New Project**
2. Set the **Root Directory** to `backend`
3. Set **Framework Preset** to `Other`
4. Add the following **Environment Variable**:
   - `DATABASE_URL` = your cloud PostgreSQL connection string
5. Deploy

Once deployed, note the backend URL (e.g. `https://your-backend.vercel.app`).

### 3. Deploy the Frontend

1. Import the same repo again on Vercel → **New Project**
2. Set the **Root Directory** to `frontend`
3. Set **Framework Preset** to `Next.js`
4. Add the following **Environment Variable**:
   - `NEXT_PUBLIC_API_URL` = your backend Vercel URL (e.g. `https://your-backend.vercel.app`)
5. Deploy

### 4. (Optional) Configure CORS

If you want to restrict backend CORS to only your frontend domain, add to the backend project's environment variables:

- `CORS_ORIGINS` = `https://your-frontend.vercel.app`

### Environment Variables Summary

| Project  | Variable              | Description                          |
|----------|-----------------------|--------------------------------------|
| Backend  | `DATABASE_URL`        | PostgreSQL connection string         |
| Backend  | `CORS_ORIGINS`        | Comma-separated allowed origins      |
| Frontend | `NEXT_PUBLIC_API_URL` | Backend URL (e.g. `https://...`)     |

---

### Challenges Faced

1. **iTunes API Response**: The iTunes API returns different data structures depending on the search parameters. Handled this by mapping only the essential fields.

2. **Image Optimization**: iTunes provides multiple artwork sizes. Used Next.js Image component with proper remote patterns configuration.


### Possible Improvement

1. **Caching**: 
  - Save already searched / frequently-searched-for items and return them from a cache 

2. **Search History**: 
  - Store and display recent searches

3. **Split into two repos**:
  - Frontend and backend (standalone server)
  - This is better for modularity and CI/CD

----

If you have any questions feel free to reach out at hakeemmidan@gmail.com