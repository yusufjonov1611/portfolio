import React, { useState, useEffect, useRef } from "react";
import { Lock, Unlock, Plus, Trash2, Edit, X, Upload, Check, AlertCircle, LogOut, KeyRound, Image as ImageIcon, ExternalLink, RefreshCw, User } from "lucide-react";
import { soundFX } from "../utils/audio";
import confetti from "canvas-confetti";

export default function AdminPanel({ isOpen, onClose, onDataUpdated, onAuthChange }) {
  const [token, setToken] = useState(() => localStorage.getItem("cyber_admin_token") || "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  // Tab: 'list' | 'add' | 'settings'
  const [activeTab, setActiveTab] = useState("list");

  // Achievements state
  const [achievements, setAchievements] = useState([]);

  // CREATE form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("CTF & LABS");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 7));
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [formMsg, setFormMsg] = useState({ text: "", type: "" });

  // UPDATE (Edit) state
  const [editingItem, setEditingItem] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLink, setEditLink] = useState("");
  const [editFile, setEditFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState("");
  const [editMsg, setEditMsg] = useState({ text: "", type: "" });

  // Settings state
  const [currentPass, setCurrentPass] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPass, setNewPass] = useState("");
  const [settingsMsg, setSettingsMsg] = useState({ text: "", type: "" });

  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  useEffect(() => {
    if (token) {
      loadAchievements();
      if (onAuthChange) onAuthChange(true);
    } else {
      if (onAuthChange) onAuthChange(false);
    }
  }, [token]);

  const loadAchievements = async () => {
    try {
      const res = await fetch("/api/achievements");
      if (res.ok) {
        const data = await res.json();
        setAchievements(data);
      }
    } catch (err) {
      console.error("Yutuqlarni yuklashda xato:", err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);
    soundFX.playCyberPulse();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim()
        })
      });

      const data = await res.json();

      if (res.ok && data.token) {
        setToken(data.token);
        localStorage.setItem("cyber_admin_token", data.token);
        soundFX.playSuccess();
        setUsername("");
        setPassword("");
        if (onAuthChange) onAuthChange(true);
        loadAchievements();
        setActiveTab("list");
      } else {
        setLoginError(data.error || "Login yoki parol noto'g'ri!");
        soundFX.playAlert();
      }
    } catch (err) {
      setLoginError("Serverga ulanib bo'lmadi. Backend server ishlayotganini tekshiring.");
      soundFX.playAlert();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("cyber_admin_token");
    if (onAuthChange) onAuthChange(false);
    soundFX.playClick();
  };

  // --- CREATE ---
  const handleCreateFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      soundFX.playClick();
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setFormMsg({ text: "", type: "" });

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("date", date);
      formData.append("description", description);
      formData.append("link", link);
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const res = await fetch("/api/achievements", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        setFormMsg({ text: "Yutuq muvaffaqiyatli qo'shildi va saytda aks etdi!", type: "success" });
        soundFX.playSuccess();
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });

        // Reset
        setTitle("");
        setDescription("");
        setLink("");
        setSelectedFile(null);
        setImagePreview("");
        if (fileInputRef.current) fileInputRef.current.value = "";

        loadAchievements();
        if (onDataUpdated) onDataUpdated();
        setTimeout(() => setActiveTab("list"), 1200);
      } else {
        setFormMsg({ text: data.error || "Xatolik yuz berdi", type: "error" });
        soundFX.playAlert();
      }
    } catch (err) {
      setFormMsg({ text: "Server bilan bog'lanishda xato", type: "error" });
      soundFX.playAlert();
    } finally {
      setLoading(false);
    }
  };

  // --- UPDATE (EDIT) ---
  const startEdit = (item) => {
    setEditingItem(item);
    setEditTitle(item.title || "");
    setEditCategory(item.category || "CTF & LABS");
    setEditDate(item.date || "");
    setEditDescription(item.description || "");
    setEditLink(item.link || "");
    setEditFile(null);
    setEditImagePreview(item.imageUrl || "");
    setEditMsg({ text: "", type: "" });
    soundFX.playClick();
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditFile(file);
      const reader = new FileReader();
      reader.onload = () => setEditImagePreview(reader.result);
      reader.readAsDataURL(file);
      soundFX.playClick();
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingItem || !editTitle.trim()) return;

    setLoading(true);
    setEditMsg({ text: "", type: "" });

    try {
      const formData = new FormData();
      formData.append("title", editTitle);
      formData.append("category", editCategory);
      formData.append("date", editDate);
      formData.append("description", editDescription);
      formData.append("link", editLink);
      if (editFile) {
        formData.append("image", editFile);
      }

      const res = await fetch(`/api/achievements/${editingItem.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        setEditMsg({ text: "Yutuq muvaffaqiyatli yangilandi!", type: "success" });
        soundFX.playSuccess();
        loadAchievements();
        if (onDataUpdated) onDataUpdated();
        setTimeout(() => {
          setEditingItem(null);
        }, 1000);
      } else {
        setEditMsg({ text: data.error || "Yangilashda xato", type: "error" });
        soundFX.playAlert();
      }
    } catch (err) {
      setEditMsg({ text: "Server bilan bog'lanishda xato", type: "error" });
      soundFX.playAlert();
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE ---
  const handleDelete = async (id, title) => {
    if (!window.confirm(`"${title}" yutug'ini haqiqatan ham o'chirmoqchimisiz?`)) return;

    try {
      const res = await fetch(`/api/achievements/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        soundFX.playClick();
        loadAchievements();
        if (onDataUpdated) onDataUpdated();
      } else {
        alert("O'chirishda xatolik yuz berdi");
      }
    } catch (err) {
      alert("Server xatosi");
    }
  };

  // --- SETTINGS (Change username & password) ---
  const handleSettingsUpdate = async (e) => {
    e.preventDefault();
    setSettingsMsg({ text: "", type: "" });

    try {
      const res = await fetch("/api/change-credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: currentPass,
          newUsername: newUsername,
          newPassword: newPass
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSettingsMsg({ text: "Kirish ma'lumotlari muvaffaqiyatli yangilandi!", type: "success" });
        soundFX.playSuccess();
        setCurrentPass("");
        setNewUsername("");
        setNewPass("");
      } else {
        setSettingsMsg({ text: data.error || "Xatolik yuz berdi", type: "error" });
        soundFX.playAlert();
      }
    } catch (err) {
      setSettingsMsg({ text: "Server xatosi", type: "error" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-[#0b0d14] border border-emerald-500/40 rounded-xl w-full max-w-4xl max-h-[92vh] overflow-y-auto font-mono text-xs shadow-2xl">
        {/* Header Bar */}
        <div className="bg-[#121520] px-5 py-3 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold">
            <Lock className="w-4 h-4" />
            <span>UWP ADMIN // ACHIEVEMENTS CRUD CMS</span>
          </div>
          <div className="flex items-center space-x-2">
            {token && (
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-400 flex items-center space-x-1 px-2.5 py-1 rounded bg-[#181d2a] hover:bg-red-500/10 transition text-[11px]"
                title="Tizimdan chiqish"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Chiqish</span>
              </button>
            )}
            <button
              onClick={() => {
                onClose();
                soundFX.playClick();
              }}
              className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Not Logged In: Username & Password Login */}
        {!token ? (
          <div className="p-8 max-w-sm mx-auto text-center space-y-5">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <KeyRound className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white tracking-wider">ADMIN AUTENTIFIKATSIYASI</h3>
              <p className="text-gray-400 text-xs mt-1">
                Yutuqlaringizni boshqarish (CRUD) uchun login va parolni kiriting.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3.5 text-left">
              <div>
                <label className="block text-gray-400 text-[11px] mb-1 font-bold">LOGIN (USERNAME):</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="Login..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#131724] border border-gray-800 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 text-xs"
                  />
                  <User className="w-4 h-4 text-gray-500 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-[11px] mb-1 font-bold">PAROL (PASSWORD):</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="Parol..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#131724] border border-gray-800 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 text-xs"
                  />
                  <Lock className="w-4 h-4 text-gray-500 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              {loginError && (
                <div className="text-red-400 text-xs flex items-center space-x-1.5 bg-red-950/20 p-2 rounded border border-red-500/30">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20"
              >
                <Unlock className="w-4 h-4" />
                <span>{loading ? "TEKSHIRILMOQDA..." : "PANELGA KIRISH"}</span>
              </button>
            </form>
          </div>
        ) : (
          /* Logged In Dashboard with CRUD */
          <div>
            {/* Nav Tabs */}
            <div className="flex border-b border-gray-800 bg-[#0e111a] px-5 pt-2 space-x-4">
              <button
                onClick={() => {
                  setActiveTab("list");
                  setEditingItem(null);
                  soundFX.playClick();
                }}
                className={`pb-2.5 px-2 font-bold flex items-center space-x-1.5 border-b-2 transition ${
                  activeTab === "list" && !editingItem
                    ? "border-emerald-400 text-emerald-300"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <span>Barcha Yutuqlar (CRUD: {achievements.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("add");
                  setEditingItem(null);
                  soundFX.playClick();
                }}
                className={`pb-2.5 px-2 font-bold flex items-center space-x-1.5 border-b-2 transition ${
                  activeTab === "add" && !editingItem
                    ? "border-emerald-400 text-emerald-300"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Yangi Yutuq Qo'shish</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("settings");
                  setEditingItem(null);
                  soundFX.playClick();
                }}
                className={`pb-2.5 px-2 font-bold flex items-center space-x-1.5 border-b-2 transition ${
                  activeTab === "settings"
                    ? "border-emerald-400 text-emerald-300"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Login & Parolni O'zgartirish</span>
              </button>
            </div>

            {/* TAB 1: LIST / MANAGE (READ, UPDATE, DELETE) */}
            {activeTab === "list" && !editingItem && (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-gray-400 text-xs">
                    Jami saqlangan yutuqlar: <span className="text-emerald-400 font-bold">{achievements.length}</span> ta
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab("add");
                      soundFX.playClick();
                    }}
                    className="px-3 py-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center space-x-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Yangi Qo'shish</span>
                  </button>
                </div>

                {achievements.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 bg-[#0e111a] rounded-xl border border-gray-800">
                    Hozircha hech qanday yutuq saqlanmagan. "Yangi Yutuq Qo'shish" tugmasini bosing!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {achievements.map((item) => (
                      <div
                        key={item.id}
                        className="bg-[#121622] border border-gray-800 hover:border-gray-700 p-4 rounded-xl flex items-center justify-between gap-4 transition"
                      >
                        <div className="flex items-center space-x-3.5 overflow-hidden">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-16 h-16 rounded-lg object-cover border border-gray-700 shrink-0"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-[#181d2a] border border-gray-700 flex items-center justify-center text-gray-600 shrink-0">
                              <ImageIcon className="w-6 h-6" />
                            </div>
                          )}
                          <div className="overflow-hidden">
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] text-yellow-400 font-bold bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">
                                {item.category}
                              </span>
                              <span className="text-gray-500 text-[10px]">{item.date}</span>
                            </div>
                            <div className="text-white font-bold text-sm truncate mt-1">
                              {item.title}
                            </div>
                            <div className="text-gray-400 text-xs truncate mt-0.5 max-w-lg">
                              {item.description || "Tavsif kiritilmagan"}
                            </div>
                          </div>
                        </div>

                        {/* Action buttons: EDIT & DELETE */}
                        <div className="flex items-center space-x-2 shrink-0">
                          {item.link && (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded transition"
                              title="Havolani ochish"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            onClick={() => startEdit(item)}
                            className="p-2 text-yellow-400 hover:bg-yellow-500/10 rounded border border-yellow-500/20 transition flex items-center space-x-1"
                            title="Tahrirlash (Update)"
                          >
                            <Edit className="w-4 h-4" />
                            <span className="hidden md:inline text-[10px]">Tahrirlash</span>
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.title)}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded border border-red-500/20 transition flex items-center space-x-1"
                            title="O'chirish (Delete)"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden md:inline text-[10px]">O'chirish</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: EDIT FORM (UPDATE) */}
            {editingItem && (
              <form onSubmit={handleUpdate} className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                  <div className="text-yellow-400 font-bold flex items-center space-x-2">
                    <Edit className="w-4 h-4" />
                    <span>YUTUQNI TAHRIRLASH (UPDATE): "{editingItem.title}"</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="text-gray-400 hover:text-white px-3 py-1 rounded bg-gray-800"
                  >
                    Bekor qilish
                  </button>
                </div>

                {editMsg.text && (
                  <div
                    className={`p-3 rounded-lg border text-xs flex items-center space-x-2 ${
                      editMsg.type === "success"
                        ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                        : "bg-red-950/40 border-red-500/40 text-red-300"
                    }`}
                  >
                    {editMsg.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span>{editMsg.text}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1 font-bold">// SARLAVHA (TITLE)*:</label>
                    <input
                      type="text"
                      required
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-[#131722] border border-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 font-bold">// KATEGORIYA:</label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full bg-[#131722] border border-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                    >
                      <option value="CTF & LABS">CTF & Laboratoriyalar</option>
                      <option value="MUSOBAQA">Musobaqa & Hackathon</option>
                      <option value="SERTIFIKAT">Sertifikat & Kurs</option>
                      <option value="ZAIFLIK HISOBOTI">Zaiflik hisoboti / Bug</option>
                      <option value="LOYIHA">Dasturiy Loyiha</option>
                      <option value="BOSHQA YUTUQ">Boshqa Yutuq</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1 font-bold">// SANA (YYYY-MM):</label>
                    <input
                      type="text"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="w-full bg-[#131722] border border-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 font-bold">// ISBOT / HAVOLA (URL):</label>
                    <input
                      type="url"
                      value={editLink}
                      onChange={(e) => setEditLink(e.target.value)}
                      className="w-full bg-[#131722] border border-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                </div>

                {/* Edit Image Upload */}
                <div>
                  <label className="block text-gray-400 mb-1 font-bold">// RASMNI ALMASHTIRISH (IXTIYORIY):</label>
                  <div
                    onClick={() => editFileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-800 hover:border-yellow-500/50 rounded-xl p-4 text-center cursor-pointer bg-[#0e111a] transition"
                  >
                    <input
                      ref={editFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleEditFileChange}
                      className="hidden"
                    />
                    {editImagePreview ? (
                      <div className="space-y-2">
                        <img
                          src={editImagePreview}
                          alt="Tanlangan rasm"
                          className="max-h-40 mx-auto rounded border border-gray-700 object-contain"
                        />
                        <div className="text-[11px] text-yellow-400">
                          {editFile ? `Yangi rasm tanlandi: ${editFile.name}` : "Joriy rasm. Boshqasiga almashtirish uchun bosing."}
                        </div>
                      </div>
                    ) : (
                      <div className="py-4 space-y-1">
                        <Upload className="w-8 h-8 text-gray-500 mx-auto" />
                        <div className="text-gray-300 font-bold">Yangi rasm tanlash uchun bosing</div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 font-bold">// TAVSIF:</label>
                  <textarea
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full bg-[#131722] border border-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:border-yellow-500 resize-none"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 rounded bg-gray-800 text-gray-300 hover:text-white"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 rounded bg-yellow-500 hover:bg-yellow-400 text-black font-bold flex items-center space-x-1.5 shadow-lg shadow-yellow-500/20"
                  >
                    <Check className="w-4 h-4" />
                    <span>{loading ? "SAQLANMOQDA..." : "O'ZGARISHLARNI SAQLASH"}</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: CREATE ACHIEVEMENT */}
            {activeTab === "add" && !editingItem && (
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                {formMsg.text && (
                  <div
                    className={`p-3 rounded-lg border font-mono text-xs flex items-center space-x-2 ${
                      formMsg.type === "success"
                        ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                        : "bg-red-950/40 border-red-500/40 text-red-300"
                    }`}
                  >
                    {formMsg.type === "success" ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                    <span>{formMsg.text}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1 font-bold">
                      // YUTUQ SARLAVHASI (TITLE)*:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Masalan: HackTheBox Top 10% yoki CTF 1-o'rin"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-[#131722] border border-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 font-bold">
                      // KATEGORIYA:
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#131722] border border-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="CTF & LABS">CTF & Laboratoriyalar</option>
                      <option value="MUSOBAQA">Musobaqa & Hackathon</option>
                      <option value="SERTIFIKAT">Sertifikat & Kurs</option>
                      <option value="ZAIFLIK HISOBOTI">Zaiflik hisoboti / Bug</option>
                      <option value="LOYIHA">Dasturiy Loyiha</option>
                      <option value="BOSHQA YUTUQ">Boshqa Yutuq</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-1 font-bold">
                      // SANA (YYYY-MM):
                    </label>
                    <input
                      type="text"
                      placeholder="2024-10"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-[#131722] border border-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 font-bold">
                      // ISBOT YOKI HAVOLA (URL):
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      className="w-full bg-[#131722] border border-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Image Upload Area */}
                <div>
                  <label className="block text-gray-400 mb-1 font-bold">
                    // YUTUQ RASMI YOKI SERTIFIKAT SKRINSHOTT:
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-800 hover:border-emerald-500/50 rounded-xl p-4 text-center cursor-pointer bg-[#0e111a] transition"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleCreateFileChange}
                      className="hidden"
                    />
                    {imagePreview ? (
                      <div className="space-y-2">
                        <img
                          src={imagePreview}
                          alt="Tanlangan rasm"
                          className="max-h-48 mx-auto rounded border border-gray-700 object-contain"
                        />
                        <div className="text-[11px] text-emerald-400">
                          Rasm tanlandi: {selectedFile?.name}. Boshqasini tanlash uchun bosing.
                        </div>
                      </div>
                    ) : (
                      <div className="py-4 space-y-1">
                        <Upload className="w-8 h-8 text-gray-500 mx-auto" />
                        <div className="text-gray-300 font-bold">Kompyuterdan rasm yuklash uchun bosing</div>
                        <div className="text-gray-600 text-[10px]">JPG, PNG, WEBP yoki GIF</div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 font-bold">
                    // BATAFSIL MA'LUMOT (TAVSIF):
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Bu yutuq haqida qisqacha yozing: qanday natija bo'ldi, nimalarni bajardingiz..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#131722] border border-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold flex items-center space-x-2 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{loading ? "SAQLANMOQDA..." : "YUTUQNI JOYLASHTIRISH (CREATE)"}</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: SETTINGS (Change username & password) */}
            {activeTab === "settings" && (
              <form onSubmit={handleSettingsUpdate} className="p-6 max-w-md space-y-4">
                <h4 className="text-sm font-bold text-white mb-2">ADMIN LOGIN VA PAROLINI O'ZGARTIRISH</h4>

                {settingsMsg.text && (
                  <div
                    className={`p-3 rounded-lg border text-xs flex items-center space-x-2 ${
                      settingsMsg.type === "success"
                        ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                        : "bg-red-950/40 border-red-500/40 text-red-300"
                    }`}
                  >
                    <span>{settingsMsg.text}</span>
                  </div>
                )}

                <div>
                  <label className="block text-gray-400 mb-1 font-bold">JORIY PAROL*:</label>
                  <input
                    type="password"
                    required
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    className="w-full bg-[#131722] border border-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 font-bold">YANGI LOGIN (USERNAME):</label>
                  <input
                    type="text"
                    placeholder="Masalan: shadow_admin"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full bg-[#131722] border border-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 font-bold">YANGI PAROL (PASSWORD):</label>
                  <input
                    type="password"
                    placeholder="Kamida 4 belgi..."
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full bg-[#131722] border border-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold"
                >
                  MA'LUMOTLARNI SAQLASH
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
