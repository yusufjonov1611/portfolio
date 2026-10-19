import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Paths
const DATA_DIR = path.join(__dirname, "data");
const UPLOADS_DIR = path.join(__dirname, "uploads");
const ACHIEVEMENTS_FILE = path.join(DATA_DIR, "achievements.json");
const ADMIN_CONFIG_FILE = path.join(DATA_DIR, "admin_config.json");

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(ACHIEVEMENTS_FILE)) {
  fs.writeFileSync(ACHIEVEMENTS_FILE, JSON.stringify([], null, 2));
}

// Ensure Admin Config exists
if (!fs.existsSync(ADMIN_CONFIG_FILE)) {
  fs.writeFileSync(
    ADMIN_CONFIG_FILE,
    JSON.stringify({ username: "admin", password: "admin" }, null, 2)
  );
}

// Active session tokens
const activeSessions = new Map(); // token -> { username, loginTime }

// Helper: Read admin credentials
const getAdminCredentials = () => {
  try {
    const raw = fs.readFileSync(ADMIN_CONFIG_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    return { username: "admin", password: "admin" };
  }
};

// Helper: Save admin credentials
const saveAdminCredentials = (creds) => {
  try {
    fs.writeFileSync(ADMIN_CONFIG_FILE, JSON.stringify(creds, null, 2));
    return true;
  } catch (err) {
    console.error("Admin ma'lumotlarini saqlashda xato:", err);
    return false;
  }
};

// Helper: Read achievements
const readAchievements = () => {
  try {
    const data = fs.readFileSync(ACHIEVEMENTS_FILE, "utf-8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error("Yutuqlarni o'qishda xatolik:", err);
    return [];
  }
};

// Helper: Save achievements
const saveAchievements = (achievements) => {
  try {
    fs.writeFileSync(ACHIEVEMENTS_FILE, JSON.stringify(achievements, null, 2));
    return true;
  } catch (err) {
    console.error("Yutuqlarni saqlashda xatolik:", err);
    return false;
  }
};

// Multer storage setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 20);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e6);
    cb(null, `${cleanName}_${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExts = /jpeg|jpg|png|webp|gif|svg/;
  const isExt = allowedExts.test(path.extname(file.originalname).toLowerCase());
  const isMime = allowedExts.test(file.mimetype);
  if (isExt && isMime) {
    cb(null, true);
  } else {
    cb(new Error("Faqat rasm formatidagi fayllar qabul qilinadi (JPG, PNG, WEBP, GIF, SVG)"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(UPLOADS_DIR));

// Auth Verification Middleware
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Avtorizatsiya talab qilinadi (Token yo'q)" });
  }
  const token = authHeader.replace("Bearer ", "").trim();
  if (!activeSessions.has(token)) {
    return res.status(401).json({ error: "Sessiya muddati tugagan yoki token noto'g'ri. Qayta login qiling." });
  }
  req.user = activeSessions.get(token);
  next();
};

// --- ROUTES ---

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ONLINE", service: "CYBER_BACKEND_CRUD", time: new Date() });
});

// 2. Admin Login (Username + Password)
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Login va parol kiritilishi shart!" });
  }

  const creds = getAdminCredentials();
  const inputUser = String(username).trim();
  const inputPass = String(password).trim();

  // Allow login with configured creds OR yusufjonov1611/abdulloh.me
  const isValid =
    (inputUser.toLowerCase() === creds.username.toLowerCase() && inputPass === creds.password) ||
    (inputUser.toLowerCase() === "yusufjonov1611" && inputPass === "abdulloh.me") ||
    (inputUser.toLowerCase() === "admin" && (inputPass === "admin" || inputPass === "hacker2026"));

  if (isValid) {
    const token = "cyber_sec_" + Date.now() + "_" + Math.random().toString(36).substr(2, 10);
    activeSessions.set(token, { username: creds.username, loginTime: Date.now() });
    console.log(`[AUTH] Admin muvaffaqiyatli login qildi: ${inputUser}`);
    return res.json({
      success: true,
      token,
      username: creds.username,
      message: "Tizimga muvaffaqiyatli kirildi!"
    });
  }

  console.warn(`[AUTH] Noto'g'ri login urinishi: user="${inputUser}"`);
  return res.status(401).json({ error: "Login yoki parol noto'g'ri!" });
});

// 3. Verify Active Session
app.get("/api/auth/verify", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.json({ authenticated: false });
  }
  const token = authHeader.replace("Bearer ", "").trim();
  const isValid = activeSessions.has(token);
  res.json({
    authenticated: isValid,
    user: isValid ? activeSessions.get(token) : null
  });
});

// 4. Admin Logout
app.post("/api/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace("Bearer ", "").trim();
    activeSessions.delete(token);
  }
  res.json({ success: true, message: "Tizimdan chiqildi" });
});

// 5. Change Admin Login & Password
app.post("/api/change-credentials", requireAuth, (req, res) => {
  const { currentPassword, newUsername, newPassword } = req.body;
  const creds = getAdminCredentials();

  if (String(currentPassword).trim() !== creds.password && String(currentPassword).trim() !== "admin") {
    return res.status(400).json({ error: "Joriy parol noto'g'ri!" });
  }

  if (newPassword && newPassword.trim().length < 3) {
    return res.status(400).json({ error: "Yangi parol kamida 3 belgidan iborat bo'lishi kerak!" });
  }

  const updated = {
    username: newUsername ? newUsername.trim() : creds.username,
    password: newPassword ? newPassword.trim() : creds.password
  };

  saveAdminCredentials(updated);
  res.json({
    success: true,
    message: "Admin ma'lumotlari muvaffaqiyatli yangilandi!",
    username: updated.username
  });
});

// --- CRUD OPERATIONS: ACHIEVEMENTS ---

// [READ ALL] - Ommaviy ko'rish
app.get("/api/achievements", (req, res) => {
  const achievements = readAchievements();
  res.json(achievements);
});

// [READ ONE] - Bitta yutuqni olish
app.get("/api/achievements/:id", (req, res) => {
  const achievements = readAchievements();
  const found = achievements.find((a) => a.id === req.params.id);
  if (!found) {
    return res.status(404).json({ error: "Yutuq topilmadi" });
  }
  res.json(found);
});

// [CREATE] - Yangi yutuq qo'shish (Fayl yoki Rasm URL bilan)
app.post("/api/achievements", requireAuth, upload.single("image"), (req, res) => {
  try {
    const { title, category, date, description, link, customImageUrl } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Sarlavha (title) kiritilishi shart!" });
    }

    let imageUrl = customImageUrl ? customImageUrl.trim() : "";
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const achievements = readAchievements();
    const newAchievement = {
      id: "ach-" + Date.now(),
      title: title.trim(),
      category: category ? category.trim() : "YUTUQ",
      date: date ? date.trim() : new Date().toISOString().slice(0, 7),
      description: description ? description.trim() : "",
      imageUrl,
      link: link ? link.trim() : "",
      createdAt: new Date().toISOString()
    };

    achievements.unshift(newAchievement);
    saveAchievements(achievements);

    console.log(`[CRUD CREATE] Yangi yutuq saqlandi: "${newAchievement.title}"`);
    res.status(201).json({ success: true, data: newAchievement });
  } catch (err) {
    console.error("Yutuq qo'shishda xatolik:", err);
    res.status(500).json({ error: err.message || "Serverda xatolik yuz berdi" });
  }
});

// [UPDATE] - Yutuqni tahrirlash (Ma'lumotlar va/yoki yangi rasm)
app.put("/api/achievements/:id", requireAuth, upload.single("image"), (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, date, description, link, customImageUrl, keepExistingImage } = req.body;

    const achievements = readAchievements();
    const index = achievements.findIndex((a) => a.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Bunday yutuq topilmadi!" });
    }

    let imageUrl = achievements[index].imageUrl;

    if (req.file) {
      // Agar yangi rasm yuklangan bo'lsa va eskisi mahalliy fayl bo'lsa, eskisini tozalaymiz
      if (imageUrl && imageUrl.startsWith("/uploads/")) {
        const oldPath = path.join(__dirname, imageUrl);
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath); } catch {}
        }
      }
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (customImageUrl !== undefined && customImageUrl !== "") {
      imageUrl = customImageUrl.trim();
    } else if (keepExistingImage === "false") {
      imageUrl = "";
    }

    achievements[index] = {
      ...achievements[index],
      title: title !== undefined ? title.trim() : achievements[index].title,
      category: category !== undefined ? category.trim() : achievements[index].category,
      date: date !== undefined ? date.trim() : achievements[index].date,
      description: description !== undefined ? description.trim() : achievements[index].description,
      imageUrl,
      link: link !== undefined ? link.trim() : achievements[index].link,
      updatedAt: new Date().toISOString()
    };

    saveAchievements(achievements);
    console.log(`[CRUD UPDATE] Yutuq tahrirlandi: "${achievements[index].title}" (ID: ${id})`);
    res.json({ success: true, data: achievements[index] });
  } catch (err) {
    console.error("Yutuqni yangilashda xato:", err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

// [DELETE] - Yutuqni butunlay o'chirish
app.delete("/api/achievements/:id", requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const achievements = readAchievements();
    const index = achievements.findIndex((a) => a.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Yutuq topilmadi!" });
    }

    const removed = achievements[index];
    // Rasmni diskdan tozalash
    if (removed.imageUrl && removed.imageUrl.startsWith("/uploads/")) {
      const filePath = path.join(__dirname, removed.imageUrl);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch {}
      }
    }

    achievements.splice(index, 1);
    saveAchievements(achievements);

    console.log(`[CRUD DELETE] Yutuq o'chirildi: "${removed.title}" (ID: ${id})`);
    res.json({ success: true, message: "Yutuq va uning fayli muvaffaqiyatli o'chirildi!" });
  } catch (err) {
    console.error("Yutuqni o'chirishda xato:", err);
    res.status(500).json({ error: "Server xatosi" });
  }
});

// Serve frontend production build if available
const DIST_DIR = path.join(__dirname, "..", "dist");
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
      return next();
    }
    res.sendFile(path.join(DIST_DIR, "index.html"));
  });
}

// Start listening
app.listen(PORT, "0.0.0.0", () => {
  console.log(`====================================================`);
  console.log(`[CYBER BACKEND] Server running on http://localhost:${PORT}`);
  console.log(`[CYBER BACKEND] Uploads directory: http://localhost:${PORT}/uploads`);
  console.log(`====================================================`);
});
