-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "studentCameraMode" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'STUDENT';
