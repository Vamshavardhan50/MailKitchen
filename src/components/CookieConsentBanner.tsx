import React, { useState, useEffect } from 'react';
import { ShieldCheck, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

interface CookieConsentBannerProps {
  lang?: 'de' | 'en';
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ lang = 'en' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const isDe = lang === 'de';

  useEffect(() => {
    // Check if consent has already been made
    const savedConsent = localStorage.getItem('maati_cookie_consent');
    if (!savedConsent) {
      // Delay display slightly for smooth page load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      // Re-apply stored consent signal to Google Consent Mode v2
      try {
        const consentData = JSON.parse(savedConsent);
        if (typeof window.gtag === 'function') {
          window.gtag('consent', 'update', {
            ad_storage: consentData.marketing ? 'granted' : 'denied',
            ad_user_data: consentData.marketing ? 'granted' : 'denied',
            ad_personalization: consentData.marketing ? 'granted' : 'denied',
            analytics_storage: consentData.analytics ? 'granted' : 'denied'
          });
        }
      } catch (e) {
        // Fallback
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const consent = {
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('maati_cookie_consent', JSON.stringify(consent));

    // Update Google Consent Mode v2 to granted
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        analytics_storage: 'granted'
      });
      // Push event for GTM triggers
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'consent_update', consent_status: 'granted' });
    }

    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const consent = {
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('maati_cookie_consent', JSON.stringify(consent));

    // Keep Google Consent Mode v2 strictly denied
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied'
      });
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'consent_update', consent_status: 'denied' });
    }

    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={isDe ? 'Cookie- und Datenschutzeinstellungen' : 'Cookie and Privacy Settings'}
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-[480px] z-[9999] bg-[#1e382f] text-white p-6 rounded-[28px] shadow-2xl border border-white/15 animate-fadeInUp"
    >
      <div className="flex items-start gap-3.5 mb-3">
        <div className="w-9 h-9 rounded-full bg-[#d85c27] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-extrabold text-[16px] text-white leading-snug">
            {isDe ? 'Privatsphäre & Datenschutz' : 'Your Privacy Choices'}
          </h3>
          <p className="text-white/80 text-[12.5px] mt-1.5 leading-relaxed">
            {isDe ? (
              <>
                Wir nutzen Cookies und Tracking-Tools (wie Google Tag Manager & Microsoft Clarity), um unser Angebot zu analysieren und Ihre Nutzererfahrung zu optimieren. Sie entscheiden, welche Daten Sie freigeben möchten.
              </>
            ) : (
              <>
                We use cookies and privacy-respecting analytics (Google Tag Manager & Microsoft Clarity) to understand website performance and improve your experience. You choose which data you share.
              </>
            )}
          </p>
        </div>
      </div>

      <div className="text-[11.5px] text-white/60 mb-5 flex items-center gap-3">
        <Link
          to={isDe ? '/de/datenschutz' : '/privacy'}
          className="underline hover:text-white transition-colors"
        >
          {isDe ? 'Datenschutzerklärung' : 'Privacy Policy'}
        </Link>
        <span>•</span>
        <Link
          to={isDe ? '/de/impressum' : '/impressum'}
          className="underline hover:text-white transition-colors"
        >
          Impressum
        </Link>
      </div>

      {/* Buttons with equal prominence according to German GDPR / TDDDG regulations */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleRejectAll}
          className="w-full py-2.5 px-4 rounded-full border border-white/30 hover:border-white hover:bg-white/10 text-white font-bold text-[13px] transition-all text-center"
        >
          {isDe ? 'Nur essenzielle' : 'Reject Non-Essential'}
        </button>
        <button
          onClick={handleAcceptAll}
          className="w-full py-2.5 px-4 rounded-full bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold text-[13px] shadow-md transition-all text-center"
        >
          {isDe ? 'Alle akzeptieren' : 'Accept All'}
        </button>
      </div>
    </div>
  );
};
