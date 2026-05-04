-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('interested', 'applied', 'interview', 'offer', 'rejected', 'archived');

-- CreateEnum
CREATE TYPE "WorkMode" AS ENUM ('remote', 'hybrid', 'onsite', 'unknown');

-- CreateTable
CREATE TABLE "job_applications" (
    "id" UUID NOT NULL,
    "company" VARCHAR(120) NOT NULL,
    "role" VARCHAR(160) NOT NULL,
    "jobUrl" VARCHAR(500),
    "source" VARCHAR(80),
    "location" VARCHAR(120),
    "workMode" "WorkMode" NOT NULL DEFAULT 'unknown',
    "status" "ApplicationStatus" NOT NULL DEFAULT 'interested',
    "dateApplied" DATE,
    "nextActionDate" DATE,
    "stacks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notes" VARCHAR(2000),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "job_applications_status_idx" ON "job_applications"("status");

-- CreateIndex
CREATE INDEX "job_applications_workMode_idx" ON "job_applications"("workMode");
