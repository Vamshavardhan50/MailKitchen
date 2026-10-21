import { LayoutGrid, Utensils, Home, Image, Clock, Calendar, ExternalLink, HelpCircle, RefreshCw, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { StudioTab } from './StudioPage';

export function StudioHeader({ busy, help, refresh, logout }: { busy: boolean; help: () => void; refresh: () => void; logout: () => void }) {
  return <header data-tour="studio-header" className="studio-header">
    <div className="studio-header-brand">
      <span className="studio-brand-logo"><img src="/assets/logo-C86A0r1B.png" alt="MAATI Kitchen" /></span>
      <span className="studio-header-divider" />
      <div><h1>MAATI Studio</h1><p>Your restaurant website, made simple.</p></div>
    </div>
    <div className="studio-header-actions">
      <button type="button" onClick={help}><HelpCircle size={17} /><span>Quick guide</span></button>
      <button type="button" data-tour="cloud-sync" onClick={refresh} disabled={busy} title="Load the latest published content. Your open edits are kept."><RefreshCw size={16} /><span>Refresh</span></button>
      <Link data-tour="view-site" to="/" target="_blank" rel="noopener noreferrer" className="studio-view-website">View website<ExternalLink size={16} /></Link>
      <button type="button" onClick={logout} disabled={busy} className="studio-sign-out"><LogOut size={16} /><span>Sign out</span></button>
    </div>
  </header>;
}

const sections = [
  ['overview', 'Dashboard', LayoutGrid], ['items', 'Food & drinks', Utensils], ['homepage', 'Homepage', Home],
  ['gallery', 'Photos', Image], ['contact', 'Hours & contact', Clock], ['reservations', 'Bookings', Calendar],
] as const;

export function StudioNavigation({ active, open }: { active: StudioTab; open: (tab: StudioTab) => void }) {
  return <nav className="studio-navigation" aria-label="Main admin sections">
    {sections.map(([tab, title, Icon]) => <button type="button" key={tab} onClick={() => open(tab)} aria-current={active === tab ? 'page' : undefined}><Icon size={17} aria-hidden="true" />{title}</button>)}
  </nav>;
}

export const STUDIO_HELP: Partial<Record<StudioTab, string>> = {
  items: 'Find a dish or drink, then choose Edit details. Use Sold out when an item is unavailable.',
  homepage: 'Open a section to change its text or photos. English and German can be edited separately.',
  gallery: 'Upload a photo and give it a helpful name. Then choose it in a dish or page and save that editor.',
  categories: 'Rename your menu sections or use the arrows to change their order on the website.',
  contact: 'These details appear on the contact page and website footer. Save & publish when you’re ready.',
  reservations: 'Update your booking link and information for guests, then save & publish.',
  inquiries: 'Read customer messages, add a private note and keep track of who you have contacted.',
  applications: 'Review applications, add private notes and update each application’s status.',
};
