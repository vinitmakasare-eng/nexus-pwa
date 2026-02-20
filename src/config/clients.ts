export interface ThemeConfig {
    primaryColor: string;
    accentColor: string;
    logoIcon: string;
}

export type StepId = 'vin-capture' | 'vehicle-details' | 'photo-capture' | 'review-submit';

export interface ClientConfig {
    id: string;
    name: string;
    theme: ThemeConfig;
    flow: StepId[];
}

export const CLIENT_CONFIGS: Record<string, ClientConfig> = {
    'art': {
        id: 'art',
        name: 'ART-WEBAPP',
        theme: {
            primaryColor: '#8b5cf6', // Purple
            accentColor: '#06b6d4', // Cyan
            logoIcon: '🚀'
        },
        flow: ['vin-capture', 'vehicle-details', 'photo-capture', 'review-submit']
    },
    'lincoln': {
        id: 'lincoln',
        name: 'Lincoln',
        theme: {
            primaryColor: '#ef4444', // Red
            accentColor: '#f59e0b', // Amber
            logoIcon: '🔥'
        },
        flow: ['vehicle-details', 'photo-capture', 'review-submit'] // No VIN screen
    },
    'nia': {
        id: 'nia',
        name: 'NIA',
        theme: {
            primaryColor: '#10b981', // Emerald
            accentColor: '#3b82f6', // Blue
            logoIcon: '🛡️'
        },
        flow: ['vehicle-details', 'vin-capture', 'photo-capture', 'review-submit'] // Different order
    }
};

export const DEFAULT_CLIENT_ID = 'art';
