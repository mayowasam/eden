-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_transactionId_fkey";

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "transactionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
