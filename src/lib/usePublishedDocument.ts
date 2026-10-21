import { useEffect, useState } from 'react';
import { sanityClient, isSanityConfigured } from './sanity';
import { subscribeToPublishedContent } from './cmsRefresh';

// Editors and visitors read the same document that the publishing API writes.
export function usePublishedDocument<T>(id: string, defaults: T, normalize?: (doc: any) => T) {
  const [content, setContent] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let mounted = true;
    let request = 0;
    const refresh = async () => {
      const current = ++request;
      try {
        if (!isSanityConfigured) throw new Error('The website content connection is not configured.');
        const doc = await sanityClient.fetch('*[_id == $id][0]', { id });
        if (mounted && current === request) {
          setContent({ ...defaults, ...(doc ? (normalize ? normalize(doc) : doc) : {}) });
          setError('');
        }
      } catch {
        if (mounted && current === request) setError('We could not load the latest website content. Check your connection and try again.');
      } finally {
        if (mounted && current === request) setLoading(false);
      }
    };
    const unsubscribe = subscribeToPublishedContent(refresh);
    void refresh();
    return () => { mounted = false; unsubscribe(); };
  }, [id, defaults, normalize]);
  return { content, loading, error };
}
