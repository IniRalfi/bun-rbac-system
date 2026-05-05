// seed.ts
import pool from "./src/config/database";

const seed = async () => {
  const username = "admin";
  const password = "password123"; // Ini password lo nanti
  const role_id = 1; // ID 1 biasanya 'admin' sesuai SQL tadi

  const hashedPassword = await Bun.password.hash(password);

  try {
    await pool.query("INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)", [
      username,
      hashedPassword,
      role_id,
    ]);
    console.log("✅ User Admin berhasil dibuat!");
    console.log("Username: admin");
    console.log("Password: password123");
  } catch (err) {
    console.error("❌ Gagal membuat user:", err);
  } finally {
    process.exit();
  }
};

seed();
