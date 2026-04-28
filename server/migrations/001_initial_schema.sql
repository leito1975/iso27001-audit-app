-- ISO 27001 Audit App - Database Schema
-- Run this script to create all tables

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'auditor',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Controls table (Annex A)
CREATE TABLE IF NOT EXISTS controls (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    objective TEXT
);

-- Control Assessments
CREATE TABLE IF NOT EXISTS control_assessments (
    id SERIAL PRIMARY KEY,
    control_id VARCHAR(20) REFERENCES controls(id) ON DELETE CASCADE,
    maturity_level INTEGER,
    target_level INTEGER DEFAULT 3,
    applicable BOOLEAN DEFAULT true,
    evidence TEXT,
    assessed_by INTEGER REFERENCES users(id),
    assessed_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(control_id)
);

-- Tags
CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(20) DEFAULT '#3b82f6'
);

-- Findings
CREATE TABLE IF NOT EXISTS findings (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50),
    status VARCHAR(50) DEFAULT 'abierto',
    severity VARCHAR(50),
    control_id VARCHAR(20) REFERENCES controls(id),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Finding Tags junction
CREATE TABLE IF NOT EXISTS finding_tags (
    finding_id INTEGER REFERENCES findings(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (finding_id, tag_id)
);

-- Risks
CREATE TABLE IF NOT EXISTS risks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    probability INTEGER,
    impact INTEGER,
    status VARCHAR(50) DEFAULT 'identificado',
    treatment VARCHAR(50),
    control_id VARCHAR(20) REFERENCES controls(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Risk Tags junction
CREATE TABLE IF NOT EXISTS risk_tags (
    risk_id INTEGER REFERENCES risks(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (risk_id, tag_id)
);

-- Action Plans
CREATE TABLE IF NOT EXISTS action_plans (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    finding_id INTEGER REFERENCES findings(id),
    risk_id INTEGER REFERENCES risks(id),
    responsible VARCHAR(255),
    due_date DATE,
    status VARCHAR(50) DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Attachments
CREATE TABLE IF NOT EXISTS attachments (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255),
    file_path VARCHAR(500),
    file_type VARCHAR(100),
    file_size INTEGER,
    control_id VARCHAR(20) REFERENCES controls(id) ON DELETE CASCADE,
    uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_findings_status ON findings(status);
CREATE INDEX IF NOT EXISTS idx_findings_control ON findings(control_id);
CREATE INDEX IF NOT EXISTS idx_risks_status ON risks(status);
CREATE INDEX IF NOT EXISTS idx_risks_control ON risks(control_id);
CREATE INDEX IF NOT EXISTS idx_action_plans_status ON action_plans(status);
CREATE INDEX IF NOT EXISTS idx_action_plans_due_date ON action_plans(due_date);
CREATE INDEX IF NOT EXISTS idx_control_assessments_control ON control_assessments(control_id);
