import React, { useState, useMemo, useEffect } from "react";
import { ShoppingBag, X, Plus, Minus, Search, Menu, ChevronLeft, ChevronRight, Heart, Check, ChevronDown, Lock, Trash2, Package, Settings } from "lucide-react";
import { supabase } from "./supabaseClient";
import { BrowserRouter, Routes, Route, useNavigate, useLocation, useParams } from "react-router-dom";
import v1 from "./assets/v1.jfif";
import v2 from "./assets/v2.jfif";
import v3 from "./assets/v3.jfif";

// ⚠️ تنبيه أمني: هذا الكود يعمل في الفرونت-إند (client-side)، أي شخص يفتح "View Source"
// أو أدوات المطوّر (DevTools) يقدر يشوف هذا الرمز بسهولة. هذا لا يوفّر حماية حقيقية.
// الحماية الفعلية للوحة التحكم لازم تكون عبر Supabase Auth (تسجيل دخول حقيقي)
// + قواعد Row Level Security (RLS) في Supabase تمنع أي عملية كتابة/حذف على
// جداول products و orders إلا من مستخدم مصرّح له. هذا الرمز هنا هو فقط
// طبقة حماية بسيطة تمنع "التصفح العرضي" وليس حماية أمنية حقيقية.
const ADMIN_PASSCODE = "230615"; // غيّريه لأي رمز تحبينه

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,450;0,9..144,600;1,9..144,450&family=Jost:wght@300;400;500;600&display=swap');
`;

const COLORS = {
  ink: "#382615",
  ivory: "#EFE8D6",
  taupe: "#DCD0B4",
  bronze: "#A47B3D",
  wine: "#5B2A32",
  mute: "#7A6E5A",
};

const CATEGORIES = [

];

const DEFAULT_PRODUCTS = [
];

const WILAYAS = [
  { name: "أدرار", domicile: 1400, stopdesk: 900, cancel: 200 },
  { name: "الشلف", domicile: 850, stopdesk: 450, cancel: 150 },
  { name: "الأغواط", domicile: 950, stopdesk: 550, cancel: 150 },
  { name: "أم البواقي", domicile: 850, stopdesk: 450, cancel: 150 },
  { name: "باتنة", domicile: 900, stopdesk: 450, cancel: 150 },
  { name: "بجاية", domicile: 800, stopdesk: 450, cancel: 150 },
  { name: "بسكرة", domicile: 950, stopdesk: 550, cancel: 150 },
  { name: "بشار", domicile: 1100, stopdesk: 650, cancel: 150 },
  { name: "البليدة", domicile: 600, stopdesk: 400, cancel: 150 },
  { name: "البويرة", domicile: 700, stopdesk: 450, cancel: 150 },
  { name: "تمنراست", domicile: 1600, stopdesk: 1050, cancel: 250 },
  { name: "تبسة", domicile: 900, stopdesk: 500, cancel: 150 },
  { name: "تلمسان", domicile: 900, stopdesk: 500, cancel: 150 },
  { name: "تيارت", domicile: 850, stopdesk: 450, cancel: 150 },
  { name: "تيزي وزو", domicile: 750, stopdesk: 450, cancel: 150 },
  { name: "الجزائر العاصمة", domicile: 500, stopdesk: 300, cancel: 150 },
  { name: "الجلفة", domicile: 950, stopdesk: 500, cancel: 150 },
  { name: "جيجل", domicile: 900, stopdesk: 450, cancel: 150 },
  { name: "سطيف", domicile: 800, stopdesk: 450, cancel: 150 },
  { name: "سعيدة", domicile: 900, stopdesk: 0, cancel: 150 },
  { name: "سكيكدة", domicile: 900, stopdesk: 450, cancel: 150 },
  { name: "سيدي بلعباس", domicile: 900, stopdesk: 450, cancel: 150 },
  { name: "عنابة", domicile: 850, stopdesk: 450, cancel: 150 },
  { name: "قالمة", domicile: 900, stopdesk: 450, cancel: 150 },
  { name: "قسنطينة", domicile: 800, stopdesk: 450, cancel: 150 },
  { name: "المدية", domicile: 800, stopdesk: 450, cancel: 150 },
  { name: "مستغانم", domicile: 900, stopdesk: 450, cancel: 150 },
  { name: "المسيلة", domicile: 850, stopdesk: 500, cancel: 150 },
  { name: "معسكر", domicile: 900, stopdesk: 450, cancel: 150 },
  { name: "ورقلة", domicile: 950, stopdesk: 600, cancel: 150 },
  { name: "وهران", domicile: 800, stopdesk: 450, cancel: 150 },
  { name: "البيض", domicile: 1100, stopdesk: 600, cancel: 150 },
  { name: "إليزي", domicile: 0, stopdesk: 0, cancel: 0 },
  { name: "برج بوعريريج", domicile: 800, stopdesk: 450, cancel: 150 },
  { name: "بومرداس", domicile: 700, stopdesk: 450, cancel: 150 },
  { name: "الطارف", domicile: 850, stopdesk: 450, cancel: 150 },
  { name: "تندوف", domicile: 0, stopdesk: 0, cancel: 0 },
  { name: "تيسمسيلت", domicile: 900, stopdesk: 0, cancel: 150 },
  { name: "الوادي", domicile: 950, stopdesk: 600, cancel: 150 },
  { name: "خنشلة", domicile: 900, stopdesk: 0, cancel: 150 },
  { name: "سوق أهراس", domicile: 900, stopdesk: 450, cancel: 150 },
  { name: "تيبازة", domicile: 700, stopdesk: 450, cancel: 150 },
  { name: "ميلة", domicile: 900, stopdesk: 450, cancel: 150 },
  { name: "عين الدفلى", domicile: 900, stopdesk: 450, cancel: 150 },
  { name: "النعامة", domicile: 1100, stopdesk: 600, cancel: 150 },
  { name: "عين تموشنت", domicile: 900, stopdesk: 450, cancel: 150 },
  { name: "غرداية", domicile: 950, stopdesk: 550, cancel: 150 },
  { name: "غليزان", domicile: 900, stopdesk: 450, cancel: 150 },
  { name: "تيميمون", domicile: 1400, stopdesk: 0, cancel: 200 },
  { name: "برج باجي مختار", domicile: 0, stopdesk: 0, cancel: 0 },
  { name: "أولاد جلال", domicile: 950, stopdesk: 550, cancel: 150 },
  { name: "بني عباس", domicile: 1100, stopdesk: 0, cancel: 150 },
  { name: "إن صالح", domicile: 1600, stopdesk: 0, cancel: 250 },
  { name: "إن قزام", domicile: 1600, stopdesk: 0, cancel: 250 },
  { name: "تقرت", domicile: 950, stopdesk: 600, cancel: 150 },
  { name: "جانت", domicile: 0, stopdesk: 0, cancel: 0 },
  { name: "المغير", domicile: 950, stopdesk: 0, cancel: 150 },
  { name: "المنيعة", domicile: 1000, stopdesk: 0, cancel: 150 },
];

function formatPrice(n) {
  return n.toLocaleString("ar-DZ") + " د.ج";
}

// يحوّل اسم المنتج إلى رابط (slug) صالح للاستخدام في الـ URL
// يدعم الحروف العربية والإنجليزية، ويستبدل المسافات والرموز بشرطة "-"
function slugify(str) {
  return String(str || "")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

// ---------- Routing helpers ----------
// خريطة تربط كل "صفحة" برابط (URL) حقيقي خاص فيها
const ROUTE_MAP = {
  home: "/",
  shop: "/shop",
  about: "/about",
  "customer-care": "/customer-care",
  shipping: "/shipping",
  returns: "/returns",
  faq: "/faq",
  contact: "/contact",
  admin: "/admin",
  checkout: "/checkout",
};

function pathToView(pathname) {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/product/")) return "product";
  const clean = pathname.replace(/^\//, "");
  return ROUTE_MAP[clean] !== undefined || clean === "" ? clean || "home" : clean;
}

// Hook يرجع دالة setView(viewId, param) تبني الرابط الصحيح وتنتقل إليه فعليًا
function useGoTo() {
  const navigate = useNavigate();
  return (view, param) => {
    if (view === "product") {
      navigate(param !== undefined ? `/product/${param}` : "/shop");
      return;
    }
    navigate(ROUTE_MAP[view] || "/");
  };
}

function Logo({ size = "text-2xl", dark }) {
  return (
<div
  className={`${size} whitespace-nowrap`}
  style={{
    fontFamily: "Fraunces, serif",
    letterSpacing: "0.08em",
    color: COLORS.bronze,
  }}
>
  AORA
</div>
  );
}

function TopBar({ view, setView, cartCount, setCartOpen, menuOpen, setMenuOpen }) {
  const nav = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
  ];
  return (
    <header className="sticky top-0 z-40 backdrop-blur border-b" style={{ backgroundColor: COLORS.ivory + "F2", borderColor: COLORS.taupe }}>
      <div className="max-w-6xl mx-auto px-5 md:px-8 flex items-center justify-between h-20">
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="القائمة">
          <Menu size={24} color={COLORS.ink} />
        </button>
        <button onClick={() => setView("home")}>
          <Logo />
        </button>
        <nav className="hidden md:flex gap-8" style={{ fontFamily: "Jost, sans-serif" }}>
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => setView(n.id)}
              className="text-sm tracking-wide pb-1 border-b-2 transition-colors"
              style={{
                color: view === n.id ? COLORS.ink : COLORS.mute,
                borderColor: view === n.id ? COLORS.bronze : "transparent",
              }}
            >
              {n.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Search size={20} color={COLORS.ink} className="hidden sm:block" />
          <button onClick={() => setCartOpen(true)} className="relative" aria-label="السلة">
            <ShoppingBag size={22} color={COLORS.ink} />
            {cartCount > 0 && (
              <span
                className="absolute -top-2 -left-2 text-[10px] w-5 h-5 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: COLORS.wine }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden flex flex-col px-5 pb-4 gap-3" style={{ fontFamily: "Jost, sans-serif" }}>
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => {
                setView(n.id);
                setMenuOpen(false);
              }}
              className="text-right text-sm py-1"
              style={{ color: view === n.id ? COLORS.bronze : COLORS.ink }}
            >
              {n.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

function Hero({ setView }) {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: COLORS.ink }}>
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-24 md:py-36 grid md:grid-cols-2 gap-10 items-center">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-6xl leading-tight mb-6" style={{ fontFamily: "Fraunces, serif", color: COLORS.ivory }}>
            Crafted For You <br />
          </h1>
          <p className="text-base md:text-lg mb-10 max-w-md" style={{ color: COLORS.taupe, fontFamily: "Jost, sans-serif", fontWeight: 300 }}>
            Every piece is thoughtfully crafted to express timeless elegance, refined quality, and effortless sophistication.
          </p>
        </div>
        <div className="relative block">
<video
  autoPlay
  loop
  muted
  playsInline
  className="w-full h-[520px] object-cover"
>
  <source src="/videos/hero.mp4" type="video/mp4" />
</video>
          <div className="absolute -bottom-6 -right-6 px-6 py-4" style={{ backgroundColor: COLORS.bronze }}>
            <p className="text-xs" style={{ fontFamily: "Jost, sans-serif", color: COLORS.ink }}> HERITAGE</p>
            <p className="text-lg" style={{ fontFamily: "Fraunces, serif", color: COLORS.ink }}>Since 2019</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ p, setView, addToCart }) {
  return (
    <div className="group">
      <button
        onClick={() => setView("product", slugify(p.name))}
        className="block w-full relative overflow-hidden mb-3"
        style={{ aspectRatio: "4/5" }}
      >
        <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <span
          className="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-hidden
        >
          <Heart size={15} color={COLORS.ink} />
        </span>
      </button>
      <div className="flex items-start justify-between gap-2">
        <div>
          <button
            onClick={() => setView("product", slugify(p.name))}
            className="text-sm text-right"
            style={{ fontFamily: "Jost, sans-serif", color: COLORS.ink }}
          >
            {p.name}
          </button>
          <p className="text-sm mt-1" style={{ color: COLORS.bronze, fontFamily: "Jost, sans-serif" }}>
            {formatPrice(p.price)}
          </p>
        </div>
 
      </div>
    </div>
  );
}

function Banner() {
  return (
    <section className="py-20 text-center px-5" style={{ backgroundColor: COLORS.taupe }}>
      <p className="text-xs tracking-[0.3em] mb-4" style={{ color: COLORS.wine, fontFamily: "Jost, sans-serif" }}>
        Limited Edition
      </p>
      <h3 className="text-2xl md:text-4xl max-w-2xl mx-auto" style={{ fontFamily: "Fraunces, serif", color: COLORS.ink }}>
        Each piece is thoughtfully crafted in limited quantities for those who appreciate timeless elegance and exceptional craftsmanship.
      </h3>
    </section>
  );
}

function Footer({ setView }) {
  return (
    <footer className="pt-16 pb-8 px-5 md:px-8" style={{ backgroundColor: COLORS.ink }}>
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-12 mb-12">
        <div>
          <Logo size="text-xl" dark />
          <p className="text-sm mt-4 leading-relaxed" style={{ color: COLORS.mute, fontFamily: "Jost, sans-serif", fontWeight: 300 }}>
            Each piece is thoughtfully crafted in limited quantities for those who appreciate timeless elegance and exceptional craftsmanship.
          </p>
        </div>
        {[
          { title: "Customer Care", items: ["Shipping & Delivery", "Returns & Exchanges", "FAQ", "Contact Us"] },
          { title: "Follow Us", items: ["Instagram", "Facebook", "TikTok"] },
        ].map((col) => (
          <div key={col.title} className="w-full flex flex-col items-center">
            {col.title === "Customer Care" ? (
              <button
                onClick={() => setView("customer-care")}
                className="text-sm mb-4"
                style={{ color: COLORS.bronze, fontFamily: "Jost, sans-serif" }}
              >
                {col.title}
              </button>
            ) : (
              <p className="text-sm mb-4" style={{ color: COLORS.bronze, fontFamily: "Jost, sans-serif" }}>
                {col.title}
              </p>
            )}
            <ul className="flex justify-center gap-6 mt-4">
              {col.items.map((it) => (
                <li key={it}>
  <a
  href={
  col.title === "Follow Us"
    ? it === "Instagram"
      ? "https://instagram.com/eabdou.bch"
      : it === "Facebook"
      ? "https://facebook.com/..."
      : "https://tiktok.com/@..."
    : "#"
}
    onClick={(e) => {
  if (col.title !== "Follow Us") {
    e.preventDefault();

    if (it === "Shipping & Delivery") {
      setView("shipping");
    } else if (it === "Returns & Exchanges") {
      setView("returns");
    } else if (it === "FAQ") {
      setView("faq");
    } else if (it === "Contact Us") {
      setView("contact");
    }
  }
}}
    target="_blank"
    rel="noopener noreferrer"
    className="text-sm hover:opacity-70 transition"
    style={{ color: COLORS.bronze }}
  >
    {col.title === "Follow Us" ? (
  it === "Instagram" ? (
    <i className="fab fa-instagram"></i>
  ) : it === "Facebook" ? (
    <i className="fab fa-facebook-f"></i>
  ) : (
    <i className="fab fa-tiktok"></i>
  )
) : (
  it
)}
  </a>
</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-6xl mx-auto pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-center" style={{ borderColor: "#3a352f", color: COLORS.mute, fontFamily: "Jost, sans-serif" }}>
        <span>© 2026 AORA. All rights reserved. Made by ABDERRAZAK BACHIR</span>
        <button onClick={() => setView("admin")} className="underline opacity-70 hover:opacity-100">
          لوحة تحكم المتجر
        </button>
      </div>
    </footer>
  );
}

function HomeView({ products, setView, setActiveCat, addToCart }) {
  return (
    <>
      <Hero setView={setView} />
      <Banner />
      <ShopView
        products={products}
        activeCat="all"
        setActiveCat={() => {}}
        setView={setView}
        addToCart={addToCart}
      />
    </>
  );
}

function ShopView({ products, activeCat, setActiveCat, setView, addToCart }) {
  const filtered = useMemo(() => (activeCat === "all" ? products : products.filter((p) => p.cat === activeCat)), [activeCat, products]);
  return (
    <section className="max-w-6xl mx-auto px-5 md:px-8 py-14">
      <h1 className="text-3xl md:text-4xl mb-8" style={{ textAlign: "center", fontFamily: "Fraunces, serif", color: COLORS.ink }}>
        Maison Aora
      </h1>
      <div className="flex justify-center gap-3 overflow-x-auto pb-6 mb-6 border-b" style={{ borderColor: COLORS.taupe }}>
        {[{ id: "shop", label: "shop" }, ...CATEGORIES].map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCat(c.id)}
            className="text-sm px-4 py-2 shrink-0 transition-colors"
            style={{
              fontFamily: "Jost, sans-serif",
              backgroundColor: activeCat === c.id ? COLORS.ink : "transparent",
              color: activeCat === c.id ? COLORS.ivory : COLORS.mute,
              border: `1px solid ${activeCat === c.id ? COLORS.ink : COLORS.taupe}`,
            }}
          >
            {c.label}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="text-sm py-16 text-center" style={{ color: COLORS.mute, fontFamily: "Jost, sans-serif" }}>
          لا توجد منتجات في هذه الفئة حاليًا
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
          {filtered.map((p) => (
            <ProductCard key={p.id} p={p} setView={setView} addToCart={addToCart} />
          ))}
        </div>
      )}
    </section>
  );
}

function ProductView({ product, setView, addToCart }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  if (!product) {
    return (
      <section className="max-w-xl mx-auto px-5 py-24 text-center">
        <p className="text-lg mb-6" style={{ fontFamily: "Fraunces, serif" }}>هذا المنتج غير موجود</p>
        <button onClick={() => setView("shop")} className="px-6 py-3 text-sm" style={{ backgroundColor: COLORS.ink, color: COLORS.ivory, fontFamily: "Jost, sans-serif" }}>
          Return to Shop
        </button>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-5 md:px-8 py-12">
      <button onClick={() => setView("shop")} className="text-sm flex items-center gap-1 mb-8" style={{ color: COLORS.mute, fontFamily: "Jost, sans-serif" }}>
        <ChevronRight size={16} /> Return to Shop
      </button>
      <div className="grid md:grid-cols-2 gap-10 md:gap-16">
        <img src={product.img} alt={product.name} className="w-full object-cover" style={{ aspectRatio: "4/5" }} />
        <div>
          <p className="text-xs tracking-[0.2em] mb-3" style={{ color: COLORS.bronze, fontFamily: "Jost, sans-serif" }}>
            {CATEGORIES.find((c) => c.id === product.cat)?.label}
          </p>
          <h1 className="text-3xl md:text-4xl mb-4" style={{ fontFamily: "Fraunces, serif", color: COLORS.ink }}>
            {product.name}
          </h1>
          <p className="text-xl mb-6" style={{ color: COLORS.wine, fontFamily: "Jost, sans-serif" }}>
            {formatPrice(product.price)}
          </p>
          <p className="text-sm leading-relaxed mb-8" style={{ color: COLORS.mute, fontFamily: "Jost, sans-serif", fontWeight: 300 }}>
            {product.description}
          </p>
          <div className="mb-6">
  <p className="text-sm mb-2">Size</p>

  <div className="flex gap-2 flex-wrap">
  {(
  Array.isArray(product.sizes)
    ? product.sizes
    : String(product.sizes || "").split(",").map(s => s.trim())
)
.sort((a, b) => {
  const order = ["XS", "S", "M", "L", "XL", "XXL"];
  return order.indexOf(a.toUpperCase()) - order.indexOf(b.toUpperCase());
})
.map((size) => (
  <button
    key={size}
    onClick={() => setSelectedSize(size)}
    className={`px-4 py-2 border ${
      selectedSize === size
        ? "bg-black text-white"
        : "bg-white"
    }`}
  >
    {size}
  </button>
))}
  </div>
</div>
<div className="mb-6">
  <p className="text-sm mb-2">Color</p>

  <div className="flex gap-3 flex-wrap">
  {(
  Array.isArray(product.colors)
    ? product.colors
    : String(product.colors || "").split(",").map(c => c.trim())
).map((color) => (
      <button
        key={color}
        onClick={() => setSelectedColor(color)}
        className={`w-8 h-8 rounded-full border-2 ${
          selectedColor === color
            ? "border-black scale-110"
            : "border-gray-300"
        }`}
        style={{ backgroundColor: color }}
      />
    ))}
  </div>
</div>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border" style={{ borderColor: COLORS.taupe }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3" aria-label="إنقاص الكمية">
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="p-3" aria-label="زيادة الكمية">
                <Plus size={14} />
              </button>
            </div>
            <div className="flex gap-3 w-full">
            <button
             onClick={() => {
    if (!selectedSize) {
        alert("يرجى اختيار المقاس");
        return;
    }
    if (!selectedColor) {
  alert("يرجى اختيار اللون");
  return;
}

    addToCart(product.id, qty, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
}}
              className="px-5 py-3.5 text-sm tracking-wide flex items-center justify-center gap-2 transition-colors"
              style={{ backgroundColor: added ? "#3d6b4f" : COLORS.ink, color: COLORS.ivory, fontFamily: "Jost, sans-serif" }}
            >
              {added ? (
                <>
                  <Check size={16} /> Added to Bag
                </>
              ) : (
                "Add to Bag"
              )}
            </button>
            <button
  onClick={() => {
    if (!selectedSize) {
      alert("يرجى اختيار المقاس");
      return;
    }
    if (!selectedColor) {
  alert("يرجى اختيار اللون");
  return;
}

    addToCart(product.id, qty, selectedSize, selectedColor);
    setView("checkout");
  }}
  className="flex-1 py-3.5 text-sm border"
style={{
  backgroundColor: COLORS.ink,
  color: COLORS.ivory,
  borderColor: COLORS.ink,
  fontFamily: "Jost, sans-serif",
}}
>
  Buy Now
</button>
</div>
          </div>
          <div className="text-xs space-y-1" style={{ color: COLORS.mute, fontFamily: "Jost, sans-serif" }}>
            <p>• Shipping within 3-5 business days</p>
            <p>• Return policy within 72 hours</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Route wrapper: يقرأ اسم المنتج (على شكل slug) من الرابط (URL) مباشرة
// مثال: /product/فستان-الصيف
function ProductRoute({ products, addToCart, setView }) {
  const { id: slug } = useParams();
  const product =
    products.find((p) => slugify(p.name) === slug) ||
    products.find((p) => String(p.id) === String(slug)); // احتياط للروابط القديمة بالأرقام
  return <ProductView product={product} setView={setView} addToCart={addToCart} />;
}

function CartDrawer({ products, open, onClose, cart, updateQty, removeItem, setView }) {
  const items = cart.map((c) => ({ ...c, product: products.find((p) => p.id === c.id) })).filter((i) => i.product);
  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ backgroundColor: "rgba(0,0,0,0.4)", opacity: open ? 1 : 0 }}
        onClick={onClose}
      />
      <div
        className="absolute top-0 right-0 h-full w-full sm:w-[420px] flex flex-col transition-transform duration-300"
        style={{ backgroundColor: COLORS.ivory, transform: open ? "translateX(0)" : "translateX(100%)" }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: COLORS.taupe }}>
          <h2 className="text-lg" style={{ fontFamily: "Fraunces, serif" }}>Your Shopping Bag</h2>
          <button onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 && (
            <p className="text-sm mt-10 text-center" style={{ color: COLORS.mute, fontFamily: "Jost, sans-serif" }}>
              Your Bag is currently empty
            </p>
          )}
          {items.map((i) => (
            <div key={`${i.id}-${i.size ?? "nosize"}-${i.color ?? "nocolor"}`} className="flex gap-4 py-4 border-b" style={{ borderColor: COLORS.taupe }}>
              <img src={i.product.img} alt="" className="w-20 h-24 object-cover shrink-0" />
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between gap-2">
                  <p className="text-sm" style={{ fontFamily: "Jost, sans-serif" }}>{i.product.name}</p>
                  <div className="text-xs mt-1 text-right" style={{ color: COLORS.mute, fontFamily: "Jost, sans-serif" }}>
                    {i.size && <p>Size: {i.size}</p>}
                    {i.color && (
                      <p className="flex items-center gap-1.5 justify-end mt-0.5">
                        Color:
                        <span
                          className="inline-block w-3.5 h-3.5 rounded-full border"
                          style={{ backgroundColor: i.color, borderColor: COLORS.taupe }}
                        />
                      </p>
                    )}
                  </div>
                  <button onClick={() => removeItem(i.id, i.size, i.color)} aria-label="حذف">
                    <X size={15} color={COLORS.mute} />
                  </button>
                </div>
                <p className="text-xs" style={{ color: COLORS.bronze, fontFamily: "Jost, sans-serif" }}>{formatPrice(i.product.price)}</p>
                <div className="flex items-center border w-fit" style={{ borderColor: COLORS.taupe }}>
                  <button onClick={() => updateQty(i.id, i.qty - 1, i.size, i.color)} className="px-2 py-1">
                    <Minus size={12} />
                  </button>
                  <span className="px-3 text-xs">{i.qty}</span>
                  <button onClick={() => updateQty(i.id, i.qty + 1, i.size, i.color)} className="px-2 py-1">
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="px-6 py-5 border-t" style={{ borderColor: COLORS.taupe }}>
            <div className="flex justify-between mb-4 text-sm" style={{ fontFamily: "Jost, sans-serif" }}>
              <span>Total</span>
              <span style={{ color: COLORS.wine }}>{formatPrice(total)}</span>
            </div>
            <button
              onClick={() => {
                onClose();
                setView("checkout");
              }}
              className="w-full py-3.5 text-sm tracking-wide"
              style={{ backgroundColor: COLORS.ink, color: COLORS.ivory, fontFamily: "Jost, sans-serif" }}
            >
              Complete Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CheckoutView({ products, cart, setView, clearCart, recordOrder }) {
  const [step, setStep] = useState("form");
  const [form, setForm] = useState({ name: "", phone: "", wilaya: "", address: "" });
  const [deliveryType, setDeliveryType] = useState("domicile");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}, []);
  const items = cart.map((c) => ({ ...c, product: products.find((p) => p.id === c.id) })).filter((i) => i.product);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);

  const selectedWilaya = WILAYAS.find((w) => w.name === form.wilaya);
  const domicileAvailable = selectedWilaya ? selectedWilaya.domicile > 0 : true;
  const stopdeskAvailable = selectedWilaya ? selectedWilaya.stopdesk > 0 : true;
  const shippingFee = selectedWilaya ? (deliveryType === "domicile" ? selectedWilaya.domicile : selectedWilaya.stopdesk) : 0;
  const total = subtotal + shippingFee;

  if (items.length === 0 && step === "form") {
    return (
      <section className="max-w-xl mx-auto px-5 py-24 text-center">
        <p className="text-lg mb-6" style={{ fontFamily: "Fraunces, serif" }}>Your Bag is currently empty</p>
        <button onClick={() => setView("shop")} className="px-6 py-3 text-sm" style={{ backgroundColor: COLORS.ink, color: COLORS.ivory, fontFamily: "Jost, sans-serif" }}>
          Return to Shop
        </button>
      </section>
    );
  }

  if (step === "done") {
    return (
      <section className="max-w-xl mx-auto px-5 py-28 text-center">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: COLORS.bronze }}>
          <Check size={24} color={COLORS.ink} />
        </div>
        <h1 className="text-2xl md:text-3xl mb-3" style={{ fontFamily: "Fraunces, serif" }}>تم استلام طلبك</h1>
        <p className="text-sm mb-8" style={{ color: COLORS.mute, fontFamily: "Jost, sans-serif" }}>
          Thank you for choosing AORA. Your order is being carefully prepared with attention to every detail.
        </p>
        <button
          onClick={() => setView("home")}
          className="px-6 py-3 text-sm"
          style={{ backgroundColor: COLORS.ink, color: COLORS.ivory, fontFamily: "Jost, sans-serif" }}
        >
          Return to Home
        </button>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-5 md:px-8 py-14 grid md:grid-cols-5 gap-12">
      <form
        className="md:col-span-3 space-y-5"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!selectedWilaya || submitting) return;
          setError("");
          setSubmitting(true);
          const ok = await recordOrder({
            id: Date.now(),
            date: new Date().toISOString(),
            customer: form,
            delivery_type: deliveryType,
            shipping_fee: shippingFee,
            items: items.map((i) => ({ name: i.product.name, qty: i.qty, price: i.product.price, size: i.size, color: i.color })),
            subtotal,
            total,
          });
          setSubmitting(false);
          if (ok) {
            setStep("done");
          } else {
            setError("حدث خطأ أثناء إرسال الطلب. حاولي مرة أخرى من فضلك.");
          }
        }}
      >
        <h1 className="text-2xl mb-2" style={{ fontFamily: "Fraunces, serif" }}>معلومات التوصيل</h1>
        {error && (
          <p className="text-sm px-4 py-3" style={{ backgroundColor: "#fbe3e3", color: COLORS.wine, fontFamily: "Jost, sans-serif" }}>
            {error}
          </p>
        )}
        <div className="grid grid-cols-2 gap-4">
          <input required placeholder="الاسم الكامل" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border px-4 py-3 text-sm col-span-2" style={{ borderColor: COLORS.taupe, fontFamily: "Jost, sans-serif" }} />
         <input
  required
  type="tel"
  placeholder="رقم الهاتف"
  value={form.phone}
onChange={(e) =>
  setForm({
    ...form,
    phone: e.target.value.replace(/\D/g, "").slice(0, 10),
  })
}
  
  pattern="[0-9]{10}"
  maxLength={10}
  className="border px-4 py-3 text-sm bg-white"
  style={{ borderColor: COLORS.taupe, fontFamily: "Jost, sans-serif" }}
/>
          <select
            required
            value={form.wilaya}
            onChange={(e) => setForm({ ...form, wilaya: e.target.value })}
            className="border px-4 py-3 text-sm bg-white"
            style={{ borderColor: COLORS.taupe, fontFamily: "Jost, sans-serif" }}
          >
            <option value="">اختاري الولاية</option>
            {WILAYAS.map((w) => (
              <option key={w.name} value={w.name} disabled={w.domicile === 0 && w.stopdesk === 0}>
                {w.name}{w.domicile === 0 && w.stopdesk === 0 ? " (غير متوفرة حاليًا)" : ""}
              </option>
            ))}
          </select>
          <input required placeholder="العنوان الكامل" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="border px-4 py-3 text-sm col-span-2" style={{ borderColor: COLORS.taupe, fontFamily: "Jost, sans-serif" }} />
        </div>

        {selectedWilaya && (
          <div>
            <h2 className="text-lg pt-2 mb-3" style={{ fontFamily: "Fraunces, serif" }}>طريقة التوصيل</h2>
            <div className="space-y-3 text-sm" style={{ fontFamily: "Jost, sans-serif" }}>
              <label
                className="flex items-center justify-between gap-3 border p-4"
                style={{ borderColor: COLORS.taupe, opacity: domicileAvailable ? 1 : 0.4, cursor: domicileAvailable ? "pointer" : "not-allowed" }}
              >
                <span className="flex items-center gap-3">
                  <input type="radio" name="delivery" checked={deliveryType === "domicile"} disabled={!domicileAvailable} onChange={() => setDeliveryType("domicile")} />
                  التوصيل إلى المنزل
                </span>
                <span style={{ color: COLORS.bronze }}>{domicileAvailable ? formatPrice(selectedWilaya.domicile) : "غير متوفر"}</span>
              </label>
              <label
                className="flex items-center justify-between gap-3 border p-4"
                style={{ borderColor: COLORS.taupe, opacity: stopdeskAvailable ? 1 : 0.4, cursor: stopdeskAvailable ? "pointer" : "not-allowed" }}
              >
                <span className="flex items-center gap-3">
                  <input type="radio" name="delivery" checked={deliveryType === "stopdesk"} disabled={!stopdeskAvailable} onChange={() => setDeliveryType("stopdesk")} />
                  الاستلام من مكتب التوصيل
                </span>
                <span style={{ color: COLORS.bronze }}>{stopdeskAvailable ? formatPrice(selectedWilaya.stopdesk) : "غير متوفر"}</span>
              </label>
            </div>
          </div>
        )}

        <h2 className="text-lg pt-4" style={{ fontFamily: "Fraunces, serif" }}>طريقة الدفع</h2>
        <div className="space-y-3 text-sm" style={{ fontFamily: "Jost, sans-serif" }}>
          <label className="flex items-center gap-3 border p-4 cursor-pointer" style={{ borderColor: COLORS.taupe }}>
            <input type="radio" name="pay" defaultChecked /> الدفع عند الاستلام
          </label>
        </div>
        <button
          type="submit"
          disabled={!selectedWilaya || (!domicileAvailable && !stopdeskAvailable) || submitting}
          className="w-full py-4 text-sm tracking-wide mt-4"
          style={{ backgroundColor: COLORS.ink, color: COLORS.ivory, fontFamily: "Jost, sans-serif", opacity: !selectedWilaya || submitting ? 0.5 : 1 }}
        >
          {submitting ? "جارٍ الإرسال..." : `Confirm Order — ${formatPrice(total)}`}
        </button>
      </form>
      <div className="md:col-span-2">
        <h2 className="text-lg mb-4" style={{ fontFamily: "Fraunces, serif" }}>ملخص الطلب</h2>
        <div className="space-y-4">
          {items.map((i) => (
            <div key={`${i.id}-${i.size ?? "nosize"}-${i.color ?? "nocolor"}`} className="flex gap-3 text-sm" style={{ fontFamily: "Jost, sans-serif" }}>
              <img src={i.product.img} className="w-14 h-16 object-cover" alt="" />
              <div className="flex-1">
                <p>{i.product.name}</p>
                <p style={{ color: COLORS.mute }}>x{i.qty}</p>
              </div>
              <p style={{ color: COLORS.bronze }}>{formatPrice(i.product.price * i.qty)}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2 mt-6 pt-4 border-t text-sm" style={{ borderColor: COLORS.taupe, fontFamily: "Jost, sans-serif" }}>
          <div className="flex justify-between" style={{ color: COLORS.mute }}>
            <span>المجموع الجزئي</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between" style={{ color: COLORS.mute }}>
            <span>التوصيل</span>
            <span>{selectedWilaya ? formatPrice(shippingFee) : "—"}</span>
          </div>
          <div className="flex justify-between text-base pt-2 border-t" style={{ borderColor: COLORS.taupe }}>
            <span>الإجمالي</span>
            <span style={{ color: COLORS.wine }}>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  { q: "كم تستغرق مدة التوصيل؟", a: "يصل طلبك عادة خلال 3 إلى 5 أيام عمل داخل الوطن، وقد تختلف المدة حسب المنطقة." },
  { q: "هل يمكنني إرجاع القطعة؟", a: "نعم، يمكن إرجاع أو استبدال أي قطعة خلال 72 ساعة من الاستلام بشرط أن تكون بحالتها الأصلية." },
  { q: "هل التوصيل متوفر لكل الولايات؟", a: "نغطي جميع الولايات عبر شركائنا في التوصيل، مع خيار الدفع عند الاستلام." },
];

function AboutView() {
  const [openFaq, setOpenFaq] = useState(null);
  return (
    <section>
      <div className="max-w-4xl mx-auto px-5 md:px-8 py-16 text-center">
        <p className="text-xs tracking-[0.3em] mb-4">
          Since 2019
        </p>
        <h1 className="text-3xl md:text-4xl mb-6" style={{ fontFamily: "Fraunces, serif", color: COLORS.ink }}>
          Every Great Story Begins Somewhere—Ours Began in a Small Workshop
        </h1>
        <p className="text-sm md:text-base leading-loose max-w-2xl mx-auto" style={{ color: COLORS.mute, fontFamily: "Jost, sans-serif", fontWeight: 300 }}>
          AORA was born from a passion for the little details that make a difference. We believe that true elegance doesn't need to shout.
        </p>
      </div>
      <div className="grid grid-cols-3">
      {[v1, v2, v3].map((image, i) => (
  <img
    key={i}
    src={image}
    alt=""
    className="w-full aspect-square object-cover"
  />
))} 
      </div>
      <div className="max-w-2xl mx-auto px-5 md:px-8 py-16">
        <h2 className="text-2xl mb-8 text-center" style={{ fontFamily: "Fraunces, serif" }}>
          FAQS
        </h2>
        <div className="space-y-2">
          {FAQS.map((f, i) => (
            <div key={i} className="border-b" style={{ borderColor: COLORS.taupe }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between py-4 text-sm text-right"
                style={{ fontFamily: "Jost, sans-serif" }}
              >
                {f.q}
                <ChevronDown size={16} style={{ transform: openFaq === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>
              {openFaq === i && (
                <p className="pb-4 text-sm leading-relaxed" style={{ color: COLORS.mute, fontFamily: "Jost, sans-serif", fontWeight: 300 }}>
                  {f.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ShippingView() {
  return (
    <section className="max-w-4xl mx-auto px-5 py-16">
      <h1 className="text-4xl mb-8" style={{ fontFamily: "Fraunces, serif", color: COLORS.ink }}>
        Shipping & Delivery
      </h1>
      <p className="mb-6">We ship worldwide with trusted courier partners.</p>
      <h2 className="text-2xl mb-3">Processing Time</h2>
      <p className="mb-6">Orders are processed within 1–2 business days.</p>
      <h2 className="text-2xl mb-3">Delivery Time</h2>
      <p className="mb-6">Delivery usually takes 3–5 business days depending on the destination.</p>
      <h2 className="text-2xl mb-3">Tracking</h2>
      <p>A tracking number will be sent by email once your order has shipped.</p>
    </section>
  );
}

function ReturnsView() {
  return (
    <section className="max-w-4xl mx-auto px-5 py-16">
      <h1 className="text-4xl mb-8" style={{ fontFamily: "Fraunces, serif", color: COLORS.ink }}>
        Returns & Exchanges
      </h1>
      <p className="mb-6">We want you to be completely satisfied with your purchase.</p>
      <h2 className="text-2xl mb-3">Return Policy</h2>
      <p className="mb-6">
        You may return items within 72 hours of delivery if they are unused, undamaged, and in their original packaging.
      </p>
      <h2 className="text-2xl mb-3">Exchanges</h2>
      <p className="mb-6">
        If you received the wrong item or a defective product, we will gladly replace it at no additional cost.
      </p>
      <h2 className="text-2xl mb-3">Refunds</h2>
      <p>Refunds are processed within 5–7 business days after we receive and inspect the returned item.</p>
    </section>
  );
}

function FaqView() {
  return (
    <section className="max-w-4xl mx-auto px-5 py-16">
      <h1 className="text-4xl mb-8" style={{ fontFamily: "Fraunces, serif", color: COLORS.ink }}>
        Frequently Asked Questions
      </h1>
      <h2 className="text-2xl mb-3">How long does shipping take?</h2>
      <p className="mb-6">Orders are delivered within 3–5 business days depending on your location.</p>
      <h2 className="text-2xl mb-3">Can I return my order?</h2>
      <p className="mb-6">Yes. Returns are accepted within 72 hours if the item is unused and in its original condition.</p>
      <h2 className="text-2xl mb-3">How can I contact AORA?</h2>
      <p>You can contact us anytime through the Contact page. We usually reply within one business day.</p>
    </section>
  );
}

function CustomerCareView() {
  return (
    <section className="max-w-3xl mx-auto px-5 md:px-8 py-16">
      <h1 className="text-3xl md:text-4xl mb-6" style={{ fontFamily: "Fraunces, serif", color: COLORS.ink }}>
        Customer Care
      </h1>
      <p className="text-sm leading-relaxed" style={{ color: COLORS.mute, fontFamily: "Jost, sans-serif" }}>
        نحن هنا لمساعدتك في أي وقت. لأي استفسار حول طلبك أو منتجاتنا، لا تترددي في التواصل معنا عبر صفحة "اتصل بنا".
      </p>
    </section>
  );
}

function ContactView() {
  const [sent, setSent] = useState(false);
  return (
    <section className="max-w-2xl mx-auto px-5 md:px-8 py-16">
      <h1 className="text-3xl mb-3 text-center" style={{ fontFamily: "Fraunces, serif" }}>Contact us</h1>
      <p className="text-sm text-center mb-10" style={{ color: COLORS.mute, fontFamily: "Jost, sans-serif" }}>
        We are happy to answer your questions within one business day.
      </p>
      {sent ? (
        <div className="text-center py-10">
          <Check size={28} color={COLORS.bronze} className="mx-auto mb-4" />
          <p style={{ fontFamily: "Jost, sans-serif" }}>تم إرسال رسالتك بنجاح.</p>
        </div>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <input required placeholder="الاسم" className="w-full border px-4 py-3 text-sm" style={{ borderColor: COLORS.taupe, fontFamily: "Jost, sans-serif" }} />
          <input required type="email" placeholder="البريد الإلكتروني" className="w-full border px-4 py-3 text-sm" style={{ borderColor: COLORS.taupe, fontFamily: "Jost, sans-serif" }} />
          <textarea required placeholder="رسالتك" rows={5} className="w-full border px-4 py-3 text-sm" style={{ borderColor: COLORS.taupe, fontFamily: "Jost, sans-serif" }} />
          <button type="submit" className="px-8 py-3.5 text-sm tracking-wide" style={{ backgroundColor: COLORS.ink, color: COLORS.ivory, fontFamily: "Jost, sans-serif" }}>
            إرسال
          </button>
        </form>
      )}
      <div className="grid grid-cols-3 gap-4 mt-16 text-center text-sm" style={{ fontFamily: "Jost, sans-serif", color: COLORS.mute }}>
        <div>
          <p className="text-xs mb-1" style={{ color: COLORS.bronze }}>الهاتف</p>
          <p dir="ltr">0555 12 34 56</p>
        </div>
        <div>
          <p className="text-xs mb-1" style={{ color: COLORS.bronze }}>البريد</p>
          <p>contact@ateliernoor.dz</p>
        </div>
        <div>
          <p className="text-xs mb-1" style={{ color: COLORS.bronze }}>الفرع</p>
          <p>الجزائر العاصمة</p>
        </div>
      </div>
    </section>
  );
}

function AdminView({ products, addProduct, deleteProduct, orders, ordersLoading }) {
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState("");
  const [tab, setTab] = useState("products");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const emptyForm = {
    name: "",
    price: "",
    img: "",
    description: "",
    sizes: [],
    colors: [],
  };
  const [form, setForm] = useState(emptyForm);

  if (!unlocked) {
    return (
      <section className="max-w-sm mx-auto px-5 py-24 text-center">
        <Lock size={22} color={COLORS.bronze} className="mx-auto mb-4" />
        <h1 className="text-xl mb-6" style={{ fontFamily: "Fraunces, serif" }}>لوحة تحكم المتجر</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (code === ADMIN_PASSCODE) setUnlocked(true);
            else alert("رمز غير صحيح");
          }}
          className="space-y-3"
        >
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="رمز الدخول"
            className="w-full border px-4 py-3 text-sm text-center"
            style={{ borderColor: COLORS.taupe, fontFamily: "Jost, sans-serif" }}
          />
          <button type="submit" className="w-full py-3 text-sm" style={{ backgroundColor: COLORS.ink, color: COLORS.ivory, fontFamily: "Jost, sans-serif" }}>
            دخول
          </button>
        </form>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-5 md:px-8 py-14">
      <h1 className="text-2xl md:text-3xl mb-8" style={{ fontFamily: "Fraunces, serif", color: COLORS.ink }}>
        لوحة تحكم المتجر
      </h1>
      <div className="flex gap-3 mb-8 border-b" style={{ borderColor: COLORS.taupe }}>
        <button
          onClick={() => setTab("products")}
          className="flex items-center gap-2 text-sm px-4 py-3 border-b-2"
          style={{ fontFamily: "Jost, sans-serif", borderColor: tab === "products" ? COLORS.bronze : "transparent", color: tab === "products" ? COLORS.ink : COLORS.mute }}
        >
          <Package size={15} /> المنتجات
        </button>
        <button
          onClick={() => setTab("orders")}
          className="flex items-center gap-2 text-sm px-4 py-3 border-b-2"
          style={{ fontFamily: "Jost, sans-serif", borderColor: tab === "orders" ? COLORS.bronze : "transparent", color: tab === "orders" ? COLORS.ink : COLORS.mute }}
        >
          <Settings size={15} /> الطلبيات
        </button>
      </div>

      {tab === "products" && (
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-lg mb-4" style={{ fontFamily: "Fraunces, serif" }}>إضافة منتج</h2>
            {formError && (
              <p className="text-sm px-4 py-3 mb-3" style={{ backgroundColor: "#fbe3e3", color: COLORS.wine, fontFamily: "Jost, sans-serif" }}>
                {formError}
              </p>
            )}
            <form
              className="space-y-3"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!form.name || !form.price || saving) return;
                setFormError("");
                setSaving(true);
                // form.sizes و form.colors مصفوفات أصلاً (من الـ checkboxes/الألوان)
                // لا حاجة لاستدعاء .split() عليها
                const ok = await addProduct({
                  name: form.name,
                  price: Number(form.price),
                  img: form.img,
                  description: form.description,
                  sizes: form.sizes,
                  colors: form.colors,
                });
                setSaving(false);
                if (ok) {
                  setForm(emptyForm);
                } else {
                  setFormError("تعذر حفظ المنتج. حاولي مرة أخرى.");
                }
              }}
            >
              <input required placeholder="اسم المنتج" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border px-4 py-3 text-sm" style={{ borderColor: COLORS.taupe, fontFamily: "Jost, sans-serif" }} />
              <input required type="number" placeholder="السعر" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full border px-4 py-3 text-sm" style={{ borderColor: COLORS.taupe, fontFamily: "Jost, sans-serif" }} />
              <input placeholder="رابط الصورة (اختياري)" value={form.img} onChange={(e) => setForm({ ...form, img: e.target.value })} className="w-full border px-4 py-3 text-sm" style={{ borderColor: COLORS.taupe, fontFamily: "Jost, sans-serif" }} />
              <textarea placeholder="الوصف" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border px-4 py-3 text-sm" style={{ borderColor: COLORS.taupe, fontFamily: "Jost, sans-serif" }} />
               <div className="space-y-4">

  <div>
    <p className="mb-2 font-medium">المقاسات</p>

    {["XS","S","M","L","XL","XXL"].map((size) => (
      <label key={size} className="mr-4">
        <input
          type="checkbox"
          checked={form.sizes.includes(size)}
          onChange={(e) => {
            if (e.target.checked) {
              setForm({
                ...form,
                sizes: [...form.sizes, size],
              });
            } else {
              setForm({
                ...form,
                sizes: form.sizes.filter((s) => s !== size),
              });
            }
          }}
        />
        <span className="ml-1">{size}</span>
      </label>
    ))}
  </div>
<div className="mt-4">
  <p className="mb-2 font-medium">الألوان</p>

  <div className="flex flex-wrap gap-3">
    {[
      { name: "Black", color: "#000" },
      { name: "White", color: "#fff" },
      { name: "Brown", color: "#8B4513" },
      { name: "Beige", color: "#F5F5DC" },
      { name: "Gray", color: "#808080" },
      { name: "Blue", color: "#2563eb" },
    ].map((item) => (
      <button
        type="button"
        key={item.name}
        onClick={() => {
          if (form.colors.includes(item.name)) {
            setForm({
              ...form,
              colors: form.colors.filter((c) => c !== item.name),
            });
          } else {
            setForm({
              ...form,
              colors: [...form.colors, item.name],
            });
          }
        }}
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: item.color,
          border: form.colors.includes(item.name)
            ? "3px solid #b08d57"
            : "1px solid #ccc",
        }}
      />
    ))}
  </div>
</div>
</div>

              <button type="submit" disabled={saving} className="flex items-center justify-center gap-2 w-full py-3 text-sm" style={{ backgroundColor: COLORS.ink, color: COLORS.ivory, fontFamily: "Jost, sans-serif", opacity: saving ? 0.6 : 1 }}>
                <Plus size={15} /> {saving ? "جارٍ الإضافة..." : "إضافة"}
              </button>
            </form>
          </div>
          <div>
            <h2 className="text-lg mb-4" style={{ fontFamily: "Fraunces, serif" }}>المنتجات الحالية ({products.length})</h2>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {products.map((p) => (
                <div key={p.id} className="flex items-center gap-3 border p-3" style={{ borderColor: COLORS.taupe }}>
                  <img src={p.img} alt="" className="w-12 h-14 object-cover shrink-0" />
                  <div className="flex-1 text-sm" style={{ fontFamily: "Jost, sans-serif" }}>
                    <p>{p.name}</p>
                    <p style={{ color: COLORS.bronze }}>{formatPrice(p.price)}</p>
                  </div>
                  <button
                    onClick={async () => {
                      const ok = await deleteProduct(p.id);
                      if (!ok) alert("تعذر حذف المنتج. حاولي مرة أخرى.");
                    }}
                    aria-label="حذف"
                  >
                    <Trash2 size={16} color={COLORS.wine} />
                  </button>
                </div>
              ))}
              {products.length === 0 && (
                <p className="text-sm" style={{ color: COLORS.mute, fontFamily: "Jost, sans-serif" }}>
                  لا توجد منتجات بعد
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div>
          {ordersLoading ? (
            <p className="text-sm" style={{ color: COLORS.mute, fontFamily: "Jost, sans-serif" }}>جارٍ تحميل الطلبيات...</p>
          ) : orders.length === 0 ? (
            <p className="text-sm" style={{ color: COLORS.mute, fontFamily: "Jost, sans-serif" }}>لا توجد طلبيات بعد</p>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="border p-4 text-sm" style={{ borderColor: COLORS.taupe, fontFamily: "Jost, sans-serif" }}>
                  <div className="flex justify-between mb-2">
                    <span>{o.customer?.name}</span>
                    <span style={{ color: COLORS.bronze }}>{formatPrice(o.total)}</span>
                  </div>
                  <p style={{ color: COLORS.mute }} dir="ltr">{o.customer?.phone}</p>
                  <p style={{ color: COLORS.mute }}>{o.customer?.wilaya} — {o.customer?.address}</p>
                  <p style={{ color: COLORS.mute }} className="mt-1">
                    {o.items?.map((it) => `${it.name} x${it.qty}`).join("، ")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function AppContent() {
  const location = useLocation();
  const setView = useGoTo();
  const view = pathToView(location.pathname);
  useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}, [location.pathname]);

  const [activeCat, setActiveCat] = useState("all");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [productsLoading, setProductsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("products").select("*").order("id", { ascending: true });
      if (error) {
        console.error("خطأ في تحميل المنتجات:", error.message);
        setProducts(DEFAULT_PRODUCTS);
      } else if (data && data.length === 0) {
        const seed = DEFAULT_PRODUCTS.map(({ id, ...rest }) => rest);
        const { data: inserted, error: seedError } = await supabase.from("products").insert(seed).select();
        if (seedError) console.error("خطأ في تهيئة المنتجات:", seedError.message);
        setProducts(inserted && inserted.length ? inserted : DEFAULT_PRODUCTS);
      } else {
        setProducts(data);
      }
      setProductsLoading(false);
    })();
  }, []);

  const loadOrders = async () => {
    setOrdersLoading(true);
    const { data, error } = await supabase.from("orders").select("*").order("id", { ascending: false });
    if (error) console.error("خطأ في تحميل الطلبيات:", error.message);
    setOrders(data || []);
    setOrdersLoading(false);
  };
  useEffect(() => {
    if (view === "admin") loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  const addToCart = (id, qty = 1, size = null, color = null) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === id && c.size === size && c.color === color);
      if (existing) {
        return prev.map((c) => (c.id === id && c.size === size && c.color === color ? { ...c, qty: c.qty + qty } : c));
      }
      return [...prev, { id, qty, size, color }];
    });
    setCartOpen(true);
  };

  // ⚠️ إصلاح: قبل كانت هذه الدوال تتجاهل المقاس واللون فتؤثر على كل نسخ
  // المنتج بنفس id بغض النظر عن المقاس/اللون. الآن تتحقق من الثلاثة معًا.
  const updateQty = (id, qty, size = null, color = null) => {
    if (qty < 1) return;
    setCart((prev) => prev.map((c) => (c.id === id && c.size === size && c.color === color ? { ...c, qty } : c)));
  };
  const removeItem = (id, size = null, color = null) => {
    setCart((prev) => prev.filter((c) => !(c.id === id && c.size === size && c.color === color)));
  };
  const clearCart = () => setCart([]);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const addProduct = async (data) => {
    try {
      const { data: inserted, error } = await supabase.from("products").insert([{ cat: "robes", ...data }]).select();
      if (error) {
        console.error("تعذر حفظ المنتج:", error.message);
        return false;
      }
      setProducts((prev) => [inserted[0], ...prev]);
      return true;
    } catch (err) {
      console.error("تعذر حفظ المنتج:", err);
      return false;
    }
  };

  const deleteProduct = async (id) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) {
        console.error("تعذر حذف المنتج:", error.message);
        return false;
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (err) {
      console.error("تعذر حذف المنتج:", err);
      return false;
    }
  };

  const recordOrder = async (order) => {
    try {
      const { id, ...orderData } = order;
      const { error } = await supabase.from("orders").insert([orderData]);
      if (error) {
        console.error("تعذر حفظ الطلبية:", error.message);
        return false;
      }
      clearCart();
      return true;
    } catch (err) {
      console.error("تعذر حفظ الطلبية:", err);
      return false;
    }
  };

  return (
    <div dir="rtl" style={{ backgroundColor: COLORS.ivory, minHeight: "100vh" }}>
      <style>{FONTS}</style>
      <TopBar view={view} setView={setView} cartCount={cartCount} setCartOpen={setCartOpen} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      {productsLoading ? (
        <p className="text-center py-24 text-sm" style={{ color: COLORS.mute, fontFamily: "Jost, sans-serif" }}>جارٍ تحميل المتجر...</p>
      ) : (
        <Routes>
          <Route path="/" element={<HomeView products={products} setView={setView} setActiveCat={setActiveCat} addToCart={addToCart} />} />
          <Route path="/shop" element={<ShopView products={products} activeCat={activeCat} setActiveCat={setActiveCat} setView={setView} addToCart={addToCart} />} />
          <Route path="/product/:id" element={<ProductRoute products={products} addToCart={addToCart} setView={setView} />} />
          <Route path="/checkout" element={<CheckoutView products={products} cart={cart} setView={setView} clearCart={clearCart} recordOrder={recordOrder} />} />
          <Route path="/about" element={<AboutView />} />
          <Route path="/customer-care" element={<CustomerCareView />} />
          <Route path="/shipping" element={<ShippingView />} />
          <Route path="/returns" element={<ReturnsView />} />
          <Route path="/faq" element={<FaqView />} />
          <Route path="/contact" element={<ContactView />} />
          <Route path="/admin" element={<AdminView products={products} addProduct={addProduct} deleteProduct={deleteProduct} orders={orders} ordersLoading={ordersLoading} />} />
          <Route path="*" element={<HomeView products={products} setView={setView} setActiveCat={setActiveCat} addToCart={addToCart} />} />
        </Routes>
      )}
      <Footer setView={setView} />
      <CartDrawer products={products} open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} updateQty={updateQty} removeItem={removeItem} setView={setView} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}