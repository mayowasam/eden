-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('users', 'admins');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "ROLE" NOT NULL DEFAULT 'users';
