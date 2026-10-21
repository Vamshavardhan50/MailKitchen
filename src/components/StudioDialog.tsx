import { useEffect, useRef, type ReactNode } from 'react';

// Native dialogs provide keyboard focus trapping and make the page behind them inert.
export function StudioDialog({ title, onClose, busy, children }: { title: string; onClose: () => void; busy: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    ref.current?.showModal();
    return () => { ref.current?.close(); previous?.focus(); };
  }, []);
  return <dialog ref={ref} aria-label={title} onCancel={event => { event.preventDefault(); if (!busy) onClose(); }} className="fixed inset-0 m-0 max-w-none max-h-none w-screen h-[100dvh] p-0 bg-transparent text-inherit">
    {children}
  </dialog>;
}
