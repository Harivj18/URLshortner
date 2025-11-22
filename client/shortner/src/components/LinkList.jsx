import React, { useState, useEffect } from "react";
import { getAllLinks, deleteLink } from "../routeApiHandler";
import { Copy, ExternalLink, Trash2, Check, Loader2 } from "lucide-react";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL || "http://localhost:8080/api";
const SHOW_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";                                          

const LinkList = ({ refresh }) => {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        fetchLinks();
    }, [refresh]);

    const fetchLinks = async () => {
        setLoading(true);
        try {
            const data = await getAllLinks();
            setLinks(data || []);
        } catch (err) {
            console.error("Failed to fetch links");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async (url, id) => {
        await navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this link permanently?")) return;
        await deleteLink(id);
        setLinks(links.filter((l) => l._id !== id));
    };

    if (loading) {
        return (
            <div className="text-center py-32">
                <Loader2 className="w-16 h-16 animate-spin mx-auto text-purple-400" />
                <p className="mt-6 text-xl text-gray-400">Loading your links...</p>
            </div>
        );
    }

    if (links.length === 0) {
        return (
            <div className="text-center py-32">
                <div className="text-7xl mb-6 opacity-20">No links yet</div>
                <p className="text-2xl text-gray-400">Shorten your first URL to see it here!</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-5xl md:text-6xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Your Shortened Links
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {links.map((link) => {
                    const shortUrl = `${BASE_URL}/navigate/${link.shortCode}`;
                    const showUrl = `${SHOW_BASE_URL}/${link.shortCode}`; 
                    const isCopied = copiedId === link._id;

                    return (
                        <div
                            key={link._id}
                            className="group relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-600/30 transform hover:-translate-y-2"
                        >
                            <div className="absolute -top-4 -right-4">
                                <span className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white px-5 py-3 rounded-full text-lg font-bold shadow-2xl animate-pulse">
                                    {link.clicks} {link.clicks === 1 ? "click" : "clicks"}
                                </span>
                            </div>

                            <a
                                href={shortUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-2xl font-bold text-cyan-300 hover:text-cyan-100 transition-all break-all mb-4 group-hover:underline"
                            >
                                {showUrl}
                            </a>

                            <p className="text-gray-300 text-sm mb-8 line-clamp-2 opacity-90">
                                {link.originalUrl}
                            </p>

                            <div className="flex flex-wrap items-center gap-4">
                                <button
                                    onClick={() => handleCopy(shortUrl, link._id)}
                                    className="flex items-center gap-3 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-2xl transition-all active:scale-95 backdrop-blur-sm border border-white/10"
                                >
                                    {isCopied ? <Check className="w-6 h-6 text-emerald-400" /> : <Copy className="w-6 h-6" />}
                                    <span className="font-medium">{isCopied ? "Copied!" : "Copy"}</span>
                                </button>

                                <button
                                    onClick={() => {
                                        window.open(`${BASE_URL}/navigate/${link.shortCode}`, '_blank');
                                    }}
                                    className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-2xl transition-all active:scale-95 font-medium shadow-lg"
                                >
                                    <ExternalLink className="w-6 h-6" />
                                    <span>Visit</span>
                                </button>

                                <button
                                    onClick={() => handleDelete(link._id)}
                                    className="flex items-center gap-3 px-6 py-3 bg-red-500/20 hover:bg-red-500/40 rounded-2xl transition-all active:scale-95 border border-red-500/30"
                                >
                                    <Trash2 className="w-6 h-6 text-red-400" />
                                    <span className="font-medium text-white">Delete</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LinkList;