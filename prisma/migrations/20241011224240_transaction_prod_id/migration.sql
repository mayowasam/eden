-- DropIndex
DROP INDEX "Item_id_key";

-- AlterTable
CREATE SEQUENCE item_id_seq;
ALTER TABLE "Item" ALTER COLUMN "id" SET DEFAULT nextval('item_id_seq'),
ADD CONSTRAINT "Item_pkey" PRIMARY KEY ("id");
ALTER SEQUENCE item_id_seq OWNED BY "Item"."id";
