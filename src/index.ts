import express from "express";
import "dotenv/config";
import userRoutes from "./routers/userRoutes";
import roleRoutes from "./routers/roleRoutes";
import permissionRoutes from "./routers/permissionRoutes";
import path from "path";
import session from "express-session";
import authRoutes from "./routers/authRoutes";
import methodOverride from "method-override";

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; username: string; role_id: number };
    }
  }
}

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "rbac-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
);

// Inject user dari session ke req.user
app.use((req, res, next) => {
  req.user = (req as any).session?.user;
  // Inject ke semua view: currentPath untuk active sidebar
  res.locals.currentPath = req.path;
  next();
});

// Redirect root ke login
app.use((req, res, next) => {
  if (req.path === "/") return res.redirect("/login");
  next();
});

app.use("/users", userRoutes);
app.use("/roles", roleRoutes);
app.use("/permissions", permissionRoutes);
app.use("/", authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render("errors/404", { title: "404 - Halaman Tidak Ditemukan" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
