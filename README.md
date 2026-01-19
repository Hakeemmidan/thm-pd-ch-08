# Thmanyah Fullstack Challenge - Podcast Search

A fullstack podcast search application that integrates with iTunes Search API, stores results in PostgreSQL, and displays them in a modern UI inspired by Podbay.fm.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | NestJS + TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Font | IBM Plex Sans Arabic |

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
│   │   └── fonts/         # Fonts
│   └── tailwind.config.ts # Tailwind configuration
└── README.md
```

## Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

## Setup Instructions

### 1. Database Setup

Create a PostgreSQL database:


or 

```bash
createdb podcast_search
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment (edit .env with your database URL)
# DATABASE_URL="postgresql://username:password@localhost:5432/podcast_search"

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

## API Endpoints

### Search Podcasts

```
GET /api/search?term={keyword}
```

**Response:**
```json
{
  "success": true,
  "count": 20,
  "term": "فنجان",
  "results": [
    {
      "id": 1,
      "trackId": 985515827,
      "collectionName": "فنجان مع عبدالرحمن أبومالح",
      "artistName": "ثمانية/ thmanyah",
      "artworkUrl100": "...",
      "artworkUrl600": "...",
      "feedUrl": "...",
      "trackCount": 300,
      "primaryGenre": "Society & Culture",
      "releaseDate": "2024-01-01T00:00:00.000Z",
      "searchTerm": "فنجان",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---


### Challenges Faced

1. **iTunes API Response**: The iTunes API returns different data structures depending on the search parameters. Handled this by mapping only the essential fields.

2. **Image Optimization**: iTunes provides multiple artwork sizes. Used Next.js Image component with proper remote patterns configuration.


### Possible Improvement

1. **Caching**: 
- Save already searched / frequently-searched-for items and return them from a cache 

2. **Search History**: 
- Store and display recent searches
