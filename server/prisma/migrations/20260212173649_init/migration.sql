-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'auditor',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "controls" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "objective" TEXT
);

-- CreateTable
CREATE TABLE "control_assessments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "control_id" TEXT NOT NULL,
    "maturity_level" INTEGER,
    "target_level" INTEGER NOT NULL DEFAULT 3,
    "applicable" BOOLEAN NOT NULL DEFAULT true,
    "evidence" TEXT,
    "assessed_by" INTEGER,
    "assessed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "control_assessments_control_id_fkey" FOREIGN KEY ("control_id") REFERENCES "controls" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "control_assessments_assessed_by_fkey" FOREIGN KEY ("assessed_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tags" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#3b82f6'
);

-- CreateTable
CREATE TABLE "findings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT,
    "status" TEXT NOT NULL DEFAULT 'abierto',
    "severity" TEXT,
    "control_id" TEXT,
    "created_by" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "findings_control_id_fkey" FOREIGN KEY ("control_id") REFERENCES "controls" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "findings_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "finding_tags" (
    "finding_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    PRIMARY KEY ("finding_id", "tag_id"),
    CONSTRAINT "finding_tags_finding_id_fkey" FOREIGN KEY ("finding_id") REFERENCES "findings" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "finding_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "risks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "probability" INTEGER,
    "impact" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'identificado',
    "treatment" TEXT,
    "control_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "risks_control_id_fkey" FOREIGN KEY ("control_id") REFERENCES "controls" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "risk_tags" (
    "risk_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    PRIMARY KEY ("risk_id", "tag_id"),
    CONSTRAINT "risk_tags_risk_id_fkey" FOREIGN KEY ("risk_id") REFERENCES "risks" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "risk_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "action_plans" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "finding_id" INTEGER,
    "risk_id" INTEGER,
    "responsible" TEXT,
    "due_date" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'pendiente',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "action_plans_finding_id_fkey" FOREIGN KEY ("finding_id") REFERENCES "findings" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "action_plans_risk_id_fkey" FOREIGN KEY ("risk_id") REFERENCES "risks" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "attachments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filename" TEXT,
    "file_path" TEXT,
    "file_type" TEXT,
    "file_size" INTEGER,
    "control_id" TEXT,
    "uploaded_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "attachments_control_id_fkey" FOREIGN KEY ("control_id") REFERENCES "controls" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "control_assessments_control_id_key" ON "control_assessments"("control_id");
