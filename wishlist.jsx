import { useState, useEffect } from "react";

const STORAGE_KEY = "wifey-wishlist";

const CATEGORIES = [
  { label: "👗 ملابس وأكسسوارات", value: "fashion" },
  { label: "💄 جمال وعناية", value: "beauty" },
  { label: "🌸 تجارب وأماكن", value: "experience" },
  { label: "🏠 المنزل", value: "home" },
  { label: "📚 كتب وترفيه", value: "books" },
  { label: "✨ أخرى", value: "other" },
];

const PRIORITY_COLORS = {
  high: { bg: "#FFE4E8", text: "#C1526A", dot: "#E8748A", label: "أتمناه كثيراً 💕" },
  medium: { bg: "#FFF0F5", text: "#A0607A", dot: "#D4A0B4", label: "أتمناه" },
  low: { bg: "#FDF6F9", text: "#B8909F", dot: "#E0C4D0", label: "يوماً ما ✨" },
};

function HeartIcon({ filled, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#E8748A" : "none"} stroke="#E8748A" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#E8B4C4" stroke="#D4849C" strokeWidth="1.5">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

export default function WishList() {
  const [wishes, setWishes] = useState([]);
  const [view, setView] = useState("list"); // "list" | "add"
  const [form, setForm] = useState({ title: "", note: "", category: "other", priority: "medium", link: "" });
  const [filter, setFilter] = useState("all");
  const [celebrateId, setCelebrateId] = useState(null);
  const [deleted, setDeleted] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setWishes(JSON.parse(saved));
    } catch {}
  }, []);

  const save = (list) => {
    setWishes(list);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
  };

  const addWish = () => {
    if (!form.title.trim()) return;
    const newWish = { id: Date.now(), ...form, done: false, createdAt: new Date().toLocaleDateString("ar-SA") };
    save([newWish, ...wishes]);
    setForm({ title: "", note: "", category: "other", priority: "medium", link: "" });
    setView("list");
  };

  const toggleDone = (id) => {
    const updated = wishes.map(w => w.id === id ? { ...w, done: !w.done } : w);
    save(updated);
    if (!wishes.find(w => w.id === id)?.done) {
      setCelebrateId(id);
      setTimeout(() => setCelebrateId(null), 1500);
    }
  };

  const deleteWish = (id) => {
    const wish = wishes.find(w => w.id === id);
    setDeleted(wish);
    save(wishes.filter(w => w.id !== id));
    setTimeout(() => setDeleted(null), 3000);
  };

  const undoDelete = () => {
    if (deleted) { save([deleted, ...wishes]); setDeleted(null); }
  };

  const filtered = filter === "all" ? wishes : filter === "done" ? wishes.filter(w => w.done) : wishes.filter(w => !w.done && w.category === filter);
  const pending = wishes.filter(w => !w.done).length;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #FFF5F8 0%, #FDF0F5 50%, #FFF8F0 100%)", fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif", direction: "rtl" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #F9D0DE 0%, #F4B8CC 50%, #F9D4C2 100%)", padding: "28px 20px 20px", textAlign: "center", position: "relative", boxShadow: "0 4px 20px #F4B8CC55" }}>
        <div style={{ fontSize: 13, color: "#C1526A", letterSpacing: 2, marginBottom: 4, opacity: 0.8 }}>✦ قائمة أمنياتي ✦</div>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#8B2E4A", textShadow: "0 1px 3px #F9D0DE" }}>أحلامي الصغيرة 🌸</h1>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: "#A05070", opacity: 0.85 }}>كل أمنية تستحق أن تُحقَّق 💕</p>
        {pending > 0 && (
          <div style={{ marginTop: 10, display: "inline-block", background: "rgba(255,255,255,0.5)", borderRadius: 20, padding: "4px 14px", fontSize: 12, color: "#8B2E4A" }}>
            {pending} أمنية تنتظر ✨
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", justifyContent: "center", gap: 10, padding: "16px 20px 8px" }}>
        <button onClick={() => setView("list")} style={{ flex: 1, maxWidth: 160, padding: "10px 0", borderRadius: 25, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14, background: view === "list" ? "linear-gradient(135deg, #F4899E, #E8748A)" : "white", color: view === "list" ? "white" : "#C1526A", boxShadow: view === "list" ? "0 4px 14px #F4899E66" : "0 2px 8px #F4B8CC33", transition: "all 0.25s" }}>
          🌸 قائمتي
        </button>
        <button onClick={() => setView("add")} style={{ flex: 1, maxWidth: 160, padding: "10px 0", borderRadius: 25, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14, background: view === "add" ? "linear-gradient(135deg, #F4899E, #E8748A)" : "white", color: view === "add" ? "white" : "#C1526A", boxShadow: view === "add" ? "0 4px 14px #F4899E66" : "0 2px 8px #F4B8CC33", transition: "all 0.25s" }}>
          ✨ أضيف أمنية
        </button>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "8px 16px 80px" }}>

        {/* ADD FORM */}
        {view === "add" && (
          <div style={{ background: "white", borderRadius: 20, padding: 22, boxShadow: "0 4px 24px #F4B8CC33", border: "1px solid #F9D0DE" }}>
            <h2 style={{ margin: "0 0 18px", color: "#8B2E4A", fontSize: 17, textAlign: "center" }}>💝 أمنية جديدة</h2>

            <label style={labelStyle}>اسم الأمنية *</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="مثلاً: عطر Rose de Mai من Chanel..." style={inputStyle} />

            <label style={labelStyle}>ملاحظة أو تفاصيل</label>
            <textarea value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} placeholder="أي تفاصيل إضافية، مقاس، لون..." rows={3} style={{ ...inputStyle, resize: "vertical", minHeight: 72 }} />

            <label style={labelStyle}>رابط (اختياري)</label>
            <input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="https://..." style={{ ...inputStyle, direction: "ltr", textAlign: "left" }} />

            <label style={labelStyle}>الفئة</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>

            <label style={labelStyle}>الأولوية</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
              {Object.entries(PRIORITY_COLORS).map(([key, val]) => (
                <button key={key} onClick={() => setForm({ ...form, priority: key })} style={{ flex: 1, padding: "8px 4px", borderRadius: 12, border: form.priority === key ? `2px solid ${val.text}` : "2px solid transparent", background: form.priority === key ? val.bg : "#FDF6F9", color: val.text, fontSize: 11, cursor: "pointer", fontWeight: 600, transition: "all 0.2s" }}>
                  {val.label}
                </button>
              ))}
            </div>

            <button onClick={addWish} disabled={!form.title.trim()} style={{ width: "100%", padding: "13px 0", borderRadius: 25, border: "none", cursor: form.title.trim() ? "pointer" : "not-allowed", background: form.title.trim() ? "linear-gradient(135deg, #F4899E, #E8748A)" : "#F0D4DC", color: "white", fontWeight: 700, fontSize: 15, boxShadow: form.title.trim() ? "0 4px 16px #F4899E55" : "none", transition: "all 0.25s" }}>
              إضافة الأمنية 🌸
            </button>
          </div>
        )}

        {/* LIST VIEW */}
        {view === "list" && (
          <>
            {/* Filter bar */}
            {wishes.length > 0 && (
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 8, scrollbarWidth: "none" }}>
                {["all", "done", ...CATEGORIES.map(c => c.value)].map(f => {
                  const labels = { all: "الكل 🌸", done: "تحققت 💕", ...Object.fromEntries(CATEGORIES.map(c => [c.value, c.label])) };
                  const count = f === "all" ? wishes.length : f === "done" ? wishes.filter(w => w.done).length : wishes.filter(w => w.category === f).length;
                  if (count === 0 && f !== "all") return null;
                  return (
                    <button key={f} onClick={() => setFilter(f)} style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, background: filter === f ? "#F4899E" : "white", color: filter === f ? "white" : "#A05070", fontWeight: filter === f ? 700 : 400, boxShadow: "0 2px 8px #F4B8CC22", transition: "all 0.2s" }}>
                      {labels[f]} {count > 0 && <span style={{ opacity: 0.75 }}>({count})</span>}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Empty state */}
            {wishes.length === 0 && (
              <div style={{ textAlign: "center", padding: "50px 20px", color: "#C090A8" }}>
                <div style={{ fontSize: 52, marginBottom: 12 }}>🌸</div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, color: "#A05070" }}>لا توجد أمنيات بعد</div>
                <div style={{ fontSize: 13, opacity: 0.7 }}>اضغطي على "أضيف أمنية" وابدئي!</div>
              </div>
            )}

            {/* Wish cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filtered.map(wish => {
                const p = PRIORITY_COLORS[wish.priority];
                const cat = CATEGORIES.find(c => c.value === wish.category);
                return (
                  <div key={wish.id} style={{ background: wish.done ? "#F9F4F6" : "white", borderRadius: 18, padding: "16px 18px", boxShadow: celebrateId === wish.id ? "0 0 0 3px #F4899E66, 0 4px 20px #F4B8CC44" : "0 3px 14px #F4B8CC22", border: `1px solid ${wish.done ? "#EDD8E4" : p.bg}`, transition: "all 0.3s", opacity: wish.done ? 0.75 : 1, transform: celebrateId === wish.id ? "scale(1.02)" : "scale(1)" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      {/* Checkbox */}
                      <button onClick={() => toggleDone(wish.id)} style={{ flexShrink: 0, marginTop: 2, background: "none", border: "none", cursor: "pointer", padding: 0, transition: "transform 0.2s" }}>
                        <HeartIcon filled={wish.done} size={22} />
                      </button>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
                          <span style={{ fontWeight: 700, fontSize: 15, color: wish.done ? "#B090A0" : "#6B1E34", textDecoration: wish.done ? "line-through" : "none" }}>{wish.title}</span>
                          {wish.done && <span style={{ fontSize: 12, color: "#E8748A" }}>تحققت! 🎉</span>}
                        </div>
                        {wish.note && <p style={{ margin: "0 0 6px", fontSize: 13, color: "#A07088", lineHeight: 1.5 }}>{wish.note}</p>}
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                          <span style={{ fontSize: 11, background: p.bg, color: p.text, borderRadius: 8, padding: "2px 8px", fontWeight: 600 }}>{p.label}</span>
                          <span style={{ fontSize: 11, background: "#FDF0F5", color: "#B080A0", borderRadius: 8, padding: "2px 8px" }}>{cat?.label}</span>
                          <span style={{ fontSize: 11, color: "#C8A0B8", marginRight: "auto" }}>{wish.createdAt}</span>
                        </div>
                        {wish.link && (
                          <a href={wish.link} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 6, fontSize: 12, color: "#E8748A", textDecoration: "none" }}>
                            🔗 مشاهدة الرابط
                          </a>
                        )}
                      </div>
                      <button onClick={() => deleteWish(wish.id)} style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", color: "#D4A0B4", fontSize: 16, padding: "2px 4px", opacity: 0.5, transition: "opacity 0.2s" }}
                        onMouseOver={e => e.currentTarget.style.opacity = 1}
                        onMouseOut={e => e.currentTarget.style.opacity = 0.5}>
                        ×
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Undo delete toast */}
      {deleted && (
        <div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", background: "#4A1A2E", color: "white", borderRadius: 25, padding: "12px 20px", display: "flex", gap: 14, alignItems: "center", fontSize: 13, boxShadow: "0 4px 20px #00000033", zIndex: 100, whiteSpace: "nowrap" }}>
          <span>تم حذف "{deleted.title}"</span>
          <button onClick={undoDelete} style={{ background: "#E8748A", color: "white", border: "none", borderRadius: 15, padding: "4px 14px", cursor: "pointer", fontWeight: 700, fontSize: 12 }}>تراجع</button>
        </div>
      )}

      {/* Progress bar */}
      {wishes.length > 0 && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", borderTop: "1px solid #F9D0DE", padding: "10px 20px 12px", textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "#A05070", marginBottom: 5 }}>
            <SparkleIcon /> {wishes.filter(w => w.done).length} من {wishes.length} أمنية تحققت
          </div>
          <div style={{ height: 6, background: "#F9D0DE", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${wishes.length ? (wishes.filter(w => w.done).length / wishes.length) * 100 : 0}%`, background: "linear-gradient(90deg, #F4899E, #E8748A)", borderRadius: 10, transition: "width 0.5s ease" }} />
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "10px 12px", borderRadius: 12, border: "1.5px solid #F4C8D8",
  fontSize: 14, color: "#4A1A2E", background: "#FFF8FA", outline: "none",
  marginBottom: 14, boxSizing: "border-box", fontFamily: "inherit", direction: "rtl"
};

const labelStyle = {
  display: "block", fontSize: 13, fontWeight: 600, color: "#8B4060", marginBottom: 6
};
