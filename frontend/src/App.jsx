import {
  FileText,
  Layers,
  Scissors,
  Stamp,
  Image as ImageIcon,
  Wand2,
  Minimize2,
  Video,
  Music,
  CheckCircle2,
  ArrowUpRight,
  FileSpreadsheet,
  UploadCloud,
  Download,
  Settings2,
  Sparkles,
  ChevronRight,
  Cpu,
  Menu,
  X,
  ChevronDown,
  Key,
  Copy,
  Check,
  Terminal,
  Globe,
  Shield,
  LayoutGrid,
  BookOpen,
  LogIn,
  Clock,
  Zap,
  BarChart2,
  Search,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { UserContext } from "./usercontext.jsx";
import { useContext } from "react";
import LoginPage from "./LoginPage";
import ProfileModal from "./ProfileModal";

const APP_NAME = "AlloyDocs";
const API_BASE_URL_nodejs = import.meta.env.VITE_API_BASE_URL_nodejs;

/* ─── Tool catalogue ─────────────────────────────────────── */
const toolCategories = [
  {
    title: "PDF Tools",
    theme: "rose",
    accent: "#f43f5e",
    tools: [
      {
        id: "pdf-to-word",
        basename: "pdf",
        reqname: "convert_word",
        name: "PDF to Word",
        desc: "Convert to editable Word",
        icon: <FileText />,
      },
      {
        id: "word-to-pdf",
        basename: "word",
        reqname: "convert_pdf",
        name: "Word to PDF",
        desc: "Convert Word to PDF",
        icon: <FileText />,
      },
      {
        id: "merge-pdf",
        basename: "pdf",
        reqname: "merge",
        name: "Merge PDF",
        desc: "Combine multiple PDFs",
        icon: <Layers />,
        multi: true,
      },
      {
        id: "split-pdf",
        basename: "pdf",
        reqname: "split",
        name: "Split PDF",
        desc: "Extract page ranges",
        icon: <Scissors />,
      },
      {
        id: "watermark-pdf",
        basename: "pdf",
        reqname: "watermark",
        name: "Watermark PDF",
        desc: "Stamp text on pages",
        icon: <Stamp />,
      },
    ],
  },
  {
    title: "Image Studio",
    theme: "indigo",
    accent: "#6366f1",
    tools: [
      {
        id: "remove-bg",
        basename: "image",
        reqname: "remove_bg",
        name: "Remove Background",
        desc: "AI background removal",
        icon: <Wand2 />,
      },
      {
        id: "resize-image",
        basename: "image",
        reqname: "resize",
        name: "Resize Image",
        desc: "Scale to exact dimensions",
        icon: <Minimize2 />,
      },
      {
        id: "watermark-image",
        basename: "image",
        reqname: "logo_watermark",
        name: "Watermark Image",
        desc: "Brand with your logo",
        icon: <Stamp />,
      },
    ],
  },
  {
    title: "Video Lab",
    theme: "violet",
    accent: "#8b5cf6",
    tools: [
      {
        id: "merge-video",
        basename: "video",
        reqname: "merge",
        name: "Merge Video",
        desc: "Join clips together",
        icon: <Video />,
        multi: true,
      },
      {
        id: "trim-video",
        basename: "video",
        reqname: "trim",
        name: "Trim Video",
        desc: "Cut unwanted footage",
        icon: <Scissors />,
      },
      {
        id: "extract-audio",
        basename: "video",
        reqname: "extract_audio",
        name: "Extract Audio",
        desc: "Pull MP3 from video",
        icon: <Music />,
      },
      {
        id: "add-audio-video",
        basename: "video",
        reqname: "add_audio",
        name: "Add Audio",
        desc: "Replace video audio",
        icon: <Music />,
      },
    ],
  },
  {
    title: "Audio Suite",
    theme: "emerald",
    accent: "#10b981",
    tools: [
      {
        id: "convert-audio",
        basename: "audio",
        reqname: "convert",
        name: "Convert Audio",
        desc: "Change audio format",
        icon: <Music />,
      },
      {
        id: "trim-audio",
        basename: "audio",
        reqname: "trim",
        name: "Trim Audio",
        desc: "Shorten clips",
        icon: <Scissors />,
      },
    ],
  },
  {
    title: "Data Tools",
    theme: "cyan",
    accent: "#06b6d4",
    tools: [
      {
        id: "excel-to-csv",
        basename: "excel",
        reqname: "to_csv",
        name: "Excel to CSV",
        desc: "Spreadsheet to raw data",
        icon: <FileSpreadsheet />,
      },
    ],
  },
];

const docSections = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: <Globe size={14} />,
    content: [
      { title: "Base URL", value: API_BASE_URL_nodejs },
      { title: "Protocol", value: "HTTP POST only" },
      { title: "Content-Type", value: "multipart/form-data" },
      { title: "Response", value: "Binary file or JSON error" },
    ],
  },
  {
    id: "pdf",
    title: "PDF Endpoints",
    icon: <FileText size={14} />,
    endpoints: [
      {
        name: "Convert PDF to Word",
        path: "/pdf/convert_word",
        inputs: [{ key: "file", type: "PDF", req: true }],
      },
      {
        name: "Convert Word to PDF",
        path: "/word/convert_pdf",
        inputs: [{ key: "file", type: "DOC/DOCX", req: true }],
      },
      {
        name: "Merge PDFs",
        path: "/pdf/merge",
        inputs: [{ key: "files", type: "Multiple PDFs", req: true }],
        note: "Order matches upload order",
      },
      {
        name: "Split PDF",
        path: "/pdf/split",
        inputs: [
          { key: "file", type: "PDF", req: true },
          { key: "start", type: "Number", req: true },
          { key: "end", type: "Number", req: true },
        ],
      },
      {
        name: "Watermark PDF",
        path: "/pdf/watermark",
        inputs: [
          { key: "file", type: "PDF", req: true },
          { key: "text", type: "String", req: true },
        ],
      },
    ],
  },
  {
    id: "image",
    title: "Image Endpoints",
    icon: <ImageIcon size={14} />,
    endpoints: [
      {
        name: "Remove Background",
        path: "/image/remove_bg",
        inputs: [{ key: "file", type: "Image", req: true }],
      },
      {
        name: "Resize Image",
        path: "/image/resize",
        inputs: [
          { key: "file", type: "Image", req: true },
          { key: "width", type: "px", req: true },
          { key: "height", type: "px", req: true },
        ],
      },
      {
        name: "Logo Watermark",
        path: "/image/logo_watermark",
        inputs: [
          { key: "file", type: "Base image", req: true },
          { key: "watermark", type: "Logo PNG", req: true },
          { key: "scale", type: "Float", req: true },
          { key: "opacity", type: "0–255", req: true },
        ],
      },
    ],
  },
  {
    id: "video",
    title: "Video Endpoints",
    icon: <Video size={14} />,
    endpoints: [
      {
        name: "Merge Videos",
        path: "/video/merge",
        inputs: [{ key: "files", type: "Multiple MP4s", req: true }],
      },
      {
        name: "Trim Video",
        path: "/video/trim",
        inputs: [
          { key: "file", type: "Video", req: true },
          { key: "start", type: "Seconds", req: true },
          { key: "end", type: "Seconds", req: true },
        ],
      },
      {
        name: "Add Audio to Video",
        path: "/video/add_audio",
        inputs: [
          { key: "video", type: "Video file", req: true },
          { key: "audio", type: "Audio file", req: true },
        ],
      },
      {
        name: "Extract Audio",
        path: "/video/extract_audio",
        inputs: [{ key: "file", type: "Video", req: true }],
      },
    ],
  },
  {
    id: "audio",
    title: "Audio Endpoints",
    icon: <Music size={14} />,
    endpoints: [
      {
        name: "Convert Audio",
        path: "/audio/convert",
        inputs: [
          { key: "file", type: "Audio", req: true },
          { key: "format", type: "mp3/wav/aac", req: true },
        ],
      },
      {
        name: "Trim Audio",
        path: "/audio/trim",
        inputs: [
          { key: "file", type: "Audio", req: true },
          { key: "start", type: "Seconds", req: true },
          { key: "end", type: "Seconds", req: true },
        ],
      },
    ],
  },
  {
    id: "excel",
    title: "Excel Endpoints",
    icon: <FileSpreadsheet size={14} />,
    endpoints: [
      {
        name: "Excel to CSV",
        path: "/excel/to_csv",
        inputs: [
          { key: "file", type: "XLSX", req: true },
          { key: "sheet", type: "Index/Name", req: false },
        ],
      },
    ],
  },
];

/* ─── Theme lookup ───────────────────────────────────────── */
const T = {
  rose: {
    accent: "#f43f5e",
    iconBg: "rgba(244,63,94,0.1)",
    iconColor: "#f43f5e",
    tagBg: "rgba(244,63,94,0.08)",
    tagBorder: "rgba(244,63,94,0.2)",
    tagColor: "#f43f5e",
  },
  indigo: {
    accent: "#6366f1",
    iconBg: "rgba(99,102,241,0.1)",
    iconColor: "#6366f1",
    tagBg: "rgba(99,102,241,0.08)",
    tagBorder: "rgba(99,102,241,0.2)",
    tagColor: "#818cf8",
  },
  violet: {
    accent: "#8b5cf6",
    iconBg: "rgba(139,92,246,0.1)",
    iconColor: "#8b5cf6",
    tagBg: "rgba(139,92,246,0.08)",
    tagBorder: "rgba(139,92,246,0.2)",
    tagColor: "#a78bfa",
  },
  emerald: {
    accent: "#10b981",
    iconBg: "rgba(16,185,129,0.1)",
    iconColor: "#10b981",
    tagBg: "rgba(16,185,129,0.08)",
    tagBorder: "rgba(16,185,129,0.2)",
    tagColor: "#34d399",
  },
  cyan: {
    accent: "#06b6d4",
    iconBg: "rgba(6,182,212,0.1)",
    iconColor: "#06b6d4",
    tagBg: "rgba(6,182,212,0.08)",
    tagBorder: "rgba(6,182,212,0.2)",
    tagColor: "#22d3ee",
  },
};

/* ─── Sidebar ────────────────────────────────────────────── */
const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, apiKey } = useContext(UserContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const go = (path) => {
    navigate(path);
    onClose?.();
  };
  const isActive = (path) => location.pathname === path;

  const catIcons = [
    <FileText size={13} />,
    <ImageIcon size={13} />,
    <Video size={13} />,
    <Music size={13} />,
    <FileSpreadsheet size={13} />,
  ];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`
        fixed top-0 left-0 h-full z-40 w-[220px] flex flex-col
        bg-[#09090b] border-r border-[#1f1f23]
        transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:z-auto
      `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-[18px] border-b border-[#1f1f23]">
          <Link to="/" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="w-7 h-7 bg-white rounded-[7px] flex items-center justify-center flex-shrink-0">
              <Cpu size={14} strokeWidth={2.5} className="text-[#09090b]" />
            </div>
            <span className="text-[15px] font-bold text-white tracking-[-0.3px]">
              {APP_NAME}
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-zinc-600 hover:text-zinc-300 p-1"
          >
            <X size={15} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-px">
          <SLink
            to="/"
            icon={<LayoutGrid size={13} />}
            label="All tools"
            active={isActive("/")}
            badge="20"
            onClick={onClose}
          />
          <SLink
            to="/docs"
            icon={<BookOpen size={13} />}
            label="API docs"
            active={isActive("/docs")}
            onClick={onClose}
          />

          {toolCategories.map((cat, idx) => {
            const t = T[cat.theme];
            const isOpen = expanded === idx;
            return (
              <div key={idx} className="pt-1">
                <button
                  onClick={() => setExpanded(isOpen ? null : idx)}
                  className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-[7px] text-[12px] text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04] transition-colors"
                >
                  <span style={{ color: t.accent }}>{catIcons[idx]}</span>
                  <span className="flex-1 text-left font-medium">
                    {cat.title}
                  </span>
                  <ChevronDown
                    size={11}
                    className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="ml-5 mt-0.5 space-y-px">
                    {cat.tools.map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => go(`/tool/${tool.id}`)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-[6px] text-[11.5px] font-medium transition-colors
                          ${
                            location.pathname === `/tool/${tool.id}`
                              ? "bg-white/10 text-zinc-100"
                              : "text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.03]"
                          }`}
                      >
                        {tool.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t border-[#1f1f23] p-2.5">
          {user ? (
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-[8px] hover:bg-white/[0.04] transition-colors"
            >
              <div className="relative flex-shrink-0">
                <img
                  src={user.photoURL || "https://via.placeholder.com/28"}
                  alt=""
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-white/10"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-[#09090b]" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-[12px] font-semibold text-zinc-200 truncate">
                  {user.displayName || "User"}
                </p>
                <p className="text-[10px] text-zinc-600">Pro plan</p>
              </div>
            </button>
          ) : (
            <Link
              to="/login"
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 w-full py-2 rounded-[8px] bg-white text-[12px] font-bold text-zinc-900 hover:bg-zinc-100 transition-colors"
            >
              <LogIn size={12} /> Sign in
            </Link>
          )}
        </div>
      </aside>
      {isProfileOpen && user && (
        <ProfileModal
          user={user}
          apiKey={apiKey}
          onClose={() => setIsProfileOpen(false)}
          onLogout={() => {
            logout();
            setIsProfileOpen(false);
            navigate("/");
          }}
        />
      )}
    </>
  );
};

const SLink = ({ to, icon, label, active, badge, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-[7px] text-[12px] font-medium transition-colors
      ${active ? "bg-white/10 text-zinc-100" : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]"}`}
  >
    {icon}
    {label}
    {badge && (
      <span className="ml-auto text-[10px] bg-[#1f1f23] text-zinc-600 px-1.5 py-0.5 rounded-[4px]">
        {badge}
      </span>
    )}
  </Link>
);

/* ─── Topbar ─────────────────────────────────────────────── */
const Topbar = ({ onMenu, title }) => {
  const [search, setSearch] = useState("");
  return (
    <header className="h-[52px] border-b border-[#1f1f23] flex items-center justify-between px-5 flex-shrink-0 bg-[#09090b]">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenu}
          className="lg:hidden text-zinc-500 hover:text-zinc-200 p-1"
        >
          <Menu size={17} />
        </button>
        <span className="text-[12px] text-zinc-600">
          <span className="text-zinc-500">AlloyDocs</span>
          {title && (
            <>
              {" "}
              <span className="mx-1.5">/</span>{" "}
              <span className="text-zinc-300">{title}</span>
            </>
          )}
        </span>
      </div>
      <div className="flex items-center gap-2 bg-[#111113] border border-[#27272a] rounded-[8px] px-3 py-1.5 w-48">
        <Search size={12} className="text-zinc-600 flex-shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tools…"
          className="bg-transparent border-none outline-none text-[12px] text-zinc-400 placeholder-zinc-600 w-full"
        />
        <span className="text-[10px] text-zinc-600 bg-[#1f1f23] border border-[#27272a] rounded-[3px] px-1 py-px font-mono flex-shrink-0">
          ⌘K
        </span>
      </div>
    </header>
  );
};

/* ─── Shell ──────────────────────────────────────────────── */
const Shell = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen bg-[#09090b] overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <Topbar onMenu={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

/* ─── Tool Card ──────────────────────────────────────────── */
const ToolCard = ({ tool, theme }) => {
  const navigate = useNavigate();
  const t = T[theme];
  return (
    <button
      onClick={() => navigate(`/tool/${tool.id}`)}
      className="group relative text-left bg-[#111113] border border-[#1f1f23] rounded-[10px] p-4
        hover:border-[#27272a] hover:bg-[#141417] transition-all duration-150 overflow-hidden"
      style={{ "--accent": t.accent }}
    >
      {/* Top accent line on hover */}
      <div
        className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        style={{ background: t.accent }}
      />
      <div
        className="w-8 h-8 rounded-[8px] flex items-center justify-center mb-3 flex-shrink-0"
        style={{ background: t.iconBg, color: t.iconColor }}
      >
        {React.cloneElement(tool.icon, { size: 15, strokeWidth: 2 })}
      </div>
      <p className="text-[12.5px] font-semibold text-zinc-200 mb-1 group-hover:text-white transition-colors">
        {tool.name}
      </p>
      <p className="text-[11px] text-zinc-600 leading-[1.4]">{tool.desc}</p>
      <ArrowUpRight
        size={13}
        className="absolute bottom-3 right-3 text-[#27272a] group-hover:text-zinc-500 transition-all duration-150 group-hover:-translate-y-px group-hover:translate-x-px"
      />
    </button>
  );
};

/* ─── Landing Page ───────────────────────────────────────── */
const LandingPage = () => {
  const [search, setSearch] = useState("");
  const allTools = toolCategories.flatMap((c) => c.tools).length;

  const filtered = toolCategories
    .map((cat) => ({
      ...cat,
      tools: cat.tools.filter(
        (t) =>
          !search ||
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.desc.toLowerCase().includes(search.toLowerCase()),
      ),
    }))
    .filter((cat) => cat.tools.length > 0);

  return (
    <div className="px-6 py-7 max-w-[1100px] mx-auto">
      {/* Header */}
      <div className="mb-7">
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold mb-4"
          style={{
            background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.15)",
            color: "#22c55e",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          All systems operational
        </div>
        <h1 className="text-[26px] font-bold text-white tracking-[-0.5px] mb-2">
          File Processing Suite
        </h1>
        <p className="text-[13px] text-zinc-500">
          {allTools}+ tools for PDFs, images, video, audio, and data — process
          files right in your browser.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2.5 mb-8">
        {[
          { val: `${allTools}+`, label: "Tools available" },
          { val: "5", label: "Categories" },
          { val: "Free", label: "No limits" },
          { val: "API", label: "Developer access" },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-[#111113] border border-[#1f1f23] rounded-[10px] px-4 py-3"
          >
            <p className="text-[20px] font-bold text-white tracking-[-0.5px]">
              {s.val}
            </p>
            <p className="text-[11px] text-zinc-600 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tool sections */}
      <div className="space-y-8">
        {filtered.map((cat, idx) => {
          const t = T[cat.theme];
          return (
            <section key={idx}>
              <div className="flex items-center gap-3 mb-3.5">
                <span
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background: t.tagBg,
                    border: `1px solid ${t.tagBorder}`,
                    color: t.tagColor,
                  }}
                >
                  {cat.title}
                </span>
                <div className="flex-1 h-px bg-[#1f1f23]" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {cat.tools.map((tool, i) => (
                  <ToolCard key={i} tool={tool} theme={cat.theme} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <footer className="mt-14 pt-6 border-t border-[#1f1f23] text-center text-[11px] text-zinc-700">
        © 2026 {APP_NAME} Inc. —{" "}
        <Link
          to="/docs"
          className="text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          API docs
        </Link>
      </footer>
    </div>
  );
};

const DField = ({ label, placeholder, value, onChange }) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-medium text-zinc-500">{label}</label>
    <input
      defaultValue={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-[8px] text-[12.5px] text-zinc-200
        placeholder-zinc-700 focus:outline-none focus:border-zinc-500 transition-colors"
    />
  </div>
);

const ToolPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const watermarkRef = useRef(null);
  const audioRef = useRef(null);
  const { apiKey } = useContext(UserContext);

  const [tool, setTool] = useState(null);
  const [category, setCategory] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [blobUrl, setBlobUrl] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [wmText, setWmText] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [scale, setScale] = useState("0.2");
  const [opacity, setOpacity] = useState("180");
  const [audioFormat, setAudioFormat] = useState("mp3");

  useEffect(() => {
    for (const cat of toolCategories) {
      const found = cat.tools.find((t) => t.id === id);
      if (found) {
        setTool(found);
        setCategory(cat);
        break;
      }
    }
  }, [id]);
  useEffect(
    () => () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    },
    [blobUrl],
  );

  const handleFiles = (files) => {
    if (!files?.length) return;
    setFileName(
      files.length > 1 ? `${files.length} files selected` : files[0].name,
    );
    if (fileRef.current) {
      const dt = new DataTransfer();
      Array.from(files).forEach((f) => dt.items.add(f));
      fileRef.current.files = dt.files;
    }
  };

  const configTools = [
    "split-pdf",
    "trim-video",
    "trim-audio",
    "watermark-pdf",
    "resize-image",
    "watermark-image",
    "add-audio-video",
    "convert-audio",
  ];

  const handleProcess = async () => {
    const files = fileRef.current?.files;
    if (!files?.length) return alert("Please select a file.");
    if (!apiKey) return alert("Generate an API key in API Docs first.");
    setLoading(true);
    setPreview(null);
    try {
      const fd = new FormData();
      if (tool.multi) {
        for (let f of files) fd.append("files", f);
      } else {
        fd.append("file", files[0]);
      }
      if (tool.id === "split-pdf") {
        fd.append("start", start);
        fd.append("end", end);
      }
      if (tool.id === "watermark-pdf") fd.append("text", wmText);
      if (tool.id === "resize-image") {
        fd.append("width", width);
        fd.append("height", height);
      }
      if (tool.id === "watermark-image") {
        fd.append("watermark", watermarkRef.current.files[0]);
        fd.append("scale", scale);
        fd.append("opacity", opacity);
      }
      if (tool.id === "add-audio-video")
        fd.append("audio", audioRef.current.files[0]);
      if (tool.id === "convert-audio") fd.append("format", audioFormat);
      if (["trim-video", "trim-audio"].includes(tool.id)) {
        fd.append("start", start);
        fd.append("end", end);
      }

      const res = await fetch(
        `${API_BASE_URL_nodejs}/${tool.basename}/${tool.reqname}`,
        {
          method: "POST",
          headers: { "x-api-key": apiKey },
          body: fd,
        },
      );
      if (!res.ok) throw new Error("Processing failed");
      const blob = await res.blob();
      const ct = res.headers.get("Content-Type") || "application/octet-stream";
      const url = URL.createObjectURL(new Blob([blob], { type: ct }));
      setPreview(url);
      setBlobUrl(url);
      if (ct.includes("pdf")) setFileType("pdf");
      else if (ct.startsWith("image")) setFileType("image");
      else if (ct.startsWith("video")) setFileType("video");
      else if (ct.startsWith("audio")) setFileType("audio");
      else if (
        ct.includes("wordprocessingml.document") ||
        ct.includes("msword")
      ) {
        setFileType("docx");
      } else setFileType("other");
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
  if (!preview) return;

  const extMap = {
    image: "png",
    pdf: "pdf",
    video: "mp4",
    audio: audioFormat || "mp3",
    docx: "docx",
    csv: "csv",
  };

  let ext = extMap[fileType];

  // fallback by tool if fileType isn't enough
  if (!ext) {
    if (tool.id === "pdf-to-word") ext = "docx";
    else if (tool.id === "word-to-pdf") ext = "pdf";
    else if (tool.id === "excel-to-csv") ext = "csv";
    else ext = "file";
  }

  const a = document.createElement("a");
  a.href = preview;
  a.download = `${APP_NAME}_${tool.name.replace(/\s+/g, "_")}.${ext}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

  if (!tool)
    return (
      <div className="flex items-center justify-center h-64 text-zinc-600 text-sm">
        Loading…
      </div>
    );

  const t = T[category?.theme || "indigo"];

  return (
    <div className="px-5 md:px-8 py-7 max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[11px] text-zinc-600 mb-6">
        <button
          onClick={() => navigate("/")}
          className="hover:text-zinc-300 transition-colors"
        >
          All tools
        </button>
        <ChevronRight size={11} />
        <span style={{ color: t.accent }}>{category?.title}</span>
        <ChevronRight size={11} />
        <span className="text-zinc-300">{tool.name}</span>
      </div>

      {/* Tool header */}
      <div className="flex items-center gap-4 mb-7">
        <div
          className="w-11 h-11 rounded-[12px] flex items-center justify-center flex-shrink-0"
          style={{ background: t.iconBg, color: t.iconColor }}
        >
          {React.cloneElement(tool.icon, { size: 20, strokeWidth: 2 })}
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-white tracking-[-0.4px]">
            {tool.name}
          </h1>
          <p className="text-[12px] text-zinc-500">{tool.desc}</p>
        </div>
      </div>

      {/* Card */}
      <div className="bg-[#111113] border border-[#1f1f23] rounded-[14px] overflow-hidden">
        <div className="p-6 space-y-5">
          {/* Dropzone */}
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFiles(e.dataTransfer.files);
            }}
            className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-[12px] cursor-pointer transition-all
              ${dragOver ? "border-zinc-500 bg-white/[0.03]" : "border-[#27272a] hover:border-zinc-600 hover:bg-white/[0.02]"}`}
          >
            <div className="w-10 h-10 rounded-full bg-[#1a1a1d] border border-[#27272a] flex items-center justify-center mb-2.5">
              <UploadCloud
                size={18}
                className={dragOver ? "text-zinc-300" : "text-zinc-600"}
              />
            </div>
            {fileName ? (
              <p className="text-[13px] font-semibold text-zinc-200">
                {fileName}
              </p>
            ) : (
              <>
                <p className="text-[12.5px] font-semibold text-zinc-400">
                  {tool.multi
                    ? "Drop files or click to browse"
                    : "Drop a file or click to browse"}
                </p>
                <p className="text-[11px] text-zinc-700 mt-1">
                  Select from your device
                </p>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              multiple={tool.multi}
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>

          {/* Config */}
          {configTools.includes(tool.id) && (
            <div className="bg-[#0d0d0f] border border-[#1f1f23] rounded-[10px] p-4 space-y-4">
              <p className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                <Settings2 size={11} /> Configuration
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {["split-pdf", "trim-video", "trim-audio"].includes(
                  tool.id,
                ) && (
                  <>
                    <DField
                      label={`Start ${tool.id.includes("pdf") ? "page" : "(sec)"}`}
                      placeholder="1"
                      onChange={setStart}
                    />
                    <DField
                      label={`End ${tool.id.includes("pdf") ? "page" : "(sec)"}`}
                      placeholder="5"
                      onChange={setEnd}
                    />
                  </>
                )}
                {tool.id === "watermark-pdf" && (
                  <div className="col-span-2">
                    <DField
                      label="Watermark text"
                      placeholder="Confidential"
                      onChange={setWmText}
                    />
                  </div>
                )}
                {tool.id === "resize-image" && (
                  <>
                    <DField
                      label="Width (px)"
                      placeholder="1920"
                      onChange={setWidth}
                    />
                    <DField
                      label="Height (px)"
                      placeholder="1080"
                      onChange={setHeight}
                    />
                  </>
                )}
                {tool.id === "watermark-image" && (
                  <div className="col-span-2 space-y-3">
                    <div>
                      <label className="text-[11px] font-medium text-zinc-500 block mb-1.5">
                        Logo file
                      </label>
                      <input
                        type="file"
                        ref={watermarkRef}
                        className="text-[11px] text-zinc-500 file:mr-2 file:py-1 file:px-3 file:rounded-[6px] file:border-0 file:text-[11px] file:font-semibold file:bg-[#1f1f23] file:text-zinc-300 hover:file:bg-[#27272a]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <DField
                        label="Scale (0–1)"
                        value={scale}
                        onChange={setScale}
                      />
                      <DField
                        label="Opacity (0–255)"
                        value={opacity}
                        onChange={setOpacity}
                      />
                    </div>
                  </div>
                )}
                {tool.id === "add-audio-video" && (
                  <div className="col-span-2">
                    <label className="text-[11px] font-medium text-zinc-500 block mb-1.5">
                      Audio file
                    </label>
                    <input
                      type="file"
                      ref={audioRef}
                      className="text-[11px] text-zinc-500 file:mr-2 file:py-1 file:px-3 file:rounded-[6px] file:border-0 file:text-[11px] file:font-semibold file:bg-[#1f1f23] file:text-zinc-300 hover:file:bg-[#27272a]"
                    />
                  </div>
                )}
                {tool.id === "convert-audio" && (
                  <div className="col-span-2">
                    <label className="text-[11px] font-medium text-zinc-500 block mb-1.5">
                      Target format
                    </label>
                    <select
                      onChange={(e) => setAudioFormat(e.target.value)}
                      className="px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-[8px] text-[12.5px] text-zinc-200 focus:outline-none focus:border-zinc-500"
                    >
                      <option value="mp3">MP3</option>
                      <option value="wav">WAV</option>
                      <option value="aac">AAC</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Run button */}
          <button
            onClick={handleProcess}
            disabled={loading}
            className="w-full py-3 rounded-[10px] text-[13px] font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.99]
              bg-white text-zinc-900 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_1px_0_0_rgba(255,255,255,0.1)]"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-800 rounded-full animate-spin" />{" "}
                Processing…
              </>
            ) : (
              <>
                <Sparkles size={14} /> Run {tool.name}
              </>
            )}
          </button>
        </div>

        {/* Result */}
        {preview && (
          <div className="border-t border-[#1f1f23] bg-[#0d0d0f] p-6 space-y-4">
            <div className="flex items-center gap-2 text-[12px] font-semibold text-zinc-300">
              <CheckCircle2 size={14} className="text-green-500" /> Result ready
            </div>
            <div className="bg-[#111113] border border-[#1f1f23] rounded-[10px] p-3 flex items-center justify-center min-h-[160px]">
              {fileType === "pdf" && (
                <iframe
                  src={preview}
                  className="w-full h-72 rounded"
                  title="Preview"
                />
              )}
              {fileType === "image" && (
                <img
                  src={preview}
                  className="max-w-full max-h-72 object-contain rounded"
                  alt="Result"
                />
              )}
              {fileType === "video" && (
                <video src={preview} controls className="w-full rounded" />
              )}
              {fileType === "audio" && (
                <audio src={preview} controls className="w-full" />
              )}
              {fileType === "other" && (
                <p className="text-zinc-600 text-[12px] italic">
                  Preview unavailable for this file type.
                </p>
              )}
            </div>
            <button
              onClick={handleDownload}
              className="w-full py-2.5 rounded-[10px] text-[13px] font-bold flex items-center justify-center gap-2
                border border-[#27272a] text-zinc-200 hover:bg-white/[0.04] hover:border-zinc-500 transition-colors active:scale-[0.99]"
            >
              <Download size={14} /> Download file
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Docs Page ──────────────────────────────────────────── */
const DocsPage = () => {
  const [active, setActive] = useState("getting-started");
  const [apiKey, setApiKey] = useState(null);
  const [keyRevealed, setKeyRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, setApiKey: setCtxKey } = useContext(UserContext);

  useEffect(() => {
    const k = localStorage.getItem("apiKey");
    if (k) setApiKey(k);
  }, []);

  const generate = async () => {
    if (!user) return alert("Sign in first.");
    setLoading(true);
    try {
      const pr = await (
        await fetch(
          `${import.meta.env.VITE_API_BASE_URL_python}/generate_apikey`,
          { method: "POST" },
        )
      ).json();
      const nr = await fetch(
        `${import.meta.env.VITE_API_BASE_URL_nodejs}/user/create-api-key`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.uid, api_keyy: pr.api_key }),
        },
      );
      if (!nr.ok) throw new Error("Storage failed");
      setApiKey(pr.api_key);
      setCtxKey(pr.api_key);
      setKeyRevealed(true);
    } catch (e) {
      alert("Failed: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="px-5 md:px-8 py-7 max-w-5xl mx-auto">
      <div className="mb-7">
        <div className="flex items-center gap-2 text-[11px] font-bold text-blue-500 uppercase tracking-widest mb-2">
          <Terminal size={12} /> Developer Console
        </div>
        <h1 className="text-[24px] font-bold text-white tracking-[-0.5px] mb-1.5">
          API Reference
        </h1>
        <p className="text-[12.5px] text-zinc-500">
          Stateless endpoints. Simple FormData. Binary response.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar nav */}
        <div className="lg:w-48 flex-shrink-0">
          <div className="lg:sticky lg:top-4 space-y-px">
            {docSections.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setActive(s.id);
                  document
                    .getElementById(s.id)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-[7px] text-[11.5px] font-medium transition-colors
                  ${active === s.id ? "bg-white text-zinc-900" : "text-zinc-600 hover:text-zinc-200 hover:bg-white/[0.05]"}`}
              >
                {s.icon}
                {s.title}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {/* Auth */}
          <div className="bg-[#111113] border border-[#1f1f23] rounded-[14px] p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-[#1a1a1d] border border-[#27272a] rounded-[8px] flex items-center justify-center text-zinc-400">
                <Key size={14} />
              </div>
              <div>
                <p className="text-[12.5px] font-semibold text-zinc-200">
                  Authentication
                </p>
                <p className="text-[11px] text-zinc-600">
                  Pass key via{" "}
                  <code className="bg-[#1f1f23] text-zinc-400 px-1 rounded text-[10px]">
                    x-api-key
                  </code>{" "}
                  header.
                </p>
              </div>
            </div>
            <div className="bg-[#0a0a0c] border border-[#1f1f23] rounded-[10px] px-4 py-2.5 flex items-center gap-3">
              <code className="font-mono text-green-400 text-[11.5px] flex-1 truncate">
                {keyRevealed && apiKey
                  ? apiKey
                  : "ad_live_••••••••••••••••••••••••"}
              </code>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={generate}
                  disabled={loading || !user}
                  className="px-2.5 py-1 text-[11px] font-semibold text-zinc-400 hover:text-white hover:bg-white/[0.06] rounded-[6px] transition-colors disabled:opacity-40"
                >
                  {loading ? "…" : keyRevealed ? "Regen" : "Generate"}
                </button>
                <button
                  onClick={copy}
                  disabled={!apiKey}
                  className="p-1.5 text-zinc-600 hover:text-white hover:bg-white/[0.06] rounded-[6px] transition-colors disabled:opacity-40"
                >
                  {copied ? (
                    <Check size={13} className="text-green-400" />
                  ) : (
                    <Copy size={13} />
                  )}
                </button>
              </div>
            </div>
            {!user && (
              <p className="text-[11px] text-amber-600 mt-2.5">
                Sign in to generate a key.
              </p>
            )}
          </div>

          {/* Sections */}
          <div className="bg-[#111113] border border-[#1f1f23] rounded-[14px] divide-y divide-[#1a1a1d]">
            {docSections.map((section) => (
              <div key={section.id} id={section.id} className="p-5 scroll-mt-4">
                <h2 className="flex items-center gap-2 text-[12.5px] font-bold text-zinc-300 mb-4">
                  <span className="text-zinc-600">{section.icon}</span>
                  {section.title}
                </h2>

                {section.id === "getting-started" ? (
                  <div className="space-y-2">
                    {section.content.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 bg-[#0d0d0f] border border-[#1f1f23] rounded-[8px] px-4 py-2.5"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 w-28 flex-shrink-0">
                          {item.title}
                        </span>
                        <code className="text-[11px] text-zinc-400 font-mono">
                          {item.value}
                        </code>
                      </div>
                    ))}
                    <div className="mt-2 p-3 border-l-2 border-amber-500 bg-amber-950/30 rounded-r-[6px] text-[11px] text-amber-400">
                      Always use{" "}
                      <code className="bg-amber-950/50 px-1 rounded">
                        FormData
                      </code>
                      . Multi-file keys use{" "}
                      <code className="bg-amber-950/50 px-1 rounded">
                        files
                      </code>{" "}
                      (plural). Never set Content-Type manually.
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {section.endpoints.map((ep, i) => (
                      <div key={i}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-green-950/50 text-green-400 border border-green-900/50 rounded uppercase">
                            POST
                          </span>
                          <code className="text-[11px] font-mono text-zinc-500 bg-[#0d0d0f] px-2 py-0.5 rounded-[5px]">
                            {ep.path}
                          </code>
                        </div>
                        <p className="text-[12.5px] font-semibold text-zinc-300 mb-3">
                          {ep.name}
                        </p>
                        <table className="w-full text-[11px] border-collapse">
                          <thead>
                            <tr className="border-b border-[#1f1f23] text-zinc-600">
                              <th className="text-left py-1.5 font-semibold w-1/3">
                                Key
                              </th>
                              <th className="text-left py-1.5 font-semibold w-1/3">
                                Type
                              </th>
                              <th className="text-left py-1.5 font-semibold">
                                Required
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#141416]">
                            {ep.inputs.map((inp, j) => (
                              <tr key={j}>
                                <td className="py-2 font-mono text-zinc-400">
                                  {inp.key}
                                </td>
                                <td className="py-2 text-zinc-600">
                                  {inp.type}
                                </td>
                                <td className="py-2">
                                  {inp.req ? (
                                    <span className="px-2 py-0.5 bg-rose-950/40 text-rose-400 border border-rose-900/40 rounded-full text-[10px] font-bold">
                                      Required
                                    </span>
                                  ) : (
                                    <span className="text-zinc-700">
                                      Optional
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {ep.note && (
                          <p className="mt-2 text-[10.5px] text-zinc-700 italic">
                            Note: {ep.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── App Root ───────────────────────────────────────────── */
const AppRoutes = () => {
  const location = useLocation();
  const getTitle = () => {
    if (location.pathname === "/docs") return "API docs";
    if (location.pathname.startsWith("/tool/")) {
      const id = location.pathname.split("/tool/")[1];
      for (const cat of toolCategories) {
        const t = cat.tools.find((t) => t.id === id);
        if (t) return t.name;
      }
    }
    return null;
  };
  return (
    <Shell title={getTitle()}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tool/:id" element={<ToolPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Shell>
  );
};

const App = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default App;
