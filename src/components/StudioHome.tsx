import { ArrowRight, Utensils, Home, Image, Phone, Calendar, FolderTree, Check, Inbox, Briefcase } from 'lucide-react';
import type { StudioTab } from './StudioPage';

const tasks = [
  { tab: 'items', title: 'Food & drinks', description: 'Change a price, update a photo, add an item or mark it sold out.', action: 'Edit the menu', icon: Utensils, tone: 'orange' },
  { tab: 'homepage', title: 'Homepage', description: 'Update your welcome message, main photo and featured dishes.', action: 'Edit the homepage', icon: Home, tone: 'sage' },
  { tab: 'gallery', title: 'Your photos', description: 'Add restaurant and food photos, ready to use on your website.', action: 'Open photo library', icon: Image, tone: 'gold' },
  { tab: 'contact', title: 'Opening hours & contact', description: 'Keep your hours, phone number, email and address up to date.', action: 'Update contact details', icon: Phone, tone: 'sage' },
  { tab: 'reservations', title: 'Table bookings', description: 'Manage the booking link and information for your guests.', action: 'Manage bookings', icon: Calendar, tone: 'peach' },
  { tab: 'categories', title: 'Menu sections', description: 'Organise sections such as Breakfast, Desserts and Cocktails.', action: 'Organise the menu', icon: FolderTree, tone: 'lavender' },
] as const;

export function StudioHome({ open, items, categories, cocktails, ready, dirtyPages, inquiries, applications }: {
  open: (tab: StudioTab) => void; items: number; categories: number; cocktails: number; ready: boolean;
  dirtyPages: { tab: StudioTab; title: string }[]; inquiries: number; applications: number;
}) {
  return <section className="studio-home" aria-labelledby="studio-welcome">
    <div className="studio-welcome">
      <div className="studio-welcome-copy">
        <span className="studio-eyebrow">MAATI KITCHEN · YOUR WEBSITE</span>
        <h2 id="studio-welcome">A little update.<br /><span>A fresh website.</span></h2>
        <p>Prices, photos, opening hours — it’s all here.<br className="hidden sm:block" /> Choose what you’d like to change below.</p>
      </div>
      <div className="studio-howto">
        <h3>Three simple steps</h3>
        <ol>
          <li><span>1</span><div><strong>Choose a section</strong><p>Start with one of the cards below.</p></div></li>
          <li><span>2</span><div><strong>Make your changes</strong><p>Edit the words, price or photo.</p></div></li>
          <li><span><Check size={14} /></span><div><strong>Save &amp; publish</strong><p>Wait for the confirmation. You’re done.</p></div></li>
        </ol>
      </div>
    </div>
    {!!dirtyPages.length && <div className="studio-drafts" role="status">
      <div><strong>You have changes waiting to be published</strong><p>Open a section below to finish saving your changes.</p></div>
      <div className="flex flex-wrap gap-2">{dirtyPages.map(page => <button type="button" key={page.tab} onClick={() => open(page.tab)}>{page.title}<ArrowRight size={15} /></button>)}</div>
    </div>}
    <div className="studio-section-heading"><h3>What would you like to change?</h3>{ready && <p>{items} menu items <span>·</span> {categories} sections <span>·</span> {cocktails} cocktails</p>}</div>
    <div data-tour="page-cards" className="studio-task-grid">
      {tasks.map(task => <button key={task.tab} type="button" onClick={() => open(task.tab)} className={`studio-task studio-tone-${task.tone}`}>
        <span className="studio-task-icon"><task.icon size={24} strokeWidth={1.8} aria-hidden="true" /></span>
        <h3>{task.title}</h3><p>{task.description}</p>
        <span className="studio-task-action">{task.action}<ArrowRight size={17} aria-hidden="true" /></span>
      </button>)}
    </div>
    <div className="studio-message-grid">
      <button type="button" onClick={() => open('inquiries')}><span className="studio-message-icon"><Inbox size={21} /></span><span><strong>Customer enquiries</strong><small>Catering requests &amp; private events</small></span><span className="studio-count">{inquiries}</span><ArrowRight size={17} /></button>
      <button type="button" onClick={() => open('applications')}><span className="studio-message-icon"><Briefcase size={21} /></span><span><strong>Job applications</strong><small>People who’d like to join the team</small></span><span className="studio-count">{applications}</span><ArrowRight size={17} /></button>
    </div>
    <details className="studio-more-pages">
      <summary>Other website pages &amp; settings <span>Catering, events, About us and more</span></summary>
      <div>
        {([
          ['catering', 'Catering'], ['events', 'Private events'], ['about', 'About us'], ['jobs', 'Careers'],
          ['landingPages', 'Food & drink introduction pages'], ['printMenu', 'Printed menu images'],
          ['legal', 'Company details'], ['privacy', 'Privacy policy'], ['terms', 'Terms & conditions'],
          ['settings', 'Restaurant & social links'],
        ] as [StudioTab, string][]).map(([tab, title]) => <button type="button" key={tab} onClick={() => open(tab)}>{title}<ArrowRight size={15} /></button>)}
      </div>
    </details>
  </section>;
}
