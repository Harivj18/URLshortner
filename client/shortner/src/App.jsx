import React, { useState } from 'react';
import ShortenForm from './components/ShortenForm';
import LinkList from './components/LinkList';
import Stats from './components/Stats';

function App() {
  const [refresh, setRefresh] = useState(0);

  const handleShorten = () => {
    setRefresh((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <header className="border-b border-purple-800/30 bg-black/20 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-teal-400 to-purple-600 bg-clip-text text-transparent">
            URL Shortener
          </h1>
          <p className="mt-3 text-lg text-gray-300">
            Shorten, share, and track your links — fast and free.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        <section className="relative -mt-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-purple-500/20 p-8 md:p-10">
            <ShortenForm onShorten={handleShorten} />
          </div>
        </section>

        <section>
          <Stats />
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Your Links
          </h2>
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-purple-700/30 overflow-hidden">
            <LinkList refresh={refresh} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;