# 🗺️ Roadmap: RBAC System — Bun.js + TypeScript + EJS + TailwindCSS

> **Status Audit**: 7 Mei 2026 — Berdasarkan kondisi aktual file proyek.

---

## 📊 Status Overview

| Komponen | Status |
|---|---|
| `index.ts` (entry point) | ✅ Selesai |
| `config/database.ts` | ✅ Selesai |
| `middleware/rbacMiddleware.ts` | ✅ Selesai |
| `models/userModel.ts` | ✅ Selesai |
| `models/roleModel.ts` | ❌ Kosong |
| `models/permissionModel.ts` | ⚠️ Ada tapi ada bug (`source` vs `action`) |
| `controllers/authController.ts` | ✅ Selesai |
| `controllers/userController.ts` | ⚠️ Partial (belum ada `create` view) |
| `controllers/roleController.ts` | ❌ Kosong |
| `controllers/permissionController.ts` | ❌ Kosong |
| `routers/authRoutes.ts` | ✅ Selesai |
| `routers/userRoutes.ts` | ✅ Selesai |
| `routers/roleRoutes.ts` | ⚠️ Salah — masih pakai controller user |
| `routers/permissionRoutes.ts` | ⚠️ Salah — masih pakai controller user |
| `views/layouts/main.ejs` | ✅ Selesai |
| `views/layouts/sidebar.ejs` | ⚠️ Partial (belum ada active state) |
| `views/layouts/header.ejs` | ⚠️ Perlu dicek |
| `views/layouts/footer.ejs` | ⚠️ Perlu dicek (file kosong) |
| `views/auth/login.ejs` | ✅ Ada |
| `views/users/list.ejs` | ✅ Ada |
| `views/users/create.ejs` | ❌ Belum ada |
| `views/roles/*` | ❌ Direktori kosong |
| `views/permissions/*` | ❌ Direktori kosong |
| `data/data.sql` | ⚠️ Partial (kolom `action` salah jadi `source`, seed data kurang) |
| TailwindCSS build | ⚠️ Perlu dicek apakah `public/css/tailwind.css` ter-generate |

---

## 🐛 Bug yang Harus Diperbaiki Dulu (Prioritas Tinggi)

### BUG-01: `permissionModel.ts` — field `source` vs `action`
```
❌ source: string;  // di model
❌ source VARCHAR(50)  // di data.sql
✅ Seharusnya: action: string; / action VARCHAR(20)
```
- File: `src/models/permissionModel.ts` → ganti `source` jadi `action`
- File: `data/data.sql` → ganti `source VARCHAR(50)` jadi `action VARCHAR(20)`

### BUG-02: `roleRoutes.ts` & `permissionRoutes.ts` — import salah
```typescript
❌ import { listUsers, storeUser, removeUser } from '../controllers/userController';
✅ Seharusnya import dari roleController / permissionController masing-masing
```

### BUG-03: `data.sql` — Seed data tidak lengkap
- Belum ada INSERT untuk `permissions`, `users`, dan `role_permissions`
- Baru ada: `INSERT INTO roles (name) VALUES ('admin'), ('editor');`

---

## ✅ PHASE 1 — Perbaikan Bug & Fondasi Database
> **Target**: Proyek bisa jalan tanpa error

- [ ] **1.1** Fix `data/data.sql` — tambah kolom `action`, lengkapi seed data (roles, permissions, users, role_permissions)
- [ ] **1.2** Fix `src/models/permissionModel.ts` — rename `source` → `action`, tambah CRUD lengkap
- [ ] **1.3** Isi `src/models/roleModel.ts` — buat interface `Role` + fungsi `getAllRoles`, `createRole`, `deleteRole`, `getRoleWithPermissions`
- [ ] **1.4** Fix `src/routers/roleRoutes.ts` — sambungkan ke `roleController`
- [ ] **1.5** Fix `src/routers/permissionRoutes.ts` — sambungkan ke `permissionController`
- [ ] **1.6** Verifikasi `public/css/tailwind.css` sudah ter-generate (jalankan Tailwind build)

---

## ✅ PHASE 2 — Role & Permission Module (Backend)
> **Target**: CRUD Roles & Permissions berfungsi penuh

- [ ] **2.1** Isi `src/controllers/roleController.ts`:
  - `listRoles` — tampilkan semua role
  - `showCreateRole` — form tambah role
  - `storeRole` — simpan role baru
  - `deleteRole` — hapus role
  - `showAssignPermission` — form assign permission ke role
  - `assignPermission` — proses assign
  - `revokePermission` — cabut permission dari role

- [ ] **2.2** Isi `src/controllers/permissionController.ts`:
  - `listPermissions` — tampilkan semua permission
  - `showCreatePermission` — form tambah permission
  - `storePermission` — simpan permission baru
  - `deletePermission` — hapus permission

- [ ] **2.3** Update `src/models/roleModel.ts` dengan fungsi:
  - `getAllRoles()` 
  - `createRole(name: string)`
  - `deleteRole(id: number)`
  - `getRolePermissions(roleId: number)` — query JOIN ke `role_permissions`
  - `assignPermissionToRole(roleId, permissionId)`
  - `revokePermissionFromRole(roleId, permissionId)`

- [ ] **2.4** Update route di `roleRoutes.ts` dengan permission guard yang benar:
  ```
  GET  /roles             → role:view
  GET  /roles/create      → role:create
  POST /roles             → role:create
  DELETE /roles/:id       → role:delete
  GET  /roles/:id/permissions → role:view
  POST /roles/:id/permissions → role:edit
  DELETE /roles/:id/permissions/:permId → role:edit
  ```

- [ ] **2.5** Update route di `permissionRoutes.ts`:
  ```
  GET  /permissions             → permission:view
  GET  /permissions/create      → permission:create
  POST /permissions             → permission:create
  DELETE /permissions/:id       → permission:delete
  ```

---

## ✅ PHASE 3 — User Module (Update & Edit)
> **Target**: User management lengkap dengan fitur edit

- [ ] **3.1** Tambah fungsi di `src/models/userModel.ts`:
  - `getUserById(id: number)`
  - `updateUser(id: number, data: Partial<User>)`

- [ ] **3.2** Update `src/controllers/userController.ts`:
  - `showCreateUser` — form tambah user + list roles
  - `showEditUser` — form edit user
  - `updateUser` — proses update user

- [ ] **3.3** Update `src/routers/userRoutes.ts`:
  ```
  GET  /users/create     → user:create
  GET  /users/:id/edit   → user:edit
  PUT  /users/:id        → user:edit  (via method-override)
  ```

---

## ✅ PHASE 4 — Views (EJS Templates)
> **Target**: Semua halaman UI tersedia dan konsisten

### Views/Layouts
- [ ] **4.1** `views/layouts/header.ejs` — Tampilkan username + role + tombol logout
- [ ] **4.2** `views/layouts/footer.ejs` — Isi footer yang sekarang kosong
- [ ] **4.3** `views/layouts/sidebar.ejs` — Tambah active state berdasarkan URL

### Views/Users
- [ ] **4.4** `views/users/create.ejs` — Form tambah user (username, password, pilih role)
- [ ] **4.5** `views/users/edit.ejs` — Form edit user (ganti role)

### Views/Roles
- [ ] **4.6** `views/roles/list.ejs` — Tabel semua role + jumlah permission
- [ ] **4.7** `views/roles/create.ejs` — Form tambah role
- [ ] **4.8** `views/roles/permissions.ejs` — Halaman assign/revoke permission ke role

### Views/Permissions
- [ ] **4.9** `views/permissions/list.ejs` — Tabel semua permission (name, resource, action)
- [ ] **4.10** `views/permissions/create.ejs` — Form tambah permission

---

## ✅ PHASE 5 — Auth & Security
> **Target**: Auth aman dan redirect yang benar

- [ ] **5.1** Tambah middleware `isAuthenticated` — redirect ke `/login` jika belum login
- [ ] **5.2** Pasang `isAuthenticated` di semua route protected (users, roles, permissions)
- [ ] **5.3** Update `authController.ts` — error login yang lebih baik (flash message atau query param)
- [ ] **5.4** Update `views/auth/login.ejs` — tampilkan pesan error login
- [ ] **5.5** Tambah halaman `403 Forbidden` yang proper (bukan JSON response)
- [ ] **5.6** Tambah halaman `404 Not Found`

---

## ✅ PHASE 6 — UI Polish & TailwindCSS
> **Target**: Tampilan rapi dan konsisten

- [ ] **6.1** Setup Tailwind build script di `package.json`:
  ```json
  "scripts": {
    "dev": "bun run src/index.ts",
    "build:css": "bunx @tailwindcss/cli -i src/styles/input.css -o public/css/tailwind.css",
    "watch:css": "bunx @tailwindcss/cli -i src/styles/input.css -o public/css/tailwind.css --watch"
  }
  ```
- [ ] **6.2** Pastikan `src/styles/input.css` berisi `@import "tailwindcss";`
- [ ] **6.3** Styling konsisten untuk semua tabel (zebra stripe, hover, badge)
- [ ] **6.4** Tombol aksi konsisten (warna, ukuran, icon jika pakai)
- [ ] **6.5** Responsive layout (sidebar collapse di mobile)
- [ ] **6.6** Flash message / notifikasi sukses/gagal setelah operasi CRUD

---

## ✅ PHASE 7 — Data Seed & Testing
> **Target**: Demo siap jalan dengan data lengkap

- [ ] **7.1** Lengkapi `data/data.sql` dengan seed data final:
  ```sql
  -- 3 roles: admin, editor, viewer
  -- 8+ permissions: user:view/create/edit/delete, role:view/create/edit/delete, permission:view/create
  -- 3 users dengan role berbeda (password: pakai bcrypt hash)
  -- role_permissions mapping sesuai materi
  ```
- [ ] **7.2** Update `seed.ts` agar bisa run langsung: `bun run seed.ts`
- [ ] **7.3** Test manual semua alur:
  - Login sebagai admin → akses semua fitur
  - Login sebagai editor → hanya view + create
  - Login sebagai viewer → hanya view
  - Akses halaman tanpa login → redirect ke `/login`
  - Akses tanpa permission → halaman 403

---

## 📋 Quick Reference — Urutan Pengerjaan

```
PHASE 1 (Bug Fix)  →  PHASE 2 (Role & Permission)  →  PHASE 3 (User Update)
       ↓
PHASE 4 (Views)  →  PHASE 5 (Auth & Security)  →  PHASE 6 (UI Polish)
       ↓
PHASE 7 (Seed & Testing)  →  🎉 SELESAI
```

---

## 📁 File yang Perlu Dibuat/Diisi (Summary)

| File | Action |
|---|---|
| `data/data.sql` | Fix kolom + lengkapi seed |
| `src/models/roleModel.ts` | Buat dari nol |
| `src/models/permissionModel.ts` | Fix bug + tambah CRUD |
| `src/controllers/roleController.ts` | Buat dari nol |
| `src/controllers/permissionController.ts` | Buat dari nol |
| `src/controllers/userController.ts` | Tambah create + edit |
| `src/routers/roleRoutes.ts` | Fix import + tambah routes |
| `src/routers/permissionRoutes.ts` | Fix import + tambah routes |
| `src/routers/userRoutes.ts` | Tambah create + edit routes |
| `src/middleware/rbacMiddleware.ts` | Tambah `isAuthenticated` |
| `src/views/layouts/header.ejs` | Update dengan user info + logout |
| `src/views/layouts/footer.ejs` | Isi konten |
| `src/views/layouts/sidebar.ejs` | Tambah active state |
| `src/views/users/create.ejs` | Buat dari nol |
| `src/views/users/edit.ejs` | Buat dari nol |
| `src/views/roles/list.ejs` | Buat dari nol |
| `src/views/roles/create.ejs` | Buat dari nol |
| `src/views/roles/permissions.ejs` | Buat dari nol |
| `src/views/permissions/list.ejs` | Buat dari nol |
| `src/views/permissions/create.ejs` | Buat dari nol |
| `src/views/errors/403.ejs` | Buat dari nol |
| `src/views/errors/404.ejs` | Buat dari nol |

---

> 💡 **Tips**: Kerjakan per phase, jangan loncat-loncat. Phase 1 wajib selesai dulu sebelum yang lain bisa ditest.
