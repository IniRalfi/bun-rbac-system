import pool from "./src/config/database";
import type { ResultSetHeader } from "mysql2";

async function seed() {
  console.log("🚀 Memulai seeding data...");

  try {
    // 1. Bersihkan data lama (Urutan harus bener biar nggak error Foreign Key)
    console.log("🧹 Membersihkan tabel...");
    await pool.query("DELETE FROM role_permissions");
    await pool.query("DELETE FROM users");
    await pool.query("DELETE FROM permissions");
    await pool.query("DELETE FROM roles");
    await pool.query("ALTER TABLE roles AUTO_INCREMENT = 1");
    await pool.query("ALTER TABLE permissions AUTO_INCREMENT = 1");
    await pool.query("ALTER TABLE users AUTO_INCREMENT = 1");

    // 2. Insert Roles
    console.log("🎭 Menambahkan Roles...");
    const [roleAdmin] = await pool.query<ResultSetHeader>(
      "INSERT INTO roles (name) VALUES ('admin')",
    );
    const [roleEditor] = await pool.query<ResultSetHeader>(
      "INSERT INTO roles (name) VALUES ('editor')",
    );
    const [roleViewer] = await pool.query<ResultSetHeader>(
      "INSERT INTO roles (name) VALUES ('viewer')",
    );

    const adminId = roleAdmin.insertId;
    const editorId = roleEditor.insertId;
    const viewerId = roleViewer.insertId;

    // 3. Insert Permissions
    console.log("🔑 Menambahkan Permissions...");
    const perms = [
      ["user:view", "users", "view"],
      ["user:create", "users", "create"],
      ["user:edit", "users", "edit"],
      ["user:delete", "users", "delete"],
      ["role:view", "roles", "view"],
      ["role:create", "roles", "create"],
      ["role:edit", "roles", "edit"],
      ["role:delete", "roles", "delete"],
      ["permission:view", "permissions", "view"],
      ["permission:create", "permissions", "create"],
    ];

    const permIds: number[] = [];
    for (const p of perms) {
      const [res] = await pool.query<ResultSetHeader>(
        "INSERT INTO permissions (name, resource, action) VALUES (?, ?, ?)",
        p,
      );
      permIds.push(res.insertId);
    }

    // 4. Mapping Role-Permissions
    console.log("🗺️ Mapping Role-Permissions...");
    // Admin: Semua akses
    for (const id of permIds) {
      await pool.query("INSERT INTO role_permissions VALUES (?, ?)", [adminId, id]);
    }

    // Editor: User view/create + Role view + Permission view
    const editorPerms = [1, 2, 5, 9];
    for (const id of editorPerms) {
      await pool.query("INSERT INTO role_permissions VALUES (?, ?)", [editorId, id]);
    }

    // Viewer: Hanya view saja
    const viewerPerms = [1, 5, 9];
    for (const id of viewerPerms) {
      await pool.query("INSERT INTO role_permissions VALUES (?, ?)", [viewerId, id]);
    }

    // 5. Create Default Users (Password: password123)
    console.log("👤 Membuat User dummy...");
    const hashedPassword = await Bun.password.hash("password123");

    await pool.query("INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)", [
      "admin",
      hashedPassword,
      adminId,
    ]);
    await pool.query("INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)", [
      "editor",
      hashedPassword,
      editorId,
    ]);
    await pool.query("INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)", [
      "viewer",
      hashedPassword,
      viewerId,
    ]);

    console.log("✅ Seeding selesai! User: admin/editor/viewer, Pass: password123");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding gagal:", error);
    process.exit(1);
  }
}

seed();
