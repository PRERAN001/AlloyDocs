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
  ArrowRight,
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
  Code2
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { UserContext } from "./usercontext.jsx";
import { useContext } from "react";
// --- Configuration & Data ---
import LoginPage from "./LoginPage";
import ProfileModal from "./ProfileModal";
const APP_NAME = "AlloyDocs";

const API_BASE_URL_nodejs =import.meta.env.VITE_API_BASE_URL_nodejs
const toolCategories = [
  {
    title: "PDF Tools",
    theme: "rose",
    description: "Manage and manipulate PDF documents.",
    tools: [
      { id: "pdf-to-word", basename: "pdf", reqname: "convert_word", name: "PDF to Word", desc: "Convert PDF to editable Word", icon: <FileText /> },
      { id: "word-to-pdf", basename: "word", reqname: "convert_pdf", name: "Word to PDF", desc: "Convert Word to PDF", icon: <FileText /> },
      { id: "merge-pdf", basename: "pdf", reqname: "merge", name: "Merge PDF", desc: "Combine multiple PDFs into one", icon: <Layers />, multi: true },
      { id: "split-pdf", basename: "pdf", reqname: "split", name: "Split PDF", desc: "Extract specific pages", icon: <Scissors /> },
      { id: "watermark-pdf", basename: "pdf", reqname: "watermark", name: "Watermark PDF", desc: "Stamp text on pages", icon: <Stamp /> },
    ],
  },
  {
    title: "Image Studio",
    theme: "indigo",
    description: "Enhance and transform your images.",
    tools: [
      { id: "remove-bg", basename: "image", reqname: "remove_bg", name: "Remove Background", desc: "AI-powered background removal", icon: <Wand2 /> },
      { id: "resize-image", basename: "image", reqname: "resize", name: "Resize Image", desc: "Scale dimensions instantly", icon: <Minimize2 /> },
      { id: "watermark-image", basename: "image", reqname: "logo_watermark", name: "Watermark Image", desc: "Brand your visuals", icon: <Stamp /> },
    ],
  },
  {
    title: "Video Lab",
    theme: "violet",
    description: "Process video files seamlessly.",
    tools: [
      { id: "merge-video", basename: "video", reqname: "merge", name: "Merge Video", desc: "Join clips together", icon: <Video />, multi: true },
      { id: "trim-video", basename: "video", reqname: "trim", name: "Trim Video", desc: "Cut unwanted footage", icon: <Scissors /> },
      { id: "extract-audio", basename: "video", reqname: "extract_audio", name: "Extract Audio", desc: "Get MP3 from MP4", icon: <Music /> },
       { id: "add-audio-video", basename: "video", reqname: "add_audio", name: "Add Audio", desc: "Replace video audio track", icon: <Music /> },
    ],
  },
  {
    title: "Audio Suite",
    theme: "emerald",
    description: "Convert and edit audio tracks.",
    tools: [
      { id: "convert-audio", basename: "audio", reqname: "convert", name: "Convert Audio", desc: "Change audio formats", icon: <Music /> },
      { id: "trim-audio", basename: "audio", reqname: "trim", name: "Trim Audio", desc: "Shorten audio clips", icon: <Scissors /> },
    ],
  },
  {
    title: "Data Tools",
    theme: "cyan",
    description: "Spreadsheet conversions made easy.",
    tools: [
      { id: "excel-to-csv", basename: "excel", reqname: "to_csv", name: "Excel to CSV", desc: "Spreadsheet to raw data", icon: <FileSpreadsheet /> },
    ],
  },
];

const docSections = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: <Globe size={18} />,
    content: [
      { title: "Base URL", value: API_BASE_URL_nodejs },
      { title: "Protocol", value: "HTTP POST only" },
      { title: "Content Type", value: "multipart/form-data" },
      { title: "Response", value: "Binary file (Content-Disposition: attachment) or JSON Error" },
    ]
  },
  {
    id: "pdf",
    title: "PDF Endpoints",
    icon: <FileText size={18} />,
    endpoints: [
      { name: "Convert PDF to Word", path: "/pdf/convert_word", inputs: [{ key: "file", type: "PDF", req: true }] },
      { name: "Convert Word to PDF", path: "/word/convert_pdf", inputs: [{ key: "file", type: "DOC/DOCX", req: true }] },
      { name: "Merge PDFs", path: "/pdf/merge", inputs: [{ key: "files", type: "Multiple PDFs", req: true }], note: "Order matches upload order" },
      { name: "Split PDF", path: "/pdf/split", inputs: [{ key: "file", type: "PDF", req: true }, { key: "start", type: "Number", req: true }, { key: "end", type: "Number", req: true }] },
      { name: "Watermark PDF", path: "/pdf/watermark", inputs: [{ key: "file", type: "PDF", req: true }, { key: "text", type: "String", req: true }] },
    ]
  },
  {
    id: "image",
    title: "Image Endpoints",
    icon: <ImageIcon size={18} />,
    endpoints: [
      { name: "Remove Background", path: "/image/remove_bg", inputs: [{ key: "file", type: "Image", req: true }] },
      { name: "Resize Image", path: "/image/resize", inputs: [{ key: "file", type: "Image", req: true }, { key: "width", type: "Px", req: true }, { key: "height", type: "Px", req: true }] },
      { name: "Logo Watermark", path: "/image/logo_watermark", inputs: [{ key: "file", type: "Base Image", req: true }, { key: "watermark", type: "Logo PNG", req: true }, { key: "scale", type: "Float (e.g., 0.2)", req: true }, { key: "opacity", type: "0-255", req: true }] },
    ]
  },
  {
    id: "video",
    title: "Video Endpoints",
    icon: <Video size={18} />,
    endpoints: [
      { name: "Merge Videos", path: "/video/merge", inputs: [{ key: "files", type: "Multiple MP4s", req: true }] },
      { name: "Trim Video", path: "/video/trim", inputs: [{ key: "file", type: "Video", req: true }, { key: "start", type: "Seconds", req: true }, { key: "end", type: "Seconds", req: true }] },
      { name: "Add Audio to Video", path: "/video/add_audio", inputs: [{ key: "video", type: "Video File", req: true }, { key: "audio", type: "Audio File", req: true }] },
      { name: "Extract Audio", path: "/video/extract_audio", inputs: [{ key: "file", type: "Video", req: true }] },
    ]
  },
  {
    id: "audio",
    title: "Audio Endpoints",
    icon: <Music size={18} />,
    endpoints: [
      { name: "Convert Audio", path: "/audio/convert", inputs: [{ key: "file", type: "Audio", req: true }, { key: "format", type: "mp3/wav/aac", req: true }] },
      { name: "Trim Audio", path: "/audio/trim", inputs: [{ key: "file", type: "Audio", req: true }, { key: "start", type: "Seconds", req: true }, { key: "end", type: "Seconds", req: true }] },
    ]
  },
  {
    id: "excel",
    title: "Excel Endpoints",
    icon: <FileSpreadsheet size={18} />,
    endpoints: [
      { name: "Excel to CSV", path: "/excel/to_csv", inputs: [{ key: "file", type: "XLSX", req: true }, { key: "sheet", type: "Index/Name", req: false }] },
    ]
  }
];

// --- Utilities ---
const useTypewriter = (textArray, typingSpeed = 80, deletingSpeed = 40, pauseDuration = 2000) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const handleTyping = () => {
      const currentFullText = textArray[index % textArray.length];
      if (isDeleting) {
        setDisplayedText(currentFullText.substring(0, displayedText.length - 1));
      } else {
        setDisplayedText(currentFullText.substring(0, displayedText.length + 1));
      }
      if (!isDeleting && displayedText === currentFullText) {
        setTimeout(() => setIsDeleting(true), pauseDuration);
      } else if (isDeleting && displayedText === "") {
        setIsDeleting(false);
        setIndex((prev) => prev + 1);
      }
    };
    const timer = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, index, textArray, typingSpeed, deletingSpeed, pauseDuration]);

  return displayedText;
};

// --- Components ---
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, apiKey } = useContext(UserContext);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToolClick = (toolId) => {
    setIsToolsOpen(false);
    setIsMobileMenuOpen(false);
    navigate(`/tool/${toolId}`);
  };

  const handleLogout = () => {
    logout();
    setIsProfileModalOpen(false);
    navigate("/");
  };

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled || isToolsOpen
          ? "bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
      onMouseLeave={() => setIsToolsOpen(false)}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-3 group z-20"
          onClick={() => setIsToolsOpen(false)}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <Cpu size={20} strokeWidth={2.5} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            {APP_NAME}
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8 h-full">
          {/* Tools Dropdown Trigger */}
          <button
            onClick={() => setIsToolsOpen(!isToolsOpen)}
            className={`flex items-center gap-1.5 text-sm font-bold transition-colors h-full border-b-2 ${
              isToolsOpen
                ? "text-blue-600 border-blue-600"
                : "text-slate-600 border-transparent hover:text-blue-600"
            }`}
          >
            All Tools
            <ChevronDown
              size={14}
              className={`transition-transform duration-300 ${
                isToolsOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <Link
            to="/docs"
            className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
          >
            Developers API
          </Link>

          {/* FIX 2: Conditional Rendering for Auth */}
          <div className="w-px h-6 bg-slate-200 mx-2"></div>

          {user ? (
            // LOGGED IN STATE
            <div className="flex items-center gap-3 pl-2 group relative">
              <div className="flex flex-col items-end mr-2">
                <span className="text-sm font-bold text-slate-700 leading-none">
                  {user.displayName || "User"}
                </span>
                <span className="text-[10px] font-medium text-slate-400">
                  Pro Plan
                </span>
              </div>
              
              {/* User Avatar Circle - Clickable for Profile */}
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="relative w-10 h-10 rounded-full ring-2 ring-white shadow-md cursor-pointer hover:ring-blue-200 transition-all duration-300 flex-shrink-0"
              >
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img
                    src={user.photoURL || "https://via.placeholder.com/40"}
                    alt="User Profile"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </button>
            </div>
          ) : (
            // LOGGED OUT STATE
            <Link
              to="/login"
              className="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/20 transition-all duration-300"
            >
              Log in
            </Link>
          )}
        </div>

        {/* MOBILE HAMBURGER */}
        <button
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors z-20"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MEGA MENU (TOOLS) */}
      <div
        className={`hidden md:block absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl transition-all duration-300 origin-top overflow-hidden ${
          isToolsOpen
            ? "opacity-100 translate-y-0 max-h-[80vh]"
            : "opacity-0 -translate-y-4 max-h-0 pointer-events-none"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-5 gap-8">
            {toolCategories.map((category, idx) => (
              <div key={idx} className="space-y-4">
                <h3
                  className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${
                    category.theme === "rose"
                      ? "text-rose-600"
                      : category.theme === "indigo"
                      ? "text-indigo-600"
                      : category.theme === "violet"
                      ? "text-violet-600"
                      : category.theme === "emerald"
                      ? "text-emerald-600"
                      : "text-cyan-600"
                  }`}
                >
                  {category.title}
                </h3>
                <ul className="space-y-2">
                  {category.tools.map((tool) => (
                    <li key={tool.id}>
                      <button
                        onClick={() => handleToolClick(tool.id)}
                        className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors group text-left"
                      >
                        <div
                          className={`p-1.5 rounded-md text-white transition-transform group-hover:scale-110 ${
                            category.theme === "rose"
                              ? "bg-rose-500"
                              : category.theme === "indigo"
                              ? "bg-indigo-500"
                              : category.theme === "violet"
                              ? "bg-violet-500"
                              : category.theme === "emerald"
                              ? "bg-emerald-500"
                              : "bg-cyan-500"
                          }`}
                        >
                          {React.cloneElement(tool.icon, { size: 14 })}
                        </div>
                        <span className="text-sm font-medium">{tool.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center bg-slate-50/50 -mx-6 px-6 -mb-10 py-4">
            <p className="text-xs text-slate-400 font-medium">
              Over 20+ tools available for free
            </p>
            <Link
              to="/docs"
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              Read API Documentation <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      <div
        className={`md:hidden fixed inset-0 top-20 bg-white z-10 overflow-y-auto transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 space-y-8 pb-20">
          <Link
            to="/docs"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2 text-blue-600 font-bold bg-blue-50 p-4 rounded-xl"
          >
            <Terminal size={20} /> Developer API Docs
          </Link>
          
          {/* Mobile Login Button */}
          {!user && (
             <Link
             to="/login"
             onClick={() => setIsMobileMenuOpen(false)}
             className="flex items-center justify-center w-full py-3 bg-slate-900 text-white font-bold rounded-xl"
           >
             Log In
           </Link>
          )}

          {toolCategories.map((category, idx) => (
            <div key={idx}>
              <h3
                className={`text-xs font-bold uppercase tracking-wider mb-3 ${
                  category.theme === "rose"
                    ? "text-rose-600"
                    : category.theme === "indigo"
                    ? "text-indigo-600"
                    : category.theme === "violet"
                    ? "text-violet-600"
                    : category.theme === "emerald"
                    ? "text-emerald-600"
                    : "text-cyan-600"
                }`}
              >
                {category.title}
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {category.tools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => handleToolClick(tool.id)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 active:scale-95 transition-all text-left"
                  >
                    <div className="text-slate-500">
                      {React.cloneElement(tool.icon, { size: 18 })}
                    </div>
                    <span className="text-sm font-semibold text-slate-700">
                      {tool.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {isProfileModalOpen && user && (
      <ProfileModal
        user={user}
        apiKey={apiKey}
        onClose={() => setIsProfileModalOpen(false)}
        onLogout={handleLogout}
      />
    )}
    </nav>
    
    
    
  );
};

const DocsPage = () => {
    const [activeSection, setActiveSection] = useState("getting-started");
    const [apiKey, setApiKey] = useState(null);
    const [keyRevealed, setKeyRevealed] = useState(false);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user, setApiKey: setContextApiKey } = useContext(UserContext);
    
    // Load API key from context on mount
    useEffect(() => {
      const storedKey = localStorage.getItem("apiKey");
      if (storedKey) {
        setApiKey(storedKey);
      }
    }, []);

    // Generate and store API key
    const generateKey = async () => {
      if (!user) {
        alert("Please login first to generate an API key.");
        return;
      }

      setLoading(true);
      try {
        // Step 1: Get API key from Python backend
        const pythonRes = await fetch("http://127.0.0.1:5000/generate_apikey", {
          method: "POST",
        });
        const pythonData = await pythonRes.json();
        const generatedKey = pythonData.api_key;

        // Step 2: Store in Node.js database and get confirmation
        const nodeRes = await fetch("http://localhost:5001/user/create-api-key", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.uid,
            api_keyy: generatedKey,
          }),
        });
        
        if (!nodeRes.ok) throw new Error("Failed to store API key");
        
        const nodeData = await nodeRes.json();
        console.log("API Key stored in DB:", nodeData);

        // Step 3: Update state and localStorage
        setApiKey(generatedKey);
        setContextApiKey(generatedKey);
        setKeyRevealed(true);
        
      } catch (err) {
        console.error("Error generating API key:", err);
        alert("Failed to generate API key. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const copyKey = () => {
        if (apiKey) {
          navigator.clipboard.writeText(apiKey);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
    };

    const scrollToSection = (id) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-slate-900 text-white pt-20 pb-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center gap-3 mb-6 text-blue-400">
                        <Terminal size={24} />
                        <span className="font-mono font-bold tracking-wider">DEVELOPER CONSOLE</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">API Documentation</h1>
                    <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
                        Integrate AlloyDocs powerful file processing capabilities directly into your applications. 
                        Simple, stateless, and built for performance.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-20 pb-20 flex flex-col lg:flex-row gap-10">
                
                {/* Sidebar */}
                <div className="lg:w-64 flex-shrink-0 hidden lg:block">
                    <div className="sticky top-24 space-y-2">
                        <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Reference</p>
                        {docSections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                                    activeSection === section.id 
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                                    : "text-slate-600 hover:bg-slate-200"
                                }`}
                            >
                                {React.cloneElement(section.icon, { size: 16 })}
                                {section.title}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 space-y-12">
                    
                    {/* API Key Section */}
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -z-10 opacity-50"/>
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                    <Key className="text-blue-600" /> Authentication
                                </h2>
                                <p className="text-slate-500 mt-2">Generate an API key to authenticate your requests.</p>
                            </div>
                            <Shield className="text-slate-200" size={48} />
                        </div>
                        
                        <div className="bg-slate-900 rounded-xl p-1 pl-4 flex items-center justify-between border border-slate-700 shadow-inner">
                            <code className="font-mono text-green-400 text-sm md:text-base">
                                {keyRevealed && apiKey ? apiKey : "ad_live_************************"}
                            </code>
                            <div className="flex gap-1">
                                <button 
                                    onClick={generateKey}
                                    disabled={loading || !user}
                                    className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Generating..." : keyRevealed ? "Regenerate" : "Generate Key"}
                                </button>
                                <button 
                                    onClick={copyKey}
                                    disabled={!apiKey}
                                    className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Copy Key"
                                >
                                    {copied ? <Check size={18} className="text-green-400"/> : <Copy size={18}/>}
                                </button>
                            </div>
                        </div>
                        {!user && (
                          <p className="text-xs text-amber-600 mt-3">📌 Please log in to generate an API key.</p>
                        )}
                    </div>

                    {/* Documentation Content */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-100">
                        {docSections.map((section) => (
                            <div key={section.id} id={section.id} className="p-8 scroll-mt-24">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
                                        {section.icon}
                                    </div>
                                    {section.title}
                                </h2>

                                {section.id === "getting-started" ? (
                                    <div className="grid gap-4">
                                        {section.content.map((item, idx) => (
                                            <div key={idx} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider w-32">{item.title}</span>
                                                <span className="font-mono text-sm text-slate-800 font-medium">{item.value}</span>
                                            </div>
                                        ))}
                                        <div className="mt-4 p-4 border-l-4 border-amber-400 bg-amber-50 rounded-r-lg">
                                            <h4 className="font-bold text-amber-800 text-sm mb-1">Important Integration Note</h4>
                                            <p className="text-sm text-amber-700">
                                                Always use <code className="bg-amber-100 px-1 rounded">FormData</code>. Never manually set Content-Type.
                                                Multi-file endpoints require the key <code className="bg-amber-100 px-1 rounded">files</code> (plural).
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-10">
                                        {section.endpoints.map((ep, idx) => (
                                            <div key={idx} className="group">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded uppercase border border-green-200">POST</span>
                                                    <code className="text-sm font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded">{ep.path}</code>
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-800 mb-2">{ep.name}</h3>
                                                
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-left text-sm border-collapse">
                                                        <thead>
                                                            <tr className="border-b border-slate-200">
                                                                <th className="py-2 font-semibold text-slate-500 w-1/4">Key</th>
                                                                <th className="py-2 font-semibold text-slate-500 w-1/4">Type</th>
                                                                <th className="py-2 font-semibold text-slate-500 w-1/4">Required</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-100">
                                                            {ep.inputs.map((input, i) => (
                                                                <tr key={i}>
                                                                    <td className="py-3 font-mono text-slate-700">{input.key}</td>
                                                                    <td className="py-3 text-slate-600">{input.type}</td>
                                                                    <td className="py-3">
                                                                        {input.req ? (
                                                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                                                                                Required
                                                                            </span>
                                                                        ) : (
                                                                            <span className="text-xs text-slate-400">Optional</span>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                {ep.note && (
                                                    <p className="mt-3 text-xs text-slate-500 italic">Note: {ep.note}</p>
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

const ToolCard = ({ tool, theme }) => {
  const navigate = useNavigate();

  const themeColors = {
    rose: "bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border-rose-100",
    indigo: "bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white border-indigo-100",
    violet: "bg-violet-50 text-violet-600 hover:bg-violet-600 hover:text-white border-violet-100",
    emerald: "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border-emerald-100",
    cyan: "bg-cyan-50 text-cyan-600 hover:bg-cyan-600 hover:text-white border-cyan-100",
  };

  const currentTheme = themeColors[theme] || themeColors.indigo;

  return (
    <div
      onClick={() => navigate(`/tool/${tool.id}`)}
      className="group relative bg-white p-8 rounded-3xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-50 to-transparent rounded-bl-full -z-10 opacity-50 transition-transform group-hover:scale-150" />
      
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${currentTheme} shadow-sm group-hover:shadow-md`}>
        {React.cloneElement(tool.icon, { size: 28, strokeWidth: 2 })}
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
        {tool.name}
      </h3>
      
      <p className="text-sm text-slate-500 leading-relaxed mb-6 font-medium">
        {tool.desc}
      </p>
      
      <div className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-600 transition-colors">
        Try Now <ChevronRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  );
};

const ToolPage = () => {
  const { id } = useParams();
  const fileRef = useRef(null);
  const watermarkRef = useRef(null);
  const audioRef = useRef(null);
  const { apiKey } = useContext(UserContext);

  const [tool, setTool] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("Select File");
  const [blobUrl, setBlobUrl] = useState(null);

  // shared states
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
      const found = cat.tools.find(t => t.id === id);
      if (found) setTool(found);
    }
  }, [id]);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files.length > 1 ? `${e.target.files.length} files selected` : e.target.files[0].name);
    }
  };

  const handleProcess = async () => {
    const files = fileRef.current.files;
    if (!files.length) return alert("Please select a file to continue.");

    if (!apiKey) {
      return alert("Please generate an API key first in the Developers API section.");
    }

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
      if (tool.id === "add-audio-video") fd.append("audio", audioRef.current.files[0]);
      if (tool.id === "convert-audio") fd.append("format", audioFormat);
      if (tool.id === "trim-video" || tool.id === "trim-audio") {
        fd.append("start", start);
        fd.append("end", end);
      }

      // Get response from Node.js with API key
      console.log(`full request url -->${API_BASE_URL_nodejs}/${tool.basename}/${tool.reqname}`)
      const nodeRes = await fetch(`${API_BASE_URL_nodejs}/${tool.basename}/${tool.reqname}`, { 
        method: "POST", 
        headers: {
          "x-api-key": apiKey
        },
        body: fd 
      });

      if (!nodeRes.ok) throw new Error("Node.js processing failed");

      
      const blob = await nodeRes.blob();
      const contentType = nodeRes.headers.get("Content-Type") || "application/octet-stream";
      
      
      const typedBlob = new Blob([blob], { type: contentType });
      const url = URL.createObjectURL(typedBlob);
      
      setPreview(url);
      setBlobUrl(url);

      // Determine file type
      if (contentType.includes("pdf")) setFileType("pdf");
      else if (contentType.startsWith("image")) setFileType("image");
      else if (contentType.startsWith("video")) setFileType("video");
      else if (contentType.startsWith("audio")) setFileType("audio");
      else setFileType("other");

    } catch (err) {
      console.error("Processing error:", err);
      alert("Something went wrong. Please try again. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!preview) return;
    const a = document.createElement("a");
    a.href = preview;
    let ext = "file";
    if (fileType === "image") ext = "png"; 
    if (fileType === "pdf") ext = "pdf";
    if (fileType === "video") ext = "mp4";
    if (fileType === "audio") ext = audioFormat || "mp3";
    if (tool.id === "excel-to-csv") ext = "csv";
    
    a.download = `${APP_NAME}_Processed.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!tool) return <div className="min-h-screen flex items-center justify-center text-slate-400">Loading tool...</div>;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="bg-slate-900 text-white pt-12 pb-24 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-slate-900 to-slate-900"></div>
         <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <div className="inline-flex p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-6 shadow-2xl">
              {React.cloneElement(tool.icon, { size: 32 })}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">{tool.name}</h1>
            <p className="text-lg text-slate-300 max-w-xl mx-auto">{tool.desc}</p>
         </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 -mt-16 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          
          <div className="p-8 md:p-12">
            <div className="mb-10">
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-blue-200 rounded-2xl cursor-pointer bg-blue-50/30 hover:bg-blue-50 transition-all group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="p-4 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-8 h-8 text-blue-500" />
                  </div>
                  <p className="mb-1 text-sm text-slate-700 font-semibold">{fileName}</p>
                  <p className="text-xs text-slate-400">
                    {tool.multi ? "Drag & drop files or click to browse" : "Drag & drop a file or click to browse"}
                  </p>
                </div>
                <input 
                  ref={fileRef} 
                  type="file" 
                  multiple={tool.multi} 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <div className="space-y-6">
               {(tool.id === "split-pdf" || tool.id === "trim-video" || tool.id === "trim-audio" || tool.id === "watermark-pdf" || tool.id === "resize-image" || tool.id === "watermark-image" || tool.id === "add-audio-video" || tool.id === "convert-audio") && (
                 <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                   <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold text-sm uppercase tracking-wider">
                      <Settings2 size={16} /> Configuration
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {(tool.id === "split-pdf" || tool.id === "trim-video" || tool.id === "trim-audio") && (
                        <>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500">Start {tool.id.includes("pdf") ? "Page" : "Time (sec)"}</label>
                            <input className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g., 1" onChange={e => setStart(e.target.value)} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500">End {tool.id.includes("pdf") ? "Page" : "Time (sec)"}</label>
                            <input className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g., 5" onChange={e => setEnd(e.target.value)} />
                          </div>
                        </>
                      )}

                      {tool.id === "watermark-pdf" && (
                         <div className="col-span-2 space-y-1">
                            <label className="text-xs font-medium text-slate-500">Watermark Text</label>
                            <input className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Confidential" onChange={e => setWmText(e.target.value)} />
                         </div>
                      )}

                      {tool.id === "resize-image" && (
                        <>
                           <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500">Width (px)</label>
                            <input className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="1920" onChange={e => setWidth(e.target.value)} />
                           </div>
                           <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500">Height (px)</label>
                            <input className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="1080" onChange={e => setHeight(e.target.value)} />
                           </div>
                        </>
                      )}

                      {tool.id === "watermark-image" && (
                        <div className="col-span-2 space-y-4">
                           <div className="space-y-1">
                              <label className="text-xs font-medium text-slate-500">Upload Logo</label>
                              <input type="file" ref={watermarkRef} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500">Scale (0-1)</label>
                                <input className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" value={scale} onChange={e => setScale(e.target.value)} />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500">Opacity (0-255)</label>
                                <input className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" value={opacity} onChange={e => setOpacity(e.target.value)} />
                              </div>
                           </div>
                        </div>
                      )}

                      {tool.id === "add-audio-video" && (
                        <div className="col-span-2 space-y-1">
                           <label className="text-xs font-medium text-slate-500">Select Audio File</label>
                           <input type="file" ref={audioRef} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                        </div>
                      )}

                      {tool.id === "convert-audio" && (
                        <div className="col-span-2 space-y-1">
                          <label className="text-xs font-medium text-slate-500">Target Format</label>
                          <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white" onChange={e => setAudioFormat(e.target.value)}>
                            <option value="mp3">MP3</option>
                            <option value="wav">WAV</option>
                            <option value="aac">AAC</option>
                          </select>
                        </div>
                      )}
                   </div>
                 </div>
               )}

               <button
                 onClick={handleProcess}
                 disabled={loading}
                 className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg shadow-slate-900/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
               >
                 {loading ? (
                   <>
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                     Processing...
                   </>
                 ) : (
                   <>
                     <Sparkles size={18} /> Run {tool.name}
                   </>
                 )}
               </button>
            </div>
          </div>

          {preview && (
            <div className="bg-slate-50 border-t border-slate-100 p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                   <CheckCircle2 className="text-green-500" size={20} /> Result Ready
                 </h3>
               </div>

               <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6 flex items-center justify-center min-h-[200px]">
                  {fileType === "pdf" && <iframe src={preview} className="w-full h-96 rounded border border-slate-100" title="PDF Preview"/>}
                  {fileType === "image" && <img src={preview} className="max-w-full max-h-96 rounded shadow-sm object-contain" alt="Result" />}
                  {fileType === "video" && <video src={preview} controls className="w-full rounded shadow-sm" />}
                  {fileType === "audio" && <audio src={preview} controls className="w-full mt-4" />}
                  {fileType === "other" && <div className="text-slate-500 italic">Preview not available for this file type.</div>}
               </div>

               <button 
                 onClick={handleDownload}
                 className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
               >
                 <Download size={18} /> Download File
               </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const animatedText = useTypewriter([
    "Edit PDFs",
    "Convert Images",
    "Merge Videos",
    "Manage Files",
    "Crush Data"
  ]);

  return (
    <>
      <div className="bg-white border-b border-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full blur-[120px] opacity-60 -z-10" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-t from-purple-100 to-transparent rounded-full blur-[100px] opacity-40 -z-10" />

        <div className="max-w-5xl mx-auto px-6 pt-32 pb-24 text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/5 backdrop-blur-sm text-slate-600 text-xs font-bold uppercase tracking-widest mb-8 border border-slate-200/50 hover:bg-white hover:shadow-md transition-all cursor-default">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            100% Free & Secure
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight leading-[1.1]">
            All-in-one suite to <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600">
              {animatedText}
            </span>
            <span className="animate-pulse text-blue-600 ml-1">_</span>
          </h1>

          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            AlloyDocs provides the ultimate toolkit for your digital documents and media. 
            Simple, fast, and powerful processing right in your browser.
          </p>
          
          <div className="flex justify-center gap-4">
            <Link to="/docs" className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 hover:-translate-y-1 shadow-xl shadow-slate-900/20 transition-all">
              Developer API
            </Link>
            <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 hover:-translate-y-1 transition-all">
              View Tools
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 py-24 space-y-24">
          {toolCategories.map((category, idx) => (
            <div key={idx} className="relative">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                 <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${
                      category.theme === "rose" ? "bg-rose-100 text-rose-600" :
                      category.theme === "indigo" ? "bg-indigo-100 text-indigo-600" :
                      category.theme === "violet" ? "bg-violet-100 text-violet-600" :
                      category.theme === "emerald" ? "bg-emerald-100 text-emerald-600" :
                      "bg-cyan-100 text-cyan-600"
                    }`}>
                      {idx === 0 ? <FileText size={24} /> : 
                       idx === 1 ? <ImageIcon size={24} /> :
                       idx === 2 ? <Video size={24} /> :
                       idx === 3 ? <Music size={24} /> : <FileSpreadsheet size={24} />}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900">{category.title}</h2>
                      <p className="text-slate-500 mt-1 font-medium">{category.description}</p>
                    </div>
                 </div>
                 <div className="h-px bg-slate-200 flex-grow ml-8 hidden md:block opacity-50"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {category.tools.map((tool, tIdx) => (
                  <ToolCard key={tIdx} tool={tool} theme={category.theme} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="bg-white border-t border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-slate-900/20">
             <Cpu size={24} />
          </div>
          <p className="text-slate-900 font-bold text-lg mb-2">{APP_NAME}</p>
          <p className="text-slate-400 text-sm mb-8">
            © 2026 {APP_NAME} Inc. Crafted for productivity.
          </p>
          <div className="flex justify-center gap-6 text-slate-400 text-sm font-medium">
            <Link to="/" className="hover:text-slate-900 transition-colors">Privacy</Link>
            <Link to="/" className="hover:text-slate-900 transition-colors">Terms</Link>
            <Link to="/docs" className="hover:text-slate-900 transition-colors">API Docs</Link>
          </div>
        </div>
      </footer>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tool/:id" element={<ToolPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;