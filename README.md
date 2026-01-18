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
│   │   └── fonts/         # IBM Plex Sans Arabic
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

## Features

- **Search**: Search for podcasts by keyword using iTunes Search API
- **Persistence**: Results are stored in PostgreSQL for future reference
- **RTL Support**: Full Arabic language support with right-to-left layout
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Theme**: Modern dark UI inspired by Podbay.fm

## Screenshots

The UI includes:
- Home page with search bar
- Search results with podcast carousel
- Episode grid with colored accent labels

---

## Documentation

### Approach

1. **Backend Architecture**: Used NestJS for its modular structure and TypeScript support. The search module handles all podcast-related operations, with a dedicated service for iTunes API integration.

2. **Database Design**: Chose PostgreSQL for reliability and Prisma ORM for type-safe database operations. The schema stores essential podcast data with indexing on commonly queried fields.

3. **Frontend Design**: Built with Next.js 14 App Router for modern React patterns. Components are designed to closely match the Podbay.fm reference design.

4. **Styling**: Used Tailwind CSS with custom color tokens extracted from the reference design for pixel-perfect styling.

### Challenges Faced

1. **iTunes API Response**: The iTunes API returns different data structures depending on the search parameters. Handled this by mapping only the essential fields.

2. **Image Optimization**: iTunes provides multiple artwork sizes. Used Next.js Image component with proper remote patterns configuration.

3. **RTL Layout**: Ensuring proper right-to-left text direction and scroll behavior for Arabic content.

### Suggestions for Improvement

1. **Caching**: Implement Redis caching for frequently searched terms to reduce API calls.

2. **Pagination**: Add pagination for search results to handle large result sets.

3. **User Authentication**: Add user accounts to save favorite podcasts.

4. **Episode Details**: Fetch and display individual episode information from podcast RSS feeds.

5. **Search History**: Store and display recent searches for better UX.

6. **Full-Text Search**: Implement PostgreSQL full-text search for searching within stored podcasts.
