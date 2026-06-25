import React, { useState, useEffect } from "react";
import { X, Copy, Check, LogOut, Loader, KeyRound, Shield } from "lucide-react";

const ProfileModal = ({ user, apiKey, onClose, onLogout }) => {
  const [copied,       setCopied]       = useState(false);
  const [keyCopied,    setKeyCopied]    = useState(false);
  const [loadingKey,   setLoadingKey]   = useState(false);
  const [localApiKey,  setLocalApiKey]  = useState(apiKey);

  useEffect(() => { setLocalApiKey(apiKey); }, [apiKey]);

  const fetchApiKey = async () => {
    if (localApiKey) return;
    setLoadingKey(true);
    try {
      const res = await fetch("http://127.0.0.1:5001/user/get-api-key", {
        method: "GET",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      });
      if (res.ok) { const d = await res.json(); setLocalApiKey(d.apiKey); }
      else alert("Couldn't load the API key.");
    } catch { alert("Couldn't reach the server."); }
    finally { setLoadingKey(false); }
  };

  const copy = (text, setter) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const memberSince = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-[#111113] border border-[#1f1f23] rounded-[16px] shadow-2xl w-full max-w-sm flex flex-col overflow-hidden"
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f1f23]">
          <p className="text-[13px] font-bold text-zinc-200">Account</p>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-[6px] text-zinc-600 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-5">

          {/* Avatar + name */}
          <div className="flex items-center gap-3.5">
            <div className="relative flex-shrink-0">
              <img
                src={user?.photoURL || "https://via.placeholder.com/48"}
                alt={user?.displayName || "User"}
                className="w-12 h-12 rounded-full object-cover ring-1 ring-white/10"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111113]" />
            </div>
            <div className="min-w-0">
              <p className="text-[14px] font-bold text-white truncate">
                {user?.displayName || "No name"}
              </p>
              <p className="text-[11px] text-zinc-600">
                {memberSince ? `Joined ${memberSince}` : "Pro plan"}
              </p>
            </div>
            <span className="ml-auto text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0"
              style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)", color: "#22c55e" }}>
              Pro
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#1f1f23]" />

          {/* Fields */}
          <div className="space-y-3">
            <Row label="Email" value={user?.email}
              onCopy={() => copy(user?.email, setCopied)} copied={copied} />
            <Row label="User ID" value={user?.uid} mono
              onCopy={() => copy(user?.uid, setCopied)} copied={copied} />
            {user?.phoneNumber && (
              <Row label="Phone" value={user.phoneNumber}
                onCopy={() => copy(user.phoneNumber, setCopied)} copied={copied} />
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-[#1f1f23]" />

          {/* API Key */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5">
              <Shield size={11} className="text-zinc-600" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">API Key</p>
            </div>

            {localApiKey ? (
              <>
                <div className="bg-[#0a0a0c] border border-[#1f1f23] rounded-[8px] px-3 py-2.5">
                  <code className="font-mono text-[11px] text-green-400 break-all select-all">
                    {localApiKey}
                  </code>
                </div>
                <button
                  onClick={() => copy(localApiKey, setKeyCopied)}
                  className={`w-full py-2 rounded-[8px] text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors
                    ${keyCopied
                      ? "bg-green-950/40 text-green-400 border border-green-900/40"
                      : "bg-white/[0.04] border border-[#27272a] text-zinc-300 hover:bg-white/[0.07] hover:text-white"
                    }`}
                >
                  {keyCopied ? <><Check size={13}/> Copied!</> : <><Copy size={13}/> Copy key</>}
                </button>
              </>
            ) : (
              <button
                onClick={fetchApiKey}
                disabled={loadingKey}
                className="w-full py-2 rounded-[8px] text-[12px] font-semibold border border-[#27272a] text-zinc-400
                  hover:text-white hover:bg-white/[0.04] transition-colors flex items-center justify-center gap-1.5
                  disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loadingKey
                  ? <><Loader size={13} className="animate-spin"/> Loading…</>
                  : <><KeyRound size={13}/> Reveal API key</>
                }
              </button>
            )}

            <p className="text-[10.5px] text-zinc-700 text-center">
              Never share your key with anyone.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#1f1f23] p-4">
          <button
            onClick={onLogout}
            className="w-full py-2.5 rounded-[8px] text-[12px] font-bold text-red-400 border border-red-900/40
              bg-red-950/20 hover:bg-red-950/40 hover:text-red-300 transition-colors flex items-center justify-center gap-1.5"
          >
            <LogOut size={13}/> Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value, mono, onCopy, copied }) => (
  <div className="bg-[#0d0d0f] border border-[#1f1f23] rounded-[8px] px-3 py-2.5 flex items-center gap-2">
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-0.5">{label}</p>
      <p className={`text-zinc-300 truncate ${mono ? "font-mono text-[11px]" : "text-[12.5px] font-medium"}`}>
        {value || "—"}
      </p>
    </div>
    {value && (
      <button
        onClick={onCopy}
        className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-[6px] text-zinc-600 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors"
      >
        {copied ? <Check size={13} className="text-green-400"/> : <Copy size={13}/>}
      </button>
    )}
  </div>
);

export default ProfileModal;