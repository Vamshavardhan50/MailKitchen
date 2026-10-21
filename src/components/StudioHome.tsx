import { ArrowRight, Utensils, Home, Image, Phone, Calendar, FileText } from 'lucide-react';
import type { StudioTab } from './StudioPage';

const dailyTasks = [
  { tab: 'items', title: 'Menu & prices', description: 'Add dishes and drinks, change prices, or mark an item sold out.', icon: Utensils },
  { tab: 'homepage', title: 'Homepage', description: 'Change the main photo, headings, and featured dishes.', icon: Home },
  { tab: 'gallery', title: 'Photo library', description: 'Upload your photos and choose names that are easy to find.', icon: Image },
  { tab: 'contact', title: 'Opening hours & contact', description: 'Update your address, phone number, email, and opening hours.', icon: Phone },
  { tab: 'reservations', title: 'Table bookings', description: 'Change booking links, group size, and booking information.', icon: Calendar },
  { tab: 'categories', title: 'Menu sections', description: 'Rename or reorder sections such as Desserts and Cocktails.', icon: FileText },
] as const;

export function StudioHome({ open, items, categories, cocktails, ready, dirtyPages }: {
  open: (tab: StudioTab) => void; items: number; categories: number; cocktails: number; ready: boolean;
  dirtyPages: { tab: StudioTab; title: string }[];
}) {
  return <section className="space-y-6" aria-labelledby="studio-welcome">
    <div className="rounded-3xl border border-[#ebdcd0] bg-white p-6 sm:p-8 space-y-4">
      <h2 id="studio-welcome" className="text-2xl sm:text-3xl font-bold text-[#1e382f]">What would you like to update?</h2>
      <p className="text-gray-600 text-base max-w-3xl">Choose a section, make your changes, then select <strong>Save &amp; publish</strong>. A confirmation tells you when your changes are on the website.</p>
      {ready && <p className="text-sm font-semibold text-[#1e382f]">Current menu: {items} items · {categories} sections · {cocktails} cocktails</p>}
      {!!dirtyPages.length && <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="font-bold text-amber-900">You have changes to publish</p>
        <div className="flex flex-wrap gap-2 mt-2">{dirtyPages.map(page => <button key={page.tab} onClick={() => open(page.tab)} className="underline text-sm p-2 text-amber-900">{page.title}</button>)}</div>
      </div>}
    </div>
    <div data-tour="page-cards" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {dailyTasks.map(task => <button key={task.tab} type="button" onClick={() => open(task.tab)} className="text-left bg-white p-6 rounded-2xl border border-[#ebdcd0] hover:border-[#d85c27] hover:shadow-md transition-all focus-visible:outline-2 focus-visible:outline-[#d85c27]">
        <task.icon className="w-7 h-7 text-[#d85c27] mb-4" aria-hidden="true" />
        <h3 className="font-bold text-lg text-[#1e382f] flex justify-between items-center">{task.title}<ArrowRight className="w-5 h-5" /></h3>
        <p className="text-sm text-gray-600 leading-relaxed mt-2">{task.description}</p>
      </button>)}
    </div>
    <details className="rounded-2xl border border-[#ebdcd0] bg-white p-5">
      <summary className="cursor-pointer font-bold text-[#1e382f] p-1">More pages &amp; settings</summary>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-4">
        {([
          ['catering', 'Catering'], ['events', 'Private events'], ['about', 'About us'], ['jobs', 'Careers'],
          ['landingPages', 'Food & drink introduction pages'], ['printMenu', 'Menu display settings'],
          ['legal', 'Company details'], ['privacy', 'Privacy policy'], ['terms', 'Terms & conditions'],
          ['settings', 'Restaurant & social links'], ['inquiries', 'Customer enquiries'], ['applications', 'Job applications'],
        ] as [StudioTab, string][]).map(([tab, title]) => <button key={tab} onClick={() => open(tab)} className="text-left rounded-xl p-3 text-sm text-[#1e382f] hover:bg-[#f5f0e8] underline">{title}</button>)}
      </div>
    </details>
  </section>;
}
