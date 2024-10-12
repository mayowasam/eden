/*
  Warnings:

  - You are about to drop the column `productId` on the `Item` table. All the data in the column will be lost.
  - Added the required column `product_id` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "productId",
ADD COLUMN     "product_id" INTEGER NOT NULL;
