-- Table Role
CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Permissions (disarankan jamak biar konsisten)
CREATE TABLE permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) UNIQUE NOT NULL,
  resource VARCHAR(50),
  source VARCHAR(50)
);

-- Table users
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
);

-- Table role_permissions (pakai underscore, jangan strip)
CREATE TABLE role_permissions (
  role_id INT,
  permission_id INT,
  PRIMARY KEY (role_id, permission_id), -- Tambah koma di sini
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,  
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);
