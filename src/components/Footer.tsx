import React from "react";
import { Rss, Send } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-zinc-800/80 bg-zinc-950 py-10 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-zinc-900">
          <div>
            <div className="flex items-center space-x-2 font-mono font-bold text-zinc-200">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>FOVEA.SI</span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              The focal point of the post-AI era.
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono text-zinc-400">
            <a
              href="mailto:signals@fovea.si"
              className="flex items-center space-x-1.5 hover:text-amber-400 transition-colors"
            >
              <Send size={12} />
              <span>Submit Signal</span>
            </a>
            <span className="text-zinc-700">/</span>
            <a
              href="#rss"
              onClick={(e) => {
                e.preventDefault();
                alert("RSS feed generated at /feed.xml (coming with production build)");
              }}
              className="flex items-center space-x-1.5 hover:text-amber-400 transition-colors"
            >
              <Rss size={12} />
              <span>RSS</span>
            </a>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] font-mono text-zinc-600">
          <p>© {new Date().getFullYear()} FOVEA.SI. All rights reserved.</p>
          <p>Scanned broadly. Published selectively.</p>
        </div>
      </div>
    </footer>
  );
};
