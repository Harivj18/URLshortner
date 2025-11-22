import React, { useState } from "react";
import { shortenUrl } from "../routeApiHandler";
import { Copy, Link2, Loader2, CheckCircle2, LogIn } from "lucide-react";

const ShortenForm = ({ onShorten }) => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!originalUrl.trim()) return;

    setError("");
    setCopied(false);
    setLoading(true);

    try {
      const cleanUrl = originalUrl.trim();
      if (!isValidUrl(cleanUrl.startsWith("http") ? cleanUrl : `https://${cleanUrl}`)) {
        throw new Error("Please enter a valid URL");
      }

      const data = await shortenUrl(cleanUrl);
      setShortUrl(data.shortUrl);
      setOriginalUrl("");
      onShorten?.();
    } catch (err) {
      setError(err.message || "Failed to shorten URL. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12">
        
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-10 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Shorten Your Link
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Link2 className="w-6 h-6 text-purple-400" />
            </div>
            <input
              type="text"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="Paste your long URL here..."
              className="w-full pl-14 pr-5 py-5 text-lg bg-white/20 border border-white/30 rounded-2xl placeholder-gray-400 text-white focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-400 transition-all disabled:opacity-70"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !originalUrl.trim()}
            className="w-full py-5 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xl rounded-2xl shadow-xl transform transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={28} />
                Shortening...
              </>
            ) : (
              <>
                Shorten URL
                <span className="text-2xl">Zap</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-5 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-200 text-center font-medium flex items-center justify-center gap-3">
            <span>Error:</span> {error}
          </div>
        )}

        {shortUrl && !error && (
          <div className="mt-10 p-6 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/50 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-300 mb-1">Your shortened link:</p>
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl font-bold text-cyan-300 hover:underline break-all"
                >
                  {shortUrl}
                </a>
              </div>

              <button
                onClick={copyToClipboard}
                className="p-4 bg-white/20 hover:bg-white/30 rounded-xl transition-all active:scale-90 group"
              >
                {copied ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                ) : (
                  <Copy className="w-7 h-7 text-purple-300 group-hover:text-purple-200 transition" />
                )}
              </button>
            </div>

            {copied && (
              <p className="mt-4 text-center text-emerald-300 font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 size={20} />
                Copied to clipboard!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShortenForm;