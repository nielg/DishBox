/*
  Warnings:

  - You are about to drop the column `portion` on the `recipe` table. All the data in the column will be lost.
  - Added the required column `portions` to the `recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "recipe" DROP COLUMN "portion",
ADD COLUMN     "portions" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "recipe_img" (
    "id" SERIAL NOT NULL,
    "recipe_id" INTEGER NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "recipe_img_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "recipe_img" ADD CONSTRAINT "recipe_img_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
