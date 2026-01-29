import React, { useState, useEffect } from "react";
import { X, Copy, Check, LogOut, Loader } from "lucide-react";

const ProfileModal = ({ user, apiKey, onClose, onLogout }) => {
  const [copied, setCopied] = useState(false);
  const [loadingApiKey, setLoadingApiKey] = useState(false);
  const [localApiKey, setLocalApiKey] = useState(apiKey);

  useEffect(() => {
    setLocalApiKey(apiKey);
  }, [apiKey]);

  const fetchApiKey = async () => {
    if (localApiKey) return; // Already have it
    
    setLoadingApiKey(true);
    try {
      const response = await fetch("http://127.0.0.1:5001/user/get-api-key", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLocalApiKey(data.apiKey);
      } else {
        alert("Failed to fetch API key");
      }
    } catch (error) {
      console.error("Error fetching API key:", error);
      alert("Error fetching API key");
    } finally {
      setLoadingApiKey(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex items-center justify-between text-white">
          <h2 className="text-xl font-bold">Profile</h2>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-1 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-blue-100 shadow-lg">
              <img
                src={user?.photoURL || "https://via.placeholder.com/96"}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-4">
            {/* Display Name */}
            <div className="bg-slate-50 p-4 rounded-xl">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Display Name
              </label>
              <p className="text-slate-900 font-semibold mt-1">
                {user?.displayName || "Not Set"}
              </p>
            </div>

            {/* Email */}
            <div className="bg-slate-50 p-4 rounded-xl">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Email
              </label>
              <p className="text-slate-900 font-semibold mt-1 break-all">
                {user?.email || "Not Set"}
              </p>
            </div>

            {/* UID */}
            <div className="bg-slate-50 p-4 rounded-xl">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                User ID
              </label>
              <p className="text-slate-900 font-mono text-sm mt-1 break-all">
                {user?.uid || "Not Set"}
              </p>
            </div>

            {/* API Key */}
            <div className="bg-slate-50 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  API Key
                </label>
                {localApiKey && (
                  <button
                    onClick={() => copyToClipboard(localApiKey)}
                    className="p-1 hover:bg-slate-200 rounded transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check size={16} className="text-green-600" />
                    ) : (
                      <Copy size={16} className="text-slate-600" />
                    )}
                  </button>
                )}
              </div>
              {localApiKey ? (
                <p className="text-slate-900 font-mono text-xs mt-1 break-all bg-white p-2 rounded border border-slate-200">
                  {localApiKey}
                </p>
              ) : (
                <button
                  onClick={fetchApiKey}
                  disabled={loadingApiKey}
                  className="mt-2 w-full px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-400 flex items-center justify-center gap-2"
                >
                  {loadingApiKey ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load API Key"
                  )}
                </button>
              )}
            </div>

            {/* Phone (if available) */}
            {user?.phoneNumber && (
              <div className="bg-slate-50 p-4 rounded-xl">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Phone
                </label>
                <p className="text-slate-900 font-semibold mt-1">
                  {user.phoneNumber}
                </p>
              </div>
            )}

            {/* Creation Date */}
            <div className="bg-slate-50 p-4 rounded-xl">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Member Since
              </label>
              <p className="text-slate-900 font-semibold mt-1">
                {user?.metadata?.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })
                  : "Unknown"}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 mt-6"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
