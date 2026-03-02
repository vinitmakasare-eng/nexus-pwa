
export const checkIsIOS = (): boolean => {
    if (typeof window === 'undefined') return false; // Safety for SSR

    const userAgent = window.navigator.userAgent || window.navigator.vendor;

    // Standard iPhone/iPad check
    const isAppleMobile = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;

    // Detection for modern iPads that claim to be "Macintosh"
    const isIPadOS = (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    return isAppleMobile || isIPadOS;
};

// Check if the app is already installed/running in standalone mode
export const isStandalone = (): boolean => {
    if (typeof window === 'undefined') return false;

    const urlParams = new URLSearchParams(window.location.search);
    const isPwaQuery = urlParams.get('mode') === 'pwa';

    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    const isSafariStandalone = (window.navigator as any).standalone === true;

    return isStandaloneMode || isSafariStandalone || isPwaQuery;
};

export const isPwaLaunch = (): boolean => {
    if (typeof window === 'undefined') return false;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('mode') === 'pwa' || window.location.search.includes('mode=pwa');
};


