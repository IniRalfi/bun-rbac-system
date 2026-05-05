import express from "express";
import "dotenv/config";
import userRoutes from "./routers/userRoutes";
import roleRoutes from "./routers/roleRoutes";
import permissionRoutes from "./routers/permissionRoutes";
import path from "path";
import session from "express-session";
import authRoutes from "./routers/authRoutes";

// Tambahkan deklarasi ini supaya TypeScript tahu req.user itu ada
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

app.use(
  session({
    secret: "rahasia-banget",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);

app.use((req, res, next) => {
  req.user = (req as any).session?.user;
  next();
});

app.use("/users", userRoutes);
app.use("/roles", roleRoutes);
app.use("/permissions", permissionRoutes);
app.use("/", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
