-- CreateTable
CREATE TABLE "Crawl" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "html" TEXT NOT NULL,
    "screenshotPath" TEXT,
    "title" TEXT,
    "metaDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Crawl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "url" TEXT NOT NULL,
    "frontend" TEXT NOT NULL,
    "css" TEXT NOT NULL,
    "backend" TEXT,
    "database" TEXT,
    "layout" TEXT,
    "files" TEXT,
    "report" TEXT,
    "zipPath" TEXT,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);
