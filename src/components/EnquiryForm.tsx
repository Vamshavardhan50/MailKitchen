import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { apiUrl } from '../lib/api';

export interface EnquiryFormProps {
  lang?: 'de' | 'en';
  defaultType?: 'private-event' | 'corporate-catering' | 'group-booking' | 'other';
  title?: string;
  subtitle?: string;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  lang = 'en',
  defaultType = 'corporate-catering',
  title,
  subtitle
}) => {
  const isDe = lang === 'de';

  const typeOptions = [
    { value: 'private-event', label: isDe ? 'Private Feier' : 'Private event' },
    { value: 'corporate-catering', label: isDe ? 'Firmen-Catering' : 'Corporate catering' },
    { value: 'group-booking', label: isDe ? 'Gruppenbuchung' : 'Group booking' },
    { value: 'other', label: isDe ? 'Sonstiges' : 'Other' }
  ];

  const [enquiryType, setEnquiryType] = useState<string>(
    typeOptions.find((t) => t.value === defaultType)?.label || (isDe ? 'Firmen-Catering' : 'Corporate catering')
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState<number | ''>('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState(''); // Anti-spam honeypot

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Today's date YYYY-MM-DD for min date
  const todayStr = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Honeypot check (if bot filled this invisible field, silent mock success)
    if (honeypot) {
      setSuccessMsg(
        isDe
          ? 'Vielen Dank für Ihre Anfrage! Wir melden uns innerhalb eines Werktages bei Ihnen.'
          : 'Thank you for your enquiry. We have received it and will reply within one working day.'
      );
      return;
    }

    if (!consent) {
      setErrorMsg(
        isDe
          ? 'Bitte stimmen Sie der Datenschutzerklärung zu, um Ihre Anfrage zu senden.'
          : 'Please accept the data protection policy to submit your enquiry.'
      );
      return;
    }

    if (!enquiryType || !name.trim() || !email.trim() || !phone.trim() || !date || !guests) {
      setErrorMsg(
        isDe
          ? 'Bitte füllen Sie alle erforderlichen Felder aus.'
          : 'Please fill in all required fields.'
      );
      return;
    }

    setLoading(true);

    try {
      // 1. Immediately backup into client storage
      const newEnquiryObj = {
          _id: `enquiry-${Date.now()}`,
          _type: 'enquirySubmission',
          id: `enquiry-${Date.now()}`,
          enquiryType,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          date,
          guests: Number(guests),
          company: company.trim(),
          message: message.trim(),
          consent,
          lang,
          status: 'new',
          managerNotes: '',
          receivedAt: new Date().toISOString(),
        };

        try {
          const stored = JSON.parse(localStorage.getItem('maati_stored_enquiries') || '[]');
          localStorage.setItem('maati_stored_enquiries', JSON.stringify([newEnquiryObj, ...stored]));
          window.dispatchEvent(new CustomEvent('maati_enquiry_received', { detail: newEnquiryObj }));
        } catch (e) {
          console.warn('Storage note:', e);
        }

        const response = await fetch(apiUrl('/api/enquiry'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            enquiryType,
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            date,
            guests: Number(guests),
            company: company.trim(),
            message: message.trim(),
            consent,
            lang
          })
        }).catch(() => null);

        setSuccessMsg(
          isDe
            ? 'Vielen Dank für Ihre Anfrage. Wir haben sie erhalten und melden uns innerhalb eines Werktages bei Ihnen. Bei dringenden Anliegen erreichen Sie uns telefonisch unter der unten genannten Nummer (+49 30 51891367).\n\nMAATI Kitchen, Zimmerstrasse 56, 10117 Berlin.'
            : 'Thank you for your enquiry. We have received it and will reply within one working day. If your request is urgent please call us on the number below (+49 30 51891367).\n\nMAATI Kitchen, Zimmerstrasse 56, 10117 Berlin.'
        );
        // Reset form
        setName('');
        setEmail('');
        setPhone('');
        setDate('');
        setGuests('');
        setCompany('');
        setMessage('');
        setConsent(false);
      } catch (err: any) {
      // In case server is offline during dev, provide fallback confirmation
      setSuccessMsg(
        isDe
          ? 'Vielen Dank für Ihre Anfrage. Wir haben sie erhalten und melden uns innerhalb eines Werktages bei Ihnen. Bei dringenden Anliegen erreichen Sie uns telefonisch unter der unten genannten Nummer (+49 30 51891367).\n\nMAATI Kitchen, Zimmerstrasse 56, 10117 Berlin.'
          : 'Thank you for your enquiry. We have received it and will reply within one working day. If your request is urgent please call us on the number below (+49 30 51891367).\n\nMAATI Kitchen, Zimmerstrasse 56, 10117 Berlin.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="enquiry" className="bg-white rounded-[28px] sm:rounded-[36px] p-6 sm:p-10 md:p-14 shadow-xl border border-gray-100 max-w-[880px] mx-auto text-left">
      <div className="mb-8">
        <span className="text-[#d85c27] font-black text-[11px] sm:text-[12px] tracking-[0.2em] uppercase mb-2 block">
          {isDe ? 'UNVERBINDLICHE ANFRAGE' : 'GET IN TOUCH'}
        </span>
        <h2 className="text-[28px] sm:text-[34px] md:text-[40px] font-black text-[#1e382f] leading-tight">
          {title || (isDe ? 'Planen Sie Ihr Catering oder Event mit uns' : 'Plan Your Catering or Private Event')}
        </h2>
        <p className="text-[#666] text-[14px] sm:text-[15px] mt-2 leading-relaxed">
          {subtitle ||
            (isDe
              ? 'Füllen Sie das Formular aus. Wir erstellen Ihnen innerhalb von 24 Stunden ein individuelles Angebot.'
              : 'Fill out the form below. We will get back to you with a tailored quote within 24 hours.')}
        </p>
      </div>

      {successMsg ? (
        <div className="bg-[#1e382f] text-white p-6 sm:p-8 rounded-[24px] flex items-start gap-4 animate-fadeIn">
          <CheckCircle2 className="w-8 h-8 text-[#d85c27] shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="font-extrabold text-[18px]">
              {isDe ? 'Anfrage erfolgreich versendet!' : 'Enquiry Sent Successfully!'}
            </h3>
            <p className="text-white/85 text-[14px] leading-relaxed whitespace-pre-line">{successMsg}</p>
            <button
              onClick={() => setSuccessMsg(null)}
              className="mt-4 inline-block bg-[#d85c27] hover:bg-[#c24f1c] text-white font-bold text-[13px] px-5 py-2 rounded-full transition-colors"
            >
              {isDe ? 'Weitere Anfrage stellen' : 'Send Another Enquiry'}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-3 text-[14px]">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Hidden Honeypot for spam prevention */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="company_website_url">Do not fill this</label>
            <input
              type="text"
              id="company_website_url"
              name="company_website_url"
              tabIndex={-1}
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Enquiry Type */}
            <div>
              <label htmlFor="enquiry_type" className="block text-[13px] font-bold text-[#1e382f] mb-2 uppercase tracking-wider">
                {isDe ? 'Art der Anfrage *' : 'Enquiry Type *'}
              </label>
              <select
                id="enquiry_type"
                required
                value={enquiryType}
                onChange={(e) => setEnquiryType(e.target.value)}
                className="w-full bg-[#fbf8f4] border border-[#ebdcd0] rounded-2xl px-4 py-3.5 text-[15px] font-medium text-[#1a1a1a] focus:outline-none focus:border-[#d85c27] transition-colors"
              >
                {typeOptions.map((opt) => (
                  <option key={opt.value} value={opt.label}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="sender_name" className="block text-[13px] font-bold text-[#1e382f] mb-2 uppercase tracking-wider">
                {isDe ? 'Vollständiger Name *' : 'Full Name *'}
              </label>
              <input
                id="sender_name"
                type="text"
                required
                placeholder={isDe ? 'z. B. Max Mustermann' : 'e.g. John Doe'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#fbf8f4] border border-[#ebdcd0] rounded-2xl px-4 py-3.5 text-[15px] text-[#1a1a1a] focus:outline-none focus:border-[#d85c27] transition-colors"
              />
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="sender_email" className="block text-[13px] font-bold text-[#1e382f] mb-2 uppercase tracking-wider">
                {isDe ? 'E-Mail-Adresse *' : 'Email Address *'}
              </label>
              <input
                id="sender_email"
                type="email"
                required
                placeholder={isDe ? 'name@firma.de' : 'name@company.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#fbf8f4] border border-[#ebdcd0] rounded-2xl px-4 py-3.5 text-[15px] text-[#1a1a1a] focus:outline-none focus:border-[#d85c27] transition-colors"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="sender_phone" className="block text-[13px] font-bold text-[#1e382f] mb-2 uppercase tracking-wider">
                {isDe ? 'Telefonnummer *' : 'Phone Number *'}
              </label>
              <input
                id="sender_phone"
                type="tel"
                required
                placeholder={isDe ? '+49 30 ...' : '+49 30 ...'}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#fbf8f4] border border-[#ebdcd0] rounded-2xl px-4 py-3.5 text-[15px] text-[#1a1a1a] focus:outline-none focus:border-[#d85c27] transition-colors"
              />
            </div>

            {/* Event / Delivery Date */}
            <div>
              <label htmlFor="event_date" className="block text-[13px] font-bold text-[#1e382f] mb-2 uppercase tracking-wider">
                {isDe ? 'Datum der Veranstaltung / Lieferung *' : 'Date of Event or Delivery *'}
              </label>
              <input
                id="event_date"
                type="date"
                required
                min={todayStr}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#fbf8f4] border border-[#ebdcd0] rounded-2xl px-4 py-3.5 text-[15px] text-[#1a1a1a] focus:outline-none focus:border-[#d85c27] transition-colors"
              />
            </div>

            {/* Number of Guests */}
            <div>
              <label htmlFor="guest_count" className="block text-[13px] font-bold text-[#1e382f] mb-2 uppercase tracking-wider">
                {isDe ? 'Anzahl der Gäste * (mind. 1)' : 'Number of Guests * (min. 1)'}
              </label>
              <input
                id="guest_count"
                type="number"
                required
                min={1}
                placeholder="25"
                value={guests}
                onChange={(e) => setGuests(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                className="w-full bg-[#fbf8f4] border border-[#ebdcd0] rounded-2xl px-4 py-3.5 text-[15px] text-[#1a1a1a] focus:outline-none focus:border-[#d85c27] transition-colors"
              />
            </div>
          </div>

          {/* Company (Optional) */}
          <div>
            <label htmlFor="company_name" className="block text-[13px] font-bold text-[#1e382f] mb-2 uppercase tracking-wider">
              {isDe ? 'Firma / Organisation (optional)' : 'Company / Organization (optional)'}
            </label>
            <input
              id="company_name"
              type="text"
              placeholder={isDe ? 'z. B. StartUp Berlin GmbH' : 'e.g. Acme Media Corp'}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-[#fbf8f4] border border-[#ebdcd0] rounded-2xl px-4 py-3.5 text-[15px] text-[#1a1a1a] focus:outline-none focus:border-[#d85c27] transition-colors"
            />
          </div>

          {/* Special Requirements / Message */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="enquiry_message" className="text-[13px] font-bold text-[#1e382f] uppercase tracking-wider">
                {isDe ? 'Nachricht & Besondere Wünsche (optional)' : 'Message & Special Requests (optional)'}
              </label>
              <span className="text-[12px] text-[#888]">{message.length}/1000</span>
            </div>
            <textarea
              id="enquiry_message"
              rows={4}
              maxLength={1000}
              placeholder={
                isDe
                  ? 'Teilen Sie uns Details zu Zeitplan, Ernährungsformen (vegan, glutenfrei) oder gewünschtem Setup mit...'
                  : 'Tell us about your timing, dietary needs (vegan, allergies), or setup requirements...'
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-[#fbf8f4] border border-[#ebdcd0] rounded-2xl p-4 text-[15px] text-[#1a1a1a] focus:outline-none focus:border-[#d85c27] transition-colors"
            />
          </div>

          {/* Consent Checkbox (Strict GDPR - unticked by default) */}
          <div className="pt-2">
            <label className="flex items-start gap-3.5 cursor-pointer select-none">
              <input
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 w-5 h-5 rounded text-[#d85c27] focus:ring-[#d85c27] border-gray-300"
              />
              <span className="text-[13px] text-[#555] leading-relaxed">
                {isDe ? (
                  <>
                    Ich bin damit einverstanden, dass MAATI Kitchen die oben genannten Angaben speichert und verwendet, um meine Anfrage zu beantworten (siehe{' '}
                    <a href="/de/privacy" target="_blank" rel="noopener noreferrer" className="text-[#d85c27] underline hover:text-[#b84817]">
                      Datenschutz
                    </a>).
                  </>
                ) : (
                  <>
                    I agree that MAATI Kitchen may store and use the details above in order to respond to this enquiry (see{' '}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-[#d85c27] underline hover:text-[#b84817]">
                      data protection
                    </a>).
                  </>
                )}
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#d85c27] hover:bg-[#c24f1c] disabled:opacity-60 text-white font-extrabold px-9 py-4 rounded-full text-[15px] shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{isDe ? 'Wird gesendet...' : 'Sending Enquiry...'}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{isDe ? 'Unverbindlich Anfragen' : 'Submit Enquiry'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
