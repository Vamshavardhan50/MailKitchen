import { sanityClient, isSanityConfigured } from './sanity';

// One shared subscription for the public site and every editor section.
const callbacks = new Set<() => void>();
let stop: (() => void) | undefined;

export function refreshPublishedContent() {
  callbacks.forEach(refresh => refresh());
}

export function subscribeToPublishedContent(refresh: () => void) {
  callbacks.add(refresh);
  if (!stop && typeof window !== 'undefined') {
    let debounce: ReturnType<typeof setTimeout>;
    const schedule = () => {
      clearTimeout(debounce);
      debounce = setTimeout(refreshPublishedContent, 200);
    };
    const onVisible = () => { if (!document.hidden) schedule(); };
    const subscription = isSanityConfigured ? sanityClient.listen(
      '*[!(_id in path("drafts.**"))]', {},
      { includeResult: false, events: ['mutation'], visibility: 'query' },
    ).subscribe({ next: schedule, error: () => { /* Polling below also covers blocked streams. */ } }) : undefined;
    const timer = setInterval(onVisible, 30000);
    window.addEventListener('focus', schedule);
    window.addEventListener('online', schedule);
    document.addEventListener('visibilitychange', onVisible);
    stop = () => {
      subscription?.unsubscribe();
      clearTimeout(debounce);
      clearInterval(timer);
      window.removeEventListener('focus', schedule);
      window.removeEventListener('online', schedule);
      document.removeEventListener('visibilitychange', onVisible);
      stop = undefined;
    };
  }
  return () => {
    callbacks.delete(refresh);
    if (!callbacks.size) stop?.();
  };
}
