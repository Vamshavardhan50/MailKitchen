import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, User, Mail, Phone, MessageSquare, CheckCircle2 } from 'lucide-react';
import { DICTIONARY } from '../data/content';
import { useContactContent, useReservationContent } from '../lib/sanityService';

interface ReservationSectionProps {
  lang: 'de' | 'en';
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const ReservationSection: React.FC<ReservationSectionProps> = ({ lang, isOpen, onClose, onOpen }) => {
  const text = DICTIONARY[lang];
  const { content: contactContent } = useContactContent();
  const { content: reservationContent } = useReservationContent();
  const [guests, setGuests] = useState('2');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [special, setSpecial] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
      setSubmitted(false);
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  const TIME_SLOTS = [
    { label: '11:30 AM', value: '11:30', disabled: false },
    { label: '12:00 PM', value: '12:00', disabled: false },
    { label: '12:30 PM', value: '12:30', disabled: false },
    { label: '1:00 PM', value: '13:00', disabled: false },
    { label: '1:30 PM', value: '13:30', disabled: false },
    { label: '2:00 PM', value: '14:00', disabled: false },
    { label: '5:30 PM', value: '17:30', disabled: false },
    { label: '6:00 PM', value: '18:00', disabled: false },
    { label: '6:30 PM', value: '18:30', disabled: false },
    { label: '7:00 PM', value: '19:00', disabled: false },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  return (
    <>
      {/* Modern Ultra-Sleek Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div className="bg-white rounded-t-[28px] sm:rounded-[28px] w-full max-w-[850px] max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col animate-slide-down">

            {/* Modal Header */}
            <div className="bg-[#1e382f] text-white p-5 sm:p-6 md:p-8 rounded-t-[28px] flex items-center justify-between relative">
              <div>
                <span className="text-[#d85c27] text-[11px] font-black uppercase tracking-widest">MAATI Kitchen Berlin</span>
                <h3 className="text-[22px] sm:text-[24px] md:text-[28px] font-black mt-1">
                  {(lang === 'de' ? reservationContent.titleDe : reservationContent.titleEn) || text.res_modal_title}
                </h3>
                {((lang === 'de' ? reservationContent.subtitleDe : reservationContent.subtitleEn) || reservationContent.noticeEn) && (
                  <p className="text-[12.5px] text-white/75 mt-1 font-medium">
                    {(lang === 'de' ? (reservationContent.subtitleDe || reservationContent.noticeDe) : (reservationContent.subtitleEn || reservationContent.noticeEn))}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors active-press"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Embedded Official TheFork Widget */}
            <div className="p-1 sm:p-4 bg-white flex-1 min-h-[520px] sm:min-h-[650px] overflow-hidden">
              <iframe
                src={`https://widget.thefork.com/${reservationContent.theforkWidgetId || contactContent.theforkWidgetId || '7beffe40-786f-496c-b196-48b939750c77'}`}
                allow="payment *"
                title="TheFork Reservation Widget"
                style={{
                  width: '100%',
                  minHeight: '520px',
                  border: 'none',
                  borderRadius: '20px',
                  overflow: 'scroll'
                }}
              />
            </div>

            <div className="p-5 border-t border-gray-100 text-sm text-gray-700 space-y-2">
              <p>{lang === 'de' ? reservationContent.noticeDe : reservationContent.noticeEn}</p>
              <p>{lang === 'de' ? `Für Gruppen mit mehr als ${reservationContent.maxPartySize || 8} Personen kontaktieren Sie uns bitte direkt.` : `For groups larger than ${reservationContent.maxPartySize || 8}, please contact us directly.`}</p>
              <p className="flex flex-wrap gap-4">
                <a className="underline" href={`tel:${(reservationContent.phone || contactContent.phone || '').replace(/\s/g, '')}`}>{reservationContent.phone || contactContent.phone}</a>
                <a className="underline" href={`mailto:${reservationContent.email || contactContent.email || ''}`}>{reservationContent.email || contactContent.email}</a>
                {reservationContent.theforkUrl && <a className="underline" href={reservationContent.theforkUrl} target="_blank" rel="noopener noreferrer">{lang === 'de' ? 'Buchung in neuem Tab öffnen' : 'Open booking in a new tab'} ↗</a>}
              </p>
            </div>

          </div>
        </div>
      )}
    </>
  );
};


