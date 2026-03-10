import { useEffect } from 'react';

/**
 * Dynamically switches the favicon based on the system's preferred color
 * scheme. Swap the `href` values for your actual favicon files.
 */
export function useDynamicFavicon() {
    useEffect(() => {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');

        const update = (dark: boolean) => {
            const link =
                (document.querySelector("link[rel='icon']") as HTMLLinkElement) ??
                (() => {
                    const el = document.createElement('link');
                    el.rel = 'icon';
                    document.head.appendChild(el);
                    return el;
                })();

            // Replace with your actual dark / light favicon paths
            link.href = dark ? '/favicon-dark.svg' : '/favicon.svg';
        };

        update(mq.matches);

        const handler = (e: MediaQueryListEvent) => update(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);
}
