import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';

// Hydrate from Sanity, while keeping an in-progress edit safe from background refreshes.
export function usePublishedEditor<T>(initial: T): [T, Dispatch<SetStateAction<T>>, { dirty: boolean; reset: () => void }] {
  const [value, setValue] = useState(initial);
  const dirty = useRef(false);
  const [isDirty, setIsDirty] = useState(false);
  const current = useRef(value);
  current.current = value;
  useEffect(() => { if (!dirty.current) setValue(initial); }, [initial]);
  useEffect(() => {
    const published = (event: Event) => {
      if ((event as CustomEvent).detail?.fields === current.current) {
        dirty.current = false;
        setIsDirty(false);
      }
    };
    window.addEventListener('maati_content_published', published);
    return () => window.removeEventListener('maati_content_published', published);
  }, []);
  return [value, next => { dirty.current = true; setIsDirty(true); setValue(next); }, {
    dirty: isDirty,
    reset: () => { dirty.current = false; setIsDirty(false); setValue(initial); },
  }];
}
