import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, User, Mail, Phone, MessageSquare, CheckCircle2 } from 'lucide-react';
import { DICTIONARY } from '../data/content';
import { useContactContent } from '../lib/sanityService';

interface ReservationSectionProps {
  lang: 'de' | 'en';
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const ReservationSection: React.FC<ReservationSectionProps> = ({ lang, isOpen, onClose, onOpen }) => {
  const text = DICTIONARY[lang];
  const { content: contactContent } = useContactContent();
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div className="bg-white rounded-[28px] w-full max-w-[850px] max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col">

            {/* Modal Header */}
            <div className="bg-[#1e382f] text-white p-6 md:p-8 rounded-t-[28px] flex items-center justify-between relative">
              <div>
                <span className="text-[#d85c27] text-[11px] font-black uppercase tracking-widest">MAATI Kitchen Berlin</span>
                <h3 className="text-[24px] md:text-[28px] font-black mt-1">{text.res_modal_title}</h3>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Embedded Official TheFork Widget */}
            <div className="p-2 sm:p-4 bg-white flex-1 min-h-[650px] overflow-hidden">
              <iframe
                src={`https://widget.thefork.com/${contactContent.theforkWidgetId || '7beffe40-786f-496c-b196-48b939750c77'}`}
                allow="payment *"
                title="TheFork Reservation Widget"
                style={{
                  width: '100%',
                  minHeight: '650px',
                  border: 'none',
                  borderRadius: '20px',
                  overflow: 'scroll'
                }}
              />
            </div>

          </div>
        </div>
      )}
    </>
  );
};


