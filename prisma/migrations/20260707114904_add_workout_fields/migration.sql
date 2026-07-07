-- CreateEnum
CREATE TYPE "WorkoutStatus" AS ENUM ('PENDING', 'DONE', 'SKIPPED');

-- AlterTable
ALTER TABLE "PlannedWorkout" ADD COLUMN     "goal" TEXT,
ADD COLUMN     "intensity" TEXT,
ADD COLUMN     "status" "WorkoutStatus" NOT NULL DEFAULT 'PENDING';
