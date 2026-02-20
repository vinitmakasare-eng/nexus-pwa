import { defineStore } from 'pinia'
import type { ClientConfig } from '../config/clients'
import { CLIENT_CONFIGS, DEFAULT_CLIENT_ID } from '../config/clients'

export const useClientStore = defineStore('client', {
    state: () => ({
        activeClient: null as ClientConfig | null,
        loading: true,
    }),

    getters: {
        theme: (state) => {
            const client = state.activeClient || CLIENT_CONFIGS[DEFAULT_CLIENT_ID];
            return client!.theme;
        },
        clientName: (state) => {
            return state.activeClient?.name || 'Nexus PWA';
        },
        flowSteps: (state) => {
            const client = state.activeClient || CLIENT_CONFIGS[DEFAULT_CLIENT_ID];
            return client!.flow;
        },
    },

    actions: {
        async initializeClient(clientId: string | null) {
            this.loading = true;
            const id = clientId || DEFAULT_CLIENT_ID;
            const config = CLIENT_CONFIGS[id] || CLIENT_CONFIGS[DEFAULT_CLIENT_ID];

            if (config) {
                this.activeClient = config;
            }

            this.loading = false;
            this.applyTheme();
        },

        applyTheme() {
            if (!this.activeClient) return;
            const root = document.documentElement;
            root.style.setProperty('--accent-start', this.theme.primaryColor);
            root.style.setProperty('--accent-mid', this.theme.primaryColor);
            root.style.setProperty('--accent-end', this.theme.accentColor);
            root.style.setProperty('--glow-purple', `${this.theme.primaryColor}59`);
            root.style.setProperty('--glow-cyan', `${this.theme.accentColor}40`);
        }
    }
})
