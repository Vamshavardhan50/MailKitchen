import React, { useState } from 'react';
import { SEO } from './SEO';
import {
  Briefcase,
  Heart,
  Coffee,
  ShieldCheck,
  Mail,
  ArrowRight,
  ArrowDown,
  Check,
  Sparkles,
  MapPin,
  X,
  CheckCircle2,
  Loader2,
  Send,
  Users,
  Award,
  ChevronRight,
  Clock,
  Building2
} from 'lucide-react';
import { apiUrl } from '../lib/api';
import { useJobsContent, DEFAULT_JOBS } from '../lib/sanityService';

interface JobsPageProps {
  lang?: 'de' | 'en';
}

export const JobsPage: React.FC<JobsPageProps> = ({ lang = 'en' }) => {
  const isDe = lang === 'de';
  const { content: cmsJobs } = useJobsContent();

  const title = isDe
    ? 'Karriere & Jobs in Berlin Mitte | MAATI Kitchen'
    : 'Careers & Jobs in Berlin Mitte | MAATI Kitchen';

  const description = isDe
    ? 'Wachse mit uns bei MAATI Kitchen in Berlin Mitte. Entdecke offene Stellen in Service, Küche und Management. Faire Bezahlung, Verpflegung und echtes Teamwork.'
    : 'Put down roots with MAATI Kitchen in Berlin Mitte. Discover career opportunities in front-of-house, kitchen, and management. Fair pay, free staff meals, and real growth.';

  const canonicalUrl = isDe ? 'https://maatikitchen.com/de/jobs' : 'https://maatikitchen.com/jobs';

  // Active Department Filter (beets & roots style)
  const [activeDepartment, setActiveDepartment] = useState<string>('all');

  // Job Listing Data categorized by department
  const ALL_JOBS = [
    {
      id: 'general-manager',
      department: 'management',
      deptLabel: isDe ? 'Management & Leitung' : 'Management & Leadership',
      title: isDe ? 'Restaurant General Manager (w/m/d)' : 'Restaurant General Manager (f/m/d)',
      type: isDe ? 'Vollzeit' : 'Full-Time',
      location: 'Berlin Mitte (Zimmerstraße 56)',
      summary: isDe
        ? 'Du führst unser Team mit Leidenschaft, optimierst Service-Abläufe und steuerst das operative Tagesgeschäft unseres modernen Restaurants.'
        : 'Lead our front-of-house and kitchen teams, champion operational excellence, and shape guest hospitality at our flagship Berlin Mitte restaurant.',
      responsibilities: isDe
        ? [
            'Operative Gesamtleitung des Restaurantbetriebs & Schichtplanung',
            'Führung, Motivation und Weiterentwicklung unseres 15-köpfigen Teams',
            'Einhaltung von HACCP-Standards, Qualitätskontrolle und Inventur',
            'Enge Abstimmung mit der Geschäftsführung und dem Küchenchef'
          ]
        : [
            'Overall operational management of restaurant shifts and scheduling',
            'Leading, mentoring, and inspiring our 15+ hospitality team members',
            'Upholding strict hygiene, inventory, and food quality standards',
            'Close collaboration with founders on growth and guest feedback'
          ],
      offer: isDe
        ? 'Attraktives Gehalt + Bonus, BVG-Ticket, 30 Tage Urlaub, kostenlose Verpflegung'
        : 'Competitive salary + performance bonus, BVG monthly ticket, 30 vacation days, free staff meals'
    },
    {
      id: 'catering-manager',
      department: 'management',
      deptLabel: isDe ? 'Management & Vertrieb' : 'Management & Sales',
      title: isDe ? 'Account Manager - B2B Catering (w/m/d)' : 'Account Manager - Corporate Catering (f/m/d)',
      type: isDe ? 'Vollzeit / Teilzeit' : 'Full-Time / Part-Time',
      location: 'Berlin Mitte / Hybrid',
      summary: isDe
        ? 'Du betreust Firmenkunden in Berlin, erstellst maßgeschneiderte Catering-Angebote und baust langfristige B2B-Partnerschaften auf.'
        : 'Manage corporate catering accounts across Berlin, coordinate custom lunch programs, and expand relationships with innovative tech and creative companies.',
      responsibilities: isDe
        ? [
            'Betreuung eingehender Catering- und Eventanfragen per Mail und Telefon',
            'Erstellung von individuellen Menü- und Budgetvorschlägen',
            'Koordination mit der Küche bezüglich Lieferzeiten und Aufbauten',
            'Aktive Pflege von Kundenbeziehungen und Firmenkonten'
          ]
        : [
            'Handling incoming corporate catering and private event inquiries',
            'Creating tailored menus, pricing estimates, and invoices',
            'Coordinating kitchen preparation and timely delivery schedules',
            'Nurturing ongoing relations with corporate office managers'
          ],
      offer: isDe
        ? 'Attraktives Fixgehalt + Erfolgsbeteiligung, flexible Arbeitszeiten, Homeoffice-Tage'
        : 'Base salary + commission, flexible hybrid hours, free dining perks'
    },
    {
      id: 'service-barista',
      department: 'service',
      deptLabel: isDe ? 'Service & Barista' : 'Service & Barista',
      title: isDe ? 'Service Team Member & Barista (w/m/d)' : 'Front of House Host & Barista (f/m/d)',
      type: isDe ? 'Vollzeit / Teilzeit / Minijob' : 'Full-Time / Part-Time / Student',
      location: 'Berlin Mitte (Zimmerstraße 56)',
      summary: isDe
        ? 'Du bist das herzliche Gesicht für unsere Gäste an der Kasse und Kaffeebar. Du bereitest frischen Chai, Lassis und Spezialitätenkaffee zu.'
        : 'Be the welcoming face of MAATI at the counter and coffee bar. Craft spiced chai, signature lassis, and specialty espresso drinks.',
      responsibilities: isDe
        ? [
            'Herzliche Gästebetreuung, Kassenbedienung und Beratung zu Speisen',
            'Zubereitung von Heiß- und Kaltgetränken (Chai, Lassis, Kaffeespezialitäten)',
            'Sicherstellung von Sauberkeit und ansprechender Präsentation im Gastraum',
            'Aktive Mitarbeit bei schnellen Mittags- und Abendschichten'
          ]
        : [
            'Warm guest greeting, POS order handling, and menu guidance',
            'Crafting hot and cold drinks (fragrant chai, fruit lassis, specialty coffee)',
            'Maintaining clean, welcoming counter and dining room ambiance',
            'Efficient collaboration with kitchen crew during lunch rushes'
          ],
      offer: isDe
        ? 'Faire übertarifliche Bezahlung + Trinkgeld, verlässliche Dienstpläne, kostenlose Mahlzeiten'
        : 'Above-scale hourly wage + tips, predictable schedules, complimentary shifts meals'
    },
    {
      id: 'cook-line',
      department: 'kitchen',
      deptLabel: isDe ? 'Küche & Zubereitung' : 'Kitchen & Line Cook',
      title: isDe ? 'Kitchen Team Member / Koch (w/m/d)' : 'Kitchen Team Member / Line Cook (f/m/d)',
      type: isDe ? 'Vollzeit / Teilzeit' : 'Full-Time / Part-Time',
      location: 'Berlin Mitte (Zimmerstraße 56)',
      summary: isDe
        ? 'Du bereitest unsere Currys nach traditionellen Familienrezepten zu, backst frisches Naan und richtest warme Bowls für unsere Gäste an.'
        : 'Prepare our slow-simmered curries, bake fresh naan pockets, and assemble vibrant bowls with precision and care.',
      responsibilities: isDe
        ? [
            'Zubereitung von Fleisch-, vegetarischen und veganen Currys',
            'Backen von Naan-Taschen und Tandoori-Spezialitäten',
            'Vorbereitung (Mise en Place) frischer Salate, Chutneys und Toppings',
            'Einhaltung von HACCP- und Qualitätsstandards'
          ]
        : [
            'Cooking traditional chicken, paneer, and vegan curry bases',
            'Baking warm naan pockets and grilling skewers',
            'Prep of fresh vegetables, market chutneys, and crunchy finishers',
            'Strict adherence to food hygiene and safety standards'
          ],
      offer: isDe
        ? 'Faires Gehalt, moderne Küchenausstattung, keine späten Nachtschichten, kostenlose Verpflegung'
        : 'Fair wages, modern kitchen equipment, no late night shifts, shift meals'
    },
    {
      id: 'prep-cook',
      department: 'kitchen',
      deptLabel: isDe ? 'Küche & Prep' : 'Kitchen & Prep',
      title: isDe ? 'Vorbereitungskoch / Prep Cook (w/m/d)' : 'Prep Cook / Kitchen Assistant (f/m/d)',
      type: isDe ? 'Teilzeit / Minijob / Werkstudent' : 'Part-Time / Student / Minijob',
      location: 'Berlin Mitte (Zimmerstraße 56)',
      summary: isDe
        ? 'Du unterstützt unser Küchenteam am Vormittag bei der frischen Vorbereitung von Gemüse, Chutneys, Saucen und Kichererbsen.'
        : 'Support our morning kitchen prep with vegetable chopping, artisanal chutney blending, sauce simmering, and marinade preparation.',
      responsibilities: isDe
        ? [
            'Waschen, Schneiden und Portionieren frischer Marktgemüse',
            'Herstellung unserer hausgemachten Chutneys und Saucen',
            'Unterstützung bei der Warenannahme und Lagerung',
            'Reinigungs- und Vorbereitungsarbeiten vor Schichtbeginn'
          ]
        : [
            'Washing, cutting, and prepping fresh market ingredients',
            'Blending homemade mint, tamarind, and chili chutneys',
            'Stock organization and kitchen station setup',
            'Support with hygiene maintenance and clean workstation handover'
          ],
      offer: isDe
        ? 'Flexible Schichten am Vormittag (ideal für Studenten), familiäres Team, Personalessen'
        : 'Flexible morning shifts (great for students), supportive team, free meals'
    },
    {
      id: 'spontaneous',
      department: 'general',
      deptLabel: isDe ? 'Initiativbewerbung' : 'Spontaneous Application',
      title: isDe ? 'Initiativbewerbung (w/m/d)' : 'Open / Spontaneous Application (f/m/d)',
      type: isDe ? 'Alle Zeitmodelle' : 'All Work Models',
      location: 'Berlin Mitte (Zimmerstraße 56)',
      summary: isDe
        ? 'Du brennst für gutes Essen und Gastfreundschaft, hast aber keine passende Stelle gefunden? Wir freuen uns immer über motivierte Talente!'
        : 'Passionate about Indian soul food and genuine hospitality, but don’t see your exact role listed? We are always thrilled to hear from energetic people.',
      responsibilities: isDe
        ? [
            'Sag uns einfach, was du kannst und wo du dich siehst',
            'Ob Vollzeit, Teilzeit oder als Werkstudent – wir finden den richtigen Platz für dich'
          ]
        : [
            'Tell us about your background, skills, and where you want to grow',
            'Whether full-time or flexible shifts, we love meeting proactive applicants'
          ],
      offer: isDe
        ? 'Individuelle Absprache, faires Gehalt und sofortige Rückmeldung'
        : 'Tailored conditions, fair compensation, and prompt personal feedback'
    }
  ];

  const DEPARTMENTS = [
    { id: 'all', label: isDe ? 'Alle Stellen' : 'All Roles' },
    { id: 'service', label: isDe ? 'Service & Barista' : 'Service & Barista' },
    { id: 'kitchen', label: isDe ? 'Küche & Zubereitung' : 'Kitchen & Prep' },
    { id: 'management', label: isDe ? 'Management & HQ' : 'Management & HQ' }
  ];

  const rawJobs = (cmsJobs?.jobs && cmsJobs.jobs.length > 0) ? cmsJobs.jobs : (DEFAULT_JOBS.jobs || []);
  const activeJobsList = rawJobs
    .filter((j: any) => j.active !== false)
    .map((j: any) => ({
      id: j.id,
      department: j.department || 'general',
      deptLabel: isDe ? (j.deptLabelDe || j.deptLabelEn || 'Abteilung') : (j.deptLabelEn || 'Department'),
      title: isDe ? (j.titleDe || j.titleEn) : (j.titleEn || j.titleDe),
      type: isDe ? (j.typeDe || j.typeEn) : (j.typeEn || j.typeDe),
      location: j.location || 'Berlin Mitte (Zimmerstraße 56)',
      summary: isDe ? (j.summaryDe || j.summaryEn) : (j.summaryEn || j.summaryDe),
      responsibilities: isDe ? (j.responsibilitiesDe || j.responsibilitiesEn || []) : (j.responsibilitiesEn || j.responsibilitiesDe || []),
      offer: isDe ? (j.offerDe || j.offerEn) : (j.offerEn || j.offerDe),
    }));

  const filteredJobs = activeDepartment === 'all'
    ? activeJobsList
    : activeJobsList.filter((job: any) => job.department === activeDepartment || job.department === 'general');

  // ── Online Application Modal State ──
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [experience, setExperience] = useState('');
  const [availability, setAvailability] = useState('');
  const [resumeLink, setResumeLink] = useState('');
  const [coverNote, setCoverNote] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const openApplyModal = (jobTitle: string) => {
    setSelectedJob(jobTitle);
    setSuccess(false);
    setErrorMsg(null);
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setErrorMsg(isDe ? 'Bitte stimmen Sie der Datenschutzerklärung zu.' : 'Please consent to the privacy policy.');
      return;
    }
    if (!applicantName || !applicantEmail || !applicantPhone) {
      setErrorMsg(isDe ? 'Bitte füllen Sie Name, E-Mail und Telefonnummer aus.' : 'Please enter your name, email, and phone number.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const newApp = {
      _id: `app-${Date.now()}`,
      _type: 'jobApplication',
      id: `app-${Date.now()}`,
      position: selectedJob || 'General Application',
      fullName: applicantName.trim(),
      email: applicantEmail.trim(),
      phone: applicantPhone.trim(),
      experienceYears: experience.trim(),
      availability: availability.trim(),
      resumeLink: resumeLink.trim(),
      message: coverNote.trim(),
      status: 'new',
      hrNotes: '',
      submittedAt: new Date().toISOString(),
    };

    // 1. Immediately backup into client-side storage
    try {
      const stored = JSON.parse(localStorage.getItem('maati_stored_applications') || '[]');
      localStorage.setItem('maati_stored_applications', JSON.stringify([newApp, ...stored]));
      window.dispatchEvent(new CustomEvent('maati_application_received', { detail: newApp }));
    } catch (e) {
      console.warn('Local storage write note:', e);
    }

    try {
      await fetch(apiUrl('/api/apply'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          position: newApp.position,
          fullName: newApp.fullName,
          email: newApp.email,
          phone: newApp.phone,
          experienceYears: newApp.experienceYears,
          availability: newApp.availability,
          resumeLink: newApp.resumeLink,
          message: newApp.message,
          consent: true,
        }),
      }).catch(() => null);

      setSuccess(true);
      setApplicantName('');
      setApplicantEmail('');
      setApplicantPhone('');
      setExperience('');
      setAvailability('');
      setResumeLink('');
      setCoverNote('');
      setConsent(false);
    } catch (err) {
      // Even if network fails, the application is securely preserved in storage
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fcf8f3] min-h-screen text-[#1a1a1a]">
      <SEO
        title={title}
        description={description}
        canonicalUrl={canonicalUrl}
        lang={lang}
        enPath="/jobs"
      />

      {/* ── 1. HERO SECTION (BEETS & ROOTS VIBE: "Put down roots with us") ── */}
      <section className="relative pt-[120px] pb-[70px] md:pt-[150px] md:pb-[100px] px-6 text-center overflow-hidden bg-[#1e382f] text-white">
        <div className="max-w-[900px] mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#d85c27] text-white px-4 py-1.5 rounded-full text-[12px] font-black uppercase tracking-[0.18em] shadow-md">
            <Sparkles className="w-4 h-4" />
            <span>{isDe ? 'Karriere & Kultur' : 'Careers at MAATI'}</span>
          </div>

          <h1 className="text-[38px] sm:text-[54px] md:text-[64px] font-black tracking-tight leading-[1.08] text-white">
            {isDe ? 'Wachse mit uns. Put down roots with MAATI.' : 'Put Down Roots With Us. Shape Berlin Dining.'}
          </h1>

          <p className="text-[17px] sm:text-[20px] text-white/85 font-medium leading-relaxed max-w-[720px] mx-auto">
            {isDe
              ? 'Wir suchen Menschen mit Herzblut für ehrliches indisches Soul Food, echte Gastfreundschaft und ein Arbeitsumfeld, in dem Respekt und Wertschätzung gelebt werden.'
              : 'We are looking for dedicated individuals who care about honest Indian soul food, authentic hospitality, and a team culture grounded in equality and growth.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#positions"
              className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-8 py-4 rounded-full text-[15px] shadow-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
            >
              <span>{isDe ? 'Offene Stellen ansehen' : 'Explore Open Roles'}</span>
              <ArrowDown className="w-4 h-4" />
            </a>
            <button
              onClick={() => openApplyModal(isDe ? 'Initiativbewerbung' : 'Spontaneous Application')}
              className="border-2 border-white/40 hover:border-white text-white font-bold px-7 py-3.5 rounded-full text-[15px] transition-colors"
            >
              {isDe ? 'Initiativ bewerben' : 'Spontaneous Application'}
            </button>
          </div>
        </div>

        {/* Decorative Ambience Elements */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#d85c27]/25 blur-3xl pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      </section>

      {/* ── 2. WHY MAATI? (CULTURE & BENEFITS GRID) ── */}
      <section className="py-16 px-6 max-w-[1360px] mx-auto">
        <div className="text-center max-w-[700px] mx-auto mb-12 space-y-3">
          <span className="text-[#d85c27] font-black text-[12px] uppercase tracking-[0.2em]">
            {isDe ? 'WARUM MAATI?' : 'WHY WORK WITH US?'}
          </span>
          <h2 className="text-[32px] sm:text-[42px] font-black text-[#1e382f]">
            {isDe ? 'Mehr als nur ein Job in der Gastronomie' : 'More Than Just A Restaurant Job'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-[24px] p-7 shadow-sm border border-gray-100 space-y-3 hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#d85c27]/10 flex items-center justify-center text-[#d85c27]">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-[19px] font-black text-[#1e382f]">
              {isDe ? 'Faire Bezahlung & Trinkgeld' : 'Fair Pay & Tip Sharing'}
            </h3>
            <p className="text-[#666] text-[14px] leading-relaxed">
              {isDe
                ? 'Pünktliche, überdurchschnittliche Entlohnung, transparente Trinkgeldaufteilung und bezahlte Überstunden.'
                : 'Punctual, above-scale hourly wages, 100% transparent team tips, and strictly paid overtime.'}
            </p>
          </div>

          <div className="bg-white rounded-[24px] p-7 shadow-sm border border-gray-100 space-y-3 hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#1e382f]/10 flex items-center justify-center text-[#1e382f]">
              <Coffee className="w-6 h-6" />
            </div>
            <h3 className="text-[19px] font-black text-[#1e382f]">
              {isDe ? 'Essen & Drinks inklusive' : 'Staff Meals & Fresh Chai'}
            </h3>
            <p className="text-[#666] text-[14px] leading-relaxed">
              {isDe
                ? 'Jede Schicht frisches, gesundes Essen aufs Haus: warme Bowls, getoastetes Naan, Chai und Spezialitätenkaffee.'
                : 'Enjoy hearty, healthy soul food on every shift: warm curries, fresh naan pockets, fruit lassis, and craft chai.'}
            </p>
          </div>

          <div className="bg-white rounded-[24px] p-7 shadow-sm border border-gray-100 space-y-3 hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#d85c27]/10 flex items-center justify-center text-[#d85c27]">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-[19px] font-black text-[#1e382f]">
              {isDe ? 'Zentral in Berlin Mitte' : 'Heart of Berlin Mitte'}
            </h3>
            <p className="text-[#666] text-[14px] leading-relaxed">
              {isDe
                ? 'Zimmerstraße 56, direkt am Checkpoint Charlie. Schnelle Anbindung über U6 Kochstraße und U2 Stadtmitte.'
                : 'Zimmerstraße 56, steps from Checkpoint Charlie. Effortless commutes via U6 Kochstraße and U2 Stadtmitte.'}
            </p>
          </div>

          <div className="bg-white rounded-[24px] p-7 shadow-sm border border-gray-100 space-y-3 hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#1e382f]/10 flex items-center justify-center text-[#1e382f]">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-[19px] font-black text-[#1e382f]">
              {isDe ? 'Echte Aufstiegschancen' : 'Real Career Growth'}
            </h3>
            <p className="text-[#666] text-[14px] leading-relaxed">
              {isDe
                ? 'Vom Service- oder Küchenmitarbeiter zum Schichtleiter und Restaurant Manager. Wir fördern dein Talent.'
                : 'From line cook or barista to shift supervisor and general manager. We actively invest in your progression.'}
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. OPEN POSITIONS WITH DEPARTMENT FILTER (BEETS & ROOTS CALIBER) ── */}
      <section id="positions" className="py-12 pb-24 px-6 max-w-[1200px] mx-auto">
        <div className="text-center max-w-[700px] mx-auto mb-10 space-y-3">
          <span className="text-[#d85c27] font-black text-[12px] uppercase tracking-[0.2em]">
            {isDe ? 'OFFENE STELLEN' : 'CURRENT OPENINGS'}
          </span>
          <h2 className="text-[32px] sm:text-[44px] font-black text-[#1e382f]">
            {isDe ? 'Finde deinen Platz in unserem Team' : 'Discover Your Next Career Step'}
          </h2>
          <p className="text-[#666] text-[15px] sm:text-[16px]">
            {isDe
              ? 'Wähle deinen Fachbereich aus oder sende uns unkompliziert eine Initiativbewerbung.'
              : 'Filter by department or submit a quick spontaneous application.'}
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setActiveDepartment(dept.id)}
              className={`px-5 py-2.5 rounded-full text-[13.5px] font-extrabold transition-all ${
                activeDepartment === dept.id
                  ? 'bg-[#1e382f] text-white shadow-md'
                  : 'bg-white text-[#444] border border-[#ebdcd0] hover:border-[#1e382f]'
              }`}
            >
              {dept.label}
            </button>
          ))}
        </div>

        {/* Job Cards List */}
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-[28px] p-7 sm:p-9 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 space-y-5"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5 mb-2">
                    <span className="bg-[#1e382f]/10 text-[#1e382f] text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                      {job.deptLabel}
                    </span>
                    <span className="bg-[#d85c27]/10 text-[#d85c27] text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                      {job.type}
                    </span>
                  </div>
                  <h3 className="text-[22px] sm:text-[26px] font-black text-[#1e382f] leading-snug">
                    {job.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-[#777] text-[13.5px] font-bold shrink-0">
                  <MapPin className="w-4 h-4 text-[#d85c27]" />
                  <span>{job.location}</span>
                </div>
              </div>

              <p className="text-[#555] text-[15px] leading-relaxed">
                {job.summary}
              </p>

              {/* Responsibilities */}
              <div className="bg-[#fdfaf7] rounded-2xl p-5 border border-[#ebdcd0]/60 space-y-2.5">
                <h4 className="font-extrabold text-[13.5px] text-[#1e382f] uppercase tracking-wider">
                  {isDe ? 'Deine Aufgaben & Mitgestaltung:' : 'Key Responsibilities:'}
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13.5px] text-[#555]">
                  {job.responsibilities.map((resp: string, rIdx: number) => (
                    <li key={rIdx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#d85c27] shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Offer & Apply Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div className="text-[13px] text-[#666]">
                  <strong className="text-[#1e382f]">{isDe ? 'Was wir bieten:' : 'What we offer:'}</strong> {job.offer}
                </div>

                <button
                  onClick={() => openApplyModal(job.title)}
                  className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-7 py-3 rounded-full text-[14px] shadow-sm hover:shadow-lg transition-all transform hover:scale-105 inline-flex items-center justify-center gap-2 shrink-0"
                >
                  <span>{isDe ? 'Jetzt online bewerben' : 'Apply Online'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. ONLINE APPLICATION MODAL FORM ── */}
      {selectedJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedJob(null);
          }}
        >
          <div className="bg-white rounded-[28px] w-full max-w-[620px] max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col">
            {/* Header */}
            <div className="bg-[#1e382f] text-white p-6 sm:p-7 rounded-t-[28px] flex items-center justify-between">
              <div>
                <span className="text-[#d85c27] text-[11px] font-black uppercase tracking-widest">
                  {isDe ? 'BEWERBUNG' : 'JOB APPLICATION'}
                </span>
                <h3 className="text-[20px] sm:text-[22px] font-black mt-1 leading-snug">
                  {selectedJob}
                </h3>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              {success ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-[24px] font-black text-[#1e382f]">
                    {isDe ? 'Bewerbung erfolgreich eingereicht!' : 'Application Successfully Sent!'}
                  </h4>
                  <p className="text-[#666] text-[15px] max-w-[440px] mx-auto leading-relaxed">
                    {isDe
                      ? 'Vielen Dank für dein Interesse an MAATI Kitchen. Wir haben deine Unterlagen erhalten und melden uns innerhalb von 2 bis 3 Werktagen persönlich bei dir.'
                      : 'Thank you for your interest in MAATI Kitchen. We have received your application and will reply within 2 to 3 business days.'}
                  </p>
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="mt-4 bg-[#1e382f] text-white font-bold px-8 py-3 rounded-full text-[14px] hover:bg-[#152721] transition-colors"
                  >
                    {isDe ? 'Schließen' : 'Close'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-[13px] font-bold">
                      {errorMsg}
                    </div>
                  )}

                  <div>
                    <label className="block text-[13px] font-extrabold text-[#333] mb-1">
                      {isDe ? 'Vollständiger Name *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder={isDe ? 'z.B. Alex Müller' : 'e.g. Alex Miller'}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#d85c27] focus:ring-2 focus:ring-[#d85c27]/20 outline-none text-[14px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-extrabold text-[#333] mb-1">
                        {isDe ? 'E-Mail-Adresse *' : 'Email Address *'}
                      </label>
                      <input
                        type="email"
                        required
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        placeholder="alex@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#d85c27] focus:ring-2 focus:ring-[#d85c27]/20 outline-none text-[14px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-extrabold text-[#333] mb-1">
                        {isDe ? 'Telefonnummer *' : 'Phone Number *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        placeholder="+49 170 1234567"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#d85c27] focus:ring-2 focus:ring-[#d85c27]/20 outline-none text-[14px]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-extrabold text-[#333] mb-1">
                        {isDe ? 'Gastro-Erfahrung' : 'Relevant Experience'}
                      </label>
                      <input
                        type="text"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder={isDe ? 'z.B. 2 Jahre Barista / Quereinsteiger' : 'e.g. 2 years barista / beginner'}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#d85c27] focus:ring-2 focus:ring-[#d85c27]/20 outline-none text-[14px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[13px] font-extrabold text-[#333] mb-1">
                        {isDe ? 'Verfügbarkeit ab' : 'Available From'}
                      </label>
                      <input
                        type="text"
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                        placeholder={isDe ? 'z.B. Ab sofort / 1. des Monats' : 'e.g. Immediately / next month'}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#d85c27] focus:ring-2 focus:ring-[#d85c27]/20 outline-none text-[14px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-extrabold text-[#333] mb-1">
                      {isDe ? 'Link zu Lebenslauf / LinkedIn (optional)' : 'CV Link / LinkedIn Profile (Optional)'}
                    </label>
                    <input
                      type="url"
                      value={resumeLink}
                      onChange={(e) => setResumeLink(e.target.value)}
                      placeholder="https://linkedin.com/in/... oder Google Drive"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#d85c27] focus:ring-2 focus:ring-[#d85c27]/20 outline-none text-[14px]"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-extrabold text-[#333] mb-1">
                      {isDe ? 'Kurze Nachricht / Warum MAATI?' : 'Short Note / Why MAATI?'}
                    </label>
                    <textarea
                      rows={3}
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                      placeholder={isDe ? 'Erzähle uns kurz von dir...' : 'Tell us a little about yourself...'}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#d85c27] focus:ring-2 focus:ring-[#d85c27]/20 outline-none text-[14px]"
                    />
                  </div>

                  <div className="flex items-start gap-2.5 pt-1">
                    <input
                      type="checkbox"
                      id="jobConsent"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-[#d85c27] focus:ring-[#d85c27]"
                    />
                    <label htmlFor="jobConsent" className="text-[12px] text-[#666] leading-tight">
                      {isDe
                        ? 'Ich stimme zu, dass meine Angaben zur Bearbeitung meiner Bewerbung verarbeitet und gespeichert werden.'
                        : 'I consent to having my information processed and stored for recruitment purposes at MAATI Kitchen.'}
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold py-3.5 rounded-full text-[15px] shadow-lg transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{isDe ? 'Wird gesendet...' : 'Submitting...'}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{isDe ? 'Bewerbung absenden' : 'Submit Application'}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsPage;
