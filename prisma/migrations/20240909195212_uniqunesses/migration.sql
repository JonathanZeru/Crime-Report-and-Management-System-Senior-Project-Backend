/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `DeskOfficer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `DeskOfficer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userName]` on the table `DeskOfficer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Inspector` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Inspector` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userName]` on the table `Inspector` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `PoliceHead` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `PoliceHead` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userName]` on the table `PoliceHead` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Prosecutor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Prosecutor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userName]` on the table `Prosecutor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Sajen` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Sajen` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userName]` on the table `Sajen` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `SystemAdmin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `SystemAdmin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userName]` on the table `SystemAdmin` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `DeskOfficer_email_key` ON `DeskOfficer`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `DeskOfficer_phone_key` ON `DeskOfficer`(`phone`);

-- CreateIndex
CREATE UNIQUE INDEX `DeskOfficer_userName_key` ON `DeskOfficer`(`userName`);

-- CreateIndex
CREATE UNIQUE INDEX `Inspector_email_key` ON `Inspector`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `Inspector_phone_key` ON `Inspector`(`phone`);

-- CreateIndex
CREATE UNIQUE INDEX `Inspector_userName_key` ON `Inspector`(`userName`);

-- CreateIndex
CREATE UNIQUE INDEX `PoliceHead_email_key` ON `PoliceHead`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `PoliceHead_phone_key` ON `PoliceHead`(`phone`);

-- CreateIndex
CREATE UNIQUE INDEX `PoliceHead_userName_key` ON `PoliceHead`(`userName`);

-- CreateIndex
CREATE UNIQUE INDEX `Prosecutor_email_key` ON `Prosecutor`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `Prosecutor_phone_key` ON `Prosecutor`(`phone`);

-- CreateIndex
CREATE UNIQUE INDEX `Prosecutor_userName_key` ON `Prosecutor`(`userName`);

-- CreateIndex
CREATE UNIQUE INDEX `Sajen_email_key` ON `Sajen`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `Sajen_phone_key` ON `Sajen`(`phone`);

-- CreateIndex
CREATE UNIQUE INDEX `Sajen_userName_key` ON `Sajen`(`userName`);

-- CreateIndex
CREATE UNIQUE INDEX `SystemAdmin_email_key` ON `SystemAdmin`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `SystemAdmin_phone_key` ON `SystemAdmin`(`phone`);

-- CreateIndex
CREATE UNIQUE INDEX `SystemAdmin_userName_key` ON `SystemAdmin`(`userName`);
