-- CreateEnum
CREATE TYPE "RankBucket" AS ENUM ('liked', 'fine', 'didnt_like');

-- CreateTable
CREATE TABLE "played_courses" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "played_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rank_position" INTEGER,
    "bucket" "RankBucket",

    CONSTRAINT "played_courses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "played_courses_user_id_idx" ON "played_courses"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "played_courses_user_id_course_id_key" ON "played_courses"("user_id", "course_id");
