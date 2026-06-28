"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Check, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/* ──────────────────────────────────────────────────────────
   Floating particle background
────────────────────────────────────────────────────────── */
function Particles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: Math.random() * 14 + 5,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 6 + 7,
    emoji: ["🥑", "🍊", "🥕", "🍓", "🍋", "🥦", "🍎", "🍇", "🧀", "🥚"][
      Math.floor(Math.random() * 10)
    ],
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute text-xl md:text-2xl"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={{
            y: [0, -28, 0],
            x: [0, p.id % 2 === 0 ? 14 : -14, 0],
            rotate: [0, p.id % 2 === 0 ? 15 : -15, 0],
            opacity: [0.35, 0.75, 0.35],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   3-D interactive mascot that follows the cursor
────────────────────────────────────────────────────────── */
function Mascot3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rotX = useSpring(0, { stiffness: 120, damping: 18 });
  const rotY = useSpring(0, { stiffness: 120, damping: 18 });
  const scaleVal = useMotionValue(1);

  // eye tracking
  const eyeX = useSpring(0, { stiffness: 200, damping: 25 });
  const eyeY = useSpring(0, { stiffness: 200, damping: 25 });

  const handleMouseMove = (e: MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    rotX.set(-dy * 18);
    rotY.set(dx * 18);
    eyeX.set(dx * 5);
    eyeY.set(dy * 4);
  };

  const handleMouseLeave = () => {
    rotX.set(0);
    rotY.set(0);
    eyeX.set(0);
    eyeY.set(0);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  });

  return (
    <div ref={containerRef} className="relative flex items-center justify-center select-none">
      {/* Glow ring */}
      <motion.div
        className="absolute rounded-full w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64"
        style={{
          background:
            "radial-gradient(circle, rgba(0,163,163,0.28) 0%, rgba(255,119,0,0.12) 60%, transparent 80%)",
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Shadow under mascot */}
      <motion.div
        className="absolute bottom-2 rounded-full w-24 h-4 md:w-36 md:h-6"
        style={{
          background: "rgba(0,0,0,0.15)",
          filter: "blur(10px)",
        }}
        animate={{ scaleX: [1, 1.06, 1], opacity: [0.5, 0.3, 0.5] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* The card that tilts in 3-D */}
      <motion.div
        style={{
          rotateX: rotX,
          rotateY: rotY,
          scale: scaleVal,
          transformStyle: "preserve-3d",
          perspective: 800,
        }}
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.05 }}
        onHoverStart={() => scaleVal.set(1.05)}
        onHoverEnd={() => scaleVal.set(1)}
        className="relative cursor-pointer"
      >
        <Image
          src="/mascot.png"
          alt="AL-FATAH MART mascot"
          width={300}
          height={300}
          priority
          className="w-36 md:w-52 lg:w-64 h-auto drop-shadow-2xl mix-blend-multiply object-contain"
          style={{ filter: "drop-shadow(0 20px 30px rgba(0,122,122,0.35))" }}
        />

        {/* Floating badge: "Welcome!" */}
        <motion.div
          className="absolute -top-3 -right-6 bg-white rounded-2xl shadow-xl px-3 py-1.5 text-xs font-bold text-primary border border-primary/10 whitespace-nowrap"
          style={{ translateZ: 30 }}
          animate={{ y: [0, -5, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          👋 Welcome!
        </motion.div>

        {/* Floating badge: cart */}
        <motion.div
          className="absolute -bottom-1 -left-7 bg-accent rounded-2xl shadow-xl px-3 py-1.5 text-xs font-bold text-white whitespace-nowrap flex items-center gap-1.5"
          style={{ translateZ: 30 }}
          animate={{ y: [0, 5, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <ShoppingBag className="w-3 h-3" />
          Great Deals!
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Input Field
────────────────────────────────────────────────────────── */
interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  suffix?: React.ReactNode;
}

function InputField({ id, label, type, placeholder, icon, value, onChange, error, suffix }: InputFieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
        {label}
      </label>
      <motion.div
        className={`relative flex items-center rounded-2xl border transition-all duration-200 ${
          error
            ? "border-red-400 bg-red-50"
            : focused
            ? "border-primary/60 bg-white shadow-lg shadow-primary/10"
            : "border-gray-200 bg-gray-50"
        }`}
        animate={focused ? { scale: 1.005 } : { scale: 1 }}
      >
        <span className={`pl-4 transition-colors ${focused ? "text-primary" : "text-gray-400"}`}>{icon}</span>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 px-3 py-3.5 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none"
        />
        {suffix && <span className="pr-4">{suffix}</span>}
      </motion.div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-red-500 text-xs font-medium"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Sign In Form
────────────────────────────────────────────────────────── */
function SignInForm({ onSwitch }: { onSwitch: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email.";
    if (!password) e.password = "Password is required.";
    else if (password.length < 6) e.password = "At least 6 characters.";
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    setSuccess(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <InputField
        id="signin-email"
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        icon={<Mail className="w-4 h-4" />}
        value={email}
        onChange={setEmail}
        error={errors.email}
      />
      <InputField
        id="signin-password"
        label="Password"
        type={showPass ? "text" : "password"}
        placeholder="••••••••"
        icon={<Lock className="w-4 h-4" />}
        value={password}
        onChange={setPassword}
        error={errors.password}
        suffix={
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="text-gray-400 hover:text-primary transition-colors"
          >
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        }
      />

      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
          <input type="checkbox" className="accent-primary rounded" />
          Remember me
        </label>
        <button type="button" className="text-primary font-semibold hover:underline">
          Forgot password?
        </button>
      </div>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-3 py-3.5 bg-green-50 border border-green-200 rounded-2xl text-green-700 font-semibold text-sm"
          >
            <Check className="w-5 h-5" />
            Signed in successfully!
          </motion.div>
        ) : (
          <motion.button
            key="btn"
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="btn-shine w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary to-primary-light text-white font-bold text-sm tracking-wide shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all flex items-center justify-center gap-2 disabled:opacity-80"
          >
            {loading ? (
              <motion.div
                className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <>Sign In <ArrowRight className="w-4 h-4" /></>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Divider */}
      <div className="relative flex items-center gap-3">
        <div className="flex-1 border-t border-gray-200" />
        <span className="text-xs text-gray-400 font-medium">or continue with</span>
        <div className="flex-1 border-t border-gray-200" />
      </div>

      {/* Social buttons */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Google", emoji: "🇬", color: "hover:border-red-300" },
          { label: "Facebook", emoji: "🇫", color: "hover:border-blue-300" },
        ].map(({ label, emoji, color }) => (
          <motion.button
            key={label}
            type="button"
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center justify-center gap-2 border border-gray-200 rounded-2xl py-3 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all shadow-sm ${color}`}
          >
            <span className="text-base">{label === "Google" ? "G" : "f"}</span>
            {label}
          </motion.button>
        ))}
      </div>

      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <button type="button" onClick={onSwitch} className="text-primary font-bold hover:underline">
          Sign Up
        </button>
      </p>
    </form>
  );
}

/* ──────────────────────────────────────────────────────────
   Sign Up Form
────────────────────────────────────────────────────────── */
function SignUpForm({ onSwitch }: { onSwitch: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"][strength];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Full name is required.";
    if (!phone.trim()) e.phone = "Phone number is required.";
    if (!email) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email.";
    if (!password) e.password = "Password is required.";
    else if (password.length < 6) e.password = "At least 6 characters.";
    if (!agreed) e.agreed = "Please accept terms.";
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    setSuccess(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-2 gap-3">
        <InputField
          id="signup-name"
          label="Full Name"
          type="text"
          placeholder="John Doe"
          icon={<User className="w-4 h-4" />}
          value={name}
          onChange={setName}
          error={errors.name}
        />
        <InputField
          id="signup-phone"
          label="Phone"
          type="tel"
          placeholder="03xx-xxxxxxx"
          icon={<Phone className="w-4 h-4" />}
          value={phone}
          onChange={setPhone}
          error={errors.phone}
        />
      </div>

      <InputField
        id="signup-email"
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        icon={<Mail className="w-4 h-4" />}
        value={email}
        onChange={setEmail}
        error={errors.email}
      />

      <div className="space-y-2">
        <InputField
          id="signup-password"
          label="Password"
          type={showPass ? "text" : "password"}
          placeholder="Create a strong password"
          icon={<Lock className="w-4 h-4" />}
          value={password}
          onChange={setPassword}
          error={errors.password}
          suffix={
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="text-gray-400 hover:text-primary transition-colors"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />
        {password && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    i <= strength ? strengthColor : "bg-gray-200"
                  }`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                />
              ))}
            </div>
            <p className={`text-xs font-semibold ${["", "text-red-400", "text-yellow-500", "text-blue-500", "text-green-600"][strength]}`}>
              {strengthLabel} password
            </p>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="flex items-start gap-3 cursor-pointer">
          <div
            onClick={() => setAgreed(!agreed)}
            className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer ${
              agreed ? "bg-primary border-primary" : "border-gray-300"
            }`}
          >
            <AnimatePresence>
              {agreed && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Check className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <span className="text-xs text-gray-600 leading-relaxed">
            I agree to AL-FATAH MART&apos;s{" "}
            <span className="text-primary font-semibold cursor-pointer hover:underline">Terms of Service</span>{" "}
            and{" "}
            <span className="text-primary font-semibold cursor-pointer hover:underline">Privacy Policy</span>
          </span>
        </label>
        {errors.agreed && (
          <p className="text-red-500 text-xs font-medium">{errors.agreed}</p>
        )}
      </div>

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-3 py-3.5 bg-green-50 border border-green-200 rounded-2xl text-green-700 font-semibold text-sm"
          >
            <Check className="w-5 h-5" />
            Account created! Welcome aboard 🎉
          </motion.div>
        ) : (
          <motion.button
            key="btn"
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="btn-shine w-full py-3.5 rounded-2xl bg-gradient-to-r from-accent to-accent-light text-white font-bold text-sm tracking-wide shadow-lg shadow-accent/30 hover:shadow-accent/50 transition-all flex items-center justify-center gap-2 disabled:opacity-80"
          >
            {loading ? (
              <motion.div
                className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <>Create Account <ArrowRight className="w-4 h-4" /></>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <button type="button" onClick={onSwitch} className="text-primary font-bold hover:underline">
          Sign In
        </button>
      </p>
    </form>
  );
}

/* ──────────────────────────────────────────────────────────
   Main exported component
────────────────────────────────────────────────────────── */
export default function AuthScreen() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-10">
      {/* Gradient background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, #e6f7f7 0%, #f8f9fb 40%, #fff5ee 100%)",
        }}
      />

      {/* Floating food particles */}
      <Particles />

      {/* Decorative blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-25 -z-10"
        style={{ background: "radial-gradient(circle, #007a7a 0%, transparent 70%)" }} />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-20 -z-10"
        style={{ background: "radial-gradient(circle, #ff7700 0%, transparent 70%)" }} />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="w-full max-w-4xl bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-black/10 overflow-hidden border border-white"
        style={{ boxShadow: "0 32px 80px rgba(0,122,122,0.12), 0 8px 24px rgba(0,0,0,0.06)" }}
      >
        <div className="grid md:grid-cols-2">
          {/* ── Left panel: mascot + brand ── */}
          <div
            className="relative hidden md:flex flex-col items-center justify-center p-10 overflow-hidden"
            style={{
              background:
                "linear-gradient(160deg, #007a7a 0%, #00a3a3 55%, #005757 100%)",
            }}
          >
            {/* Inner glow circles */}
            <div className="absolute top-10 right-10 w-32 h-32 rounded-full opacity-15"
              style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }} />
            <div className="absolute bottom-16 left-6 w-24 h-24 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, #ff7700 0%, transparent 70%)" }} />

            {/* Brand */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <h2 className="text-white text-3xl font-extrabold tracking-tighter font-heading">
                AL-FATAH
                <span className="text-orange-300"> MART</span>
              </h2>
              <p className="text-teal-100 text-xs font-semibold uppercase tracking-widest mt-1">
                Pakistan&apos;s Finest Store
              </p>
            </motion.div>

            {/* 3D Mascot */}
            <Mascot3D />

            {/* Feature pills */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-10 flex flex-col gap-2.5 w-full"
            >
              {[
                { icon: "🚚", text: "Free delivery over Rs. 2,000" },
                { icon: "🏷️", text: "Exclusive member discounts" },
                { icon: "🔒", text: "Secure & trusted checkout" },
              ].map(({ icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-2.5 border border-white/20 backdrop-blur-sm"
                >
                  <span className="text-lg">{icon}</span>
                  <span className="text-white/90 text-xs font-medium">{text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right panel: form ── */}
          <div className="p-8 md:p-10 flex flex-col justify-center">
            {/* Mobile brand */}
            <div className="flex md:hidden items-center gap-2 mb-6">
              <span className="text-primary text-xl font-extrabold tracking-tighter font-heading">
                AL-FATAH<span className="text-accent"> MART</span>
              </span>
            </div>

            {/* Tab switcher */}
            <div className="flex bg-gray-100 p-1 rounded-2xl mb-7 relative">
              <motion.div
                className="absolute top-1 bottom-1 rounded-xl bg-white shadow-md"
                animate={{ x: mode === "signin" ? 0 : "100%", width: "50%" }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
              {(["signin", "signup"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 relative z-10 py-2.5 rounded-xl text-sm font-bold transition-colors duration-200 ${
                    mode === m ? "text-primary" : "text-gray-400"
                  }`}
                >
                  {m === "signin" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            {/* Animated form */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: mode === "signin" ? -24 : 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: mode === "signin" ? 24 : -24 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
              >
                <div className="mb-6">
                  <h3 className="text-2xl font-extrabold text-gray-900 font-heading">
                    {mode === "signin" ? "Welcome back! 👋" : "Join us today! 🎉"}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {mode === "signin"
                      ? "Sign in to continue shopping at AL-FATAH MART."
                      : "Create your account and start saving on premium products."}
                  </p>
                </div>

                {mode === "signin" ? (
                  <SignInForm onSwitch={() => setMode("signup")} />
                ) : (
                  <SignUpForm onSwitch={() => setMode("signin")} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Back to home link */}
      <motion.div
        className="absolute top-6 left-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary font-semibold transition-colors bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 shadow-sm"
        >
          ← Back to Store
        </Link>
      </motion.div>
    </div>
  );
}
