/*
  Warnings:

  - You are about to drop the column `product_id` on the `Item` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_product_id_fkey";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "product_id";
