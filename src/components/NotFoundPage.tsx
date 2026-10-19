import React from 'react';
import { SEO } from './SEO';
import { Home, Utensils, MapPin, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NotFoundPageProps {
  lang?: 'de' | 'en';
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ lang = 'en' }) => {
  const isDe = lang === 'de';

  return (
    <div className="bg-[#f5f0e8] min-h-[80vh] flex items-center justify-center pt-28 pb-20 px-6">
      <SEO
        title={isDe ? 'Seite nicht gefunden (404) | MAATI Kitchen Berlin' : 'Page Not Found (404) | MAATI Kitchen Berlin'}
        description={isDe ? 'Die gewünschte Seite konnte nicht gefunden werden.' : 'The requested page could not be found.'}
        robots="noindex, follow"
        lang={lang}
      />

      <div className="max-w-[560px] w-full bg-white rounded-[32px] p-8 sm:p-12 shadow-xl border border-gray-100 text-center space-y-6">
        <span className="text-[#d85c27] font-black text-[64px] sm:text-[80px] leading-none block">
          404
        </span>
        <h1 className="text-[26px] sm:text-[32px] font-black text-[#1e382f] leading-tight">
          {isDe ? 'Seite nicht gefunden' : 'Page Not Found'}
        </h1>
        <p className="text-[#666] text-[15px] leading-relaxed">
          {isDe
            ? 'Die von Ihnen aufgerufene Seite existiert leider nicht oder wurde verschoben. Lassen Sie sich von unserer Speisekarte inspirieren.'
            : 'The page you were looking for cannot be found or might have moved. Explore our fresh menu or find our location in Berlin Mitte.'}
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={isDe ? '/de' : '/'}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-6 py-3.5 rounded-full text-[14px] shadow-md transition-all"
          >
            <Home className="w-4 h-4" />
            <span>{isDe ? 'Zur Startseite' : 'Go to Homepage'}</span>
          </Link>
          <Link
            to={isDe ? '/de/menu' : '/menu'}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-[#1e382f] text-[#1e382f] hover:bg-[#1e382f] hover:text-white font-bold px-6 py-3 rounded-full text-[14px] transition-all"
          >
            <Utensils className="w-4 h-4" />
            <span>{isDe ? 'Speisekarte ansehen' : 'Explore Menu'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
