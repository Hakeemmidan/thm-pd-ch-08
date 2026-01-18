-- CreateTable
CREATE TABLE "Podcast" (
    "id" SERIAL NOT NULL,
    "trackId" INTEGER NOT NULL,
    "collectionName" TEXT NOT NULL,
    "artistName" TEXT NOT NULL,
    "artworkUrl100" TEXT NOT NULL,
    "artworkUrl600" TEXT NOT NULL,
    "feedUrl" TEXT,
    "trackCount" INTEGER,
    "primaryGenre" TEXT,
    "releaseDate" TIMESTAMP(3),
    "searchTerm" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Podcast_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Podcast_trackId_key" ON "Podcast"("trackId");

-- CreateIndex
CREATE INDEX "Podcast_searchTerm_idx" ON "Podcast"("searchTerm");

-- CreateIndex
CREATE INDEX "Podcast_trackId_idx" ON "Podcast"("trackId");
