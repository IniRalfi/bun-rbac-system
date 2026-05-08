-- ============================
-- RBAC SYSTEM — DATABASE SCHEMA
-- ============================

-- Tabel roles
CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel permissions
CREATE TABLE permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) UNIQUE NOT NULL,
  resource VARCHAR(50),
  action VARCHAR(20)
);

-- Tabel users
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
);

-- Tabel role_permissions (many-to-many)
CREATE TABLE role_permissions (
  role_id INT,
  permission_id INT,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- ============================
-- SEED DATA
-- ============================

-- Roles
INSERT INTO roles (name) VALUES 
  ('admin'), 
  ('editor'), 
  ('viewer');

-- Permissions
INSERT INTO permissions (name, resource, action) VALUES 
  ('user:view',        'users',       'view'),
  ('user:create',      'users',       'create'),
  ('user:edit',        'users',       'edit'),
  ('user:delete',      'users',       'delete'),
  ('role:view',        'roles',       'view'),
  ('role:create',      'roles',       'create'),
  ('role:edit',        'roles',       'edit'),
  ('role:delete',      'roles',       'delete'),
  ('permission:view',  'permissions', 'view'),
  ('permission:create','permissions', 'create');

-- Role-Permission mapping
-- admin  (id=1): semua akses
INSERT INTO role_permissions VALUES 
  (1,1),(1,2),(1,3),(1,4),
  (1,5),(1,6),(1,7),(1,8),
  (1,9),(1,10);

-- editor (id=2): user & role view+create saja
INSERT INTO role_permissions VALUES 
  (2,1),(2,2),
  (2,5),(2,6),
  (2,9);

-- viewer (id=3): hanya view
INSERT INTO role_permissions VALUES 
  (3,1),
  (3,5),
  (3,9);

-- Users (password plain: "password123" — ganti dengan hash hasil seed.ts)
-- CATATAN: Jangan INSERT langsung password plain ke DB!
-- Gunakan seed.ts untuk generate hash dengan Bun.password.hash()
