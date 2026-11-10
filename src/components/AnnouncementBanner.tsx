import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../lib/sanityService';
import { Sparkles, ArrowRight, X } from 'lucide-react';

interface AnnouncementBannerProps {
  lang: 'en' | 'de';
}

export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({ lang }) => {
  const { settings } = useSiteSettings();
  const [isDismissed, setIsDismissed] = React.useState(false);

  if (isDismissed || !settings?.announcementEnabled) {
    return null;
  }

  const text = lang === 'de' ? (settings.announcementTextDe || settings.announcementTextEn) : (settings.announcementTextEn || settings.announcementTextDe);

  if (!text || !text.trim()) {
    return null;
  }

  const link = settings.announcementLink?.trim();

  return (
    <aside aria-label="Announcement" className="relative z-50 bg-gradient-to-r from-[#d85c27] via-[#c24f1c] to-[#993406] text-white text-xs sm:text-[13px] font-bold py-2 px-3 sm:px-4 text-center shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3 flex-wrap pr-6">
        <span className="inline-flex items-center gap-1.5 bg-white/20 px-2 py-0.5 rounded-full text-[10px] tracking-wider uppercase font-black">
          <Sparkles className="w-3 h-3 text-amber-200" />
          <span>Notice</span>
        </span>
        <span className="leading-tight">{text}</span>
        {link && (
          link.startsWith('http') ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-amber-200 transition-colors shrink-0 ml-1"
            >
              <span>Learn more</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          ) : (
            <Link
              to={link}
              className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-amber-200 transition-colors shrink-0 ml-1"
            >
              <span>Learn more</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )
        )}
      </div>
      <button
        onClick={() => setIsDismissed(true)}
        aria-label="Dismiss announcement banner"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1 text-white/80 hover:text-white rounded-md hover:bg-black/10 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </aside>
  );
};

