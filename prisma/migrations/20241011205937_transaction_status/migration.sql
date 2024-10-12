/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Item` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Item_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Item_id_key" ON "Item"("id");
