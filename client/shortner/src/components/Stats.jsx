import React, { useState } from "react";
import { getStats } from "../routeApiHandler";
import {
  Search,
  Link2,
  MousePointerClick,
  Calendar,
  AlertCircle,
  Copy,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL || "http://localhost:8000/api";

const Stats = () => {
  const [shortCode, setShortCode] = useState("");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shortCode.trim()) return;

    setError("");
    setStats(null);
    setCopied(false);
    setLoading(true);

    try {
      const data = await getStats(shortCode.trim());
      setStats(data);
    } catch (err) {
      setError(
        err?.message?.includes("404") || err?.message?.includes("Not found")
          ? "Short code not found. Please check and try again."
          : "Failed to fetch stats. Try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyShortUrl = () => {
    const url = `${BASE_URL}/${stats.shortCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10">

        <h2 className="text-4xl md:text-5xl font-bold text-center mb-10 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent flex items-center justify-center gap-3">
          <Search className="w-10 h-10" />
          Link Analytics
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              value={shortCode}
              onChange={(e) => setShortCode(e.target.value)}
              placeholder="Enter short code (e.g. abc123)"
              className="w-full px-5 py-5 text-lg bg-white/20 border border-white/30 rounded-2xl placeholder-gray-400 text-white focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-400 transition-all disabled:opacity-70"
              disabled={loading}
            />
            {loading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !shortCode.trim()}
            className="w-full py-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xl rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? "Fetching..." : "Get Stats"}
            {!loading && <Search size={26} />}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-5 bg-red-500/20 border border-red-500/50 rounded-2xl flex items-center gap-3 text-red-200">
            <AlertCircle size={22} />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {stats && !error && (
          <div className="mt-8 p-7 bg-white/10 border border-white/20 rounded-2xl space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
            <div className="flex items-center justify-between gap-4 bg-black/30 px-5 py-4 rounded-xl">
              <code className="text-cyan-300 font-mono text-lg break-all">
                {BASE_URL}/{stats.shortCode}
              </code>
              <button
                onClick={copyShortUrl}
                className="p-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-all active:scale-95"
              >
                {copied ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : (
                  <Copy className="w-6 h-6" />
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/5 rounded-xl p-5">
                <MousePointerClick className="w-10 h-10 mx-auto mb-3 text-emerald-400" />
                <p className="text-4xl font-bold text-white">{stats.clicks}</p>
                <p className="text-gray-300">Total Clicks</p>
              </div>

              <div className="bg-white/5 rounded-xl p-5">
                <Calendar className="w-10 h-10 mx-auto mb-3 text-purple-400" />
                <p className="text-lg font-medium text-white">
                  {new Date(stats.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="text-gray-300">Created</p>
              </div>

              <div className="bg-white/5 rounded-xl p-5">
                <Link2 className="w-10 h-10 mx-auto mb-3 text-cyan-400" />
                <a
                  href={stats.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-cyan-300 hover:underline line-clamp-2"
                >
                  Original Link
                </a>
              </div>
            </div>

            {copied && (
              <p className="text-center text-emerald-300 font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 size={20} />
                Short URL copied!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Stats;