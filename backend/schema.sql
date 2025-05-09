BEGIN;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('active', 'archived')),
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE project_users (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('admin', 'manager', 'engineer', 'reviewer', 'viewer')),
  UNIQUE (user_id, project_id)
);

CREATE TABLE requirements (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  requirement_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('functional', 'non-functional')),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT CHECK (status IN ('draft', 'reviewed', 'approved', 'verified')),
  verification_method TEXT CHECK (verification_method IN ('test', 'inspection', 'analysis', 'demo')),
  source TEXT,
  stakeholder TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE subsystems (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT
);

CREATE TABLE requirement_subsystems (
  id SERIAL PRIMARY KEY,
  requirement_id INTEGER REFERENCES requirements(id) ON DELETE CASCADE,
  subsystem_id INTEGER REFERENCES subsystems(id) ON DELETE CASCADE,
  UNIQUE (requirement_id, subsystem_id)
);

CREATE TABLE test_cases (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  test_case_id TEXT,
  description TEXT,
  test_steps TEXT,
  prerequisites TEXT,
  test_data TEXT,
  expected_result TEXT,
  actual_result TEXT,
  status TEXT CHECK (status IN ('planned', 'in_progress', 'passed', 'failed')),
  evidence_link TEXT,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE requirement_test_cases (
  id SERIAL PRIMARY KEY,
  requirement_id INTEGER REFERENCES requirements(id) ON DELETE CASCADE,
  test_case_id INTEGER REFERENCES test_cases(id) ON DELETE CASCADE,
  UNIQUE (requirement_id, test_case_id)
);

CREATE TABLE files (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  filename TEXT,
  file_url TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

COMMIT;