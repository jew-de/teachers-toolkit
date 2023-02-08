-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Seatingplan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created" TEXT NOT NULL,
    CONSTRAINT "Seatingplan_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Seatingplan" ("courseId", "created", "id", "title") SELECT "courseId", "created", "id", "title" FROM "Seatingplan";
DROP TABLE "Seatingplan";
ALTER TABLE "new_Seatingplan" RENAME TO "Seatingplan";
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "topic" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    CONSTRAINT "Session_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("courseId", "date", "description", "duration", "id", "topic") SELECT "courseId", "date", "description", "duration", "id", "topic" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
CREATE TABLE "new_Student" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "sirname" TEXT NOT NULL,
    "gender" INTEGER NOT NULL,
    "dateOfBirth" TEXT NOT NULL,
    "visuals" INTEGER NOT NULL
);
INSERT INTO "new_Student" ("dateOfBirth", "gender", "id", "name", "sirname", "visuals") SELECT "dateOfBirth", "gender", "id", "name", "sirname", "visuals" FROM "Student";
DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
CREATE TABLE "new_Grouping" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "created" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    CONSTRAINT "Grouping_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Grouping" ("courseId", "created", "id", "title") SELECT "courseId", "created", "id", "title" FROM "Grouping";
DROP TABLE "Grouping";
ALTER TABLE "new_Grouping" RENAME TO "Grouping";
CREATE TABLE "new_Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "created" TEXT NOT NULL,
    "quantityValue" INTEGER NOT NULL DEFAULT 50
);
INSERT INTO "new_Course" ("created", "id", "quantityValue", "subject", "title", "year") SELECT "created", "id", "quantityValue", "subject", "title", "year" FROM "Course";
DROP TABLE "Course";
ALTER TABLE "new_Course" RENAME TO "Course";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
