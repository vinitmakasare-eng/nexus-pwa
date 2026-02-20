import { defineStore } from 'pinia'

export interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}

const STORAGE_KEY_USER = 'blaze_auth_user';
const STORAGE_KEY_TOKEN = 'blaze_auth_token';

export const useAuthStore = defineStore('auth', {
    state: () => {
        const storedUser = localStorage.getItem(STORAGE_KEY_USER);
        const storedToken = localStorage.getItem(STORAGE_KEY_TOKEN);
        return {
            user: storedUser ? JSON.parse(storedUser) : null as User | null,
            token: storedToken || '',
            isAuthenticated: !!storedToken,
            loading: false,
            error: null as string | null,
        }
    },

    actions: {
        async login(username: string, password: string): Promise<boolean> {
            this.loading = true;
            this.error = null;
            try {
                // Mock authentication
                if (username && password) {
                    const mockUser: User = {
                        id: '123',
                        username,
                        email: `${username}@example.com`,
                        role: 'inspector'
                    };
                    const mockToken = 'mock_jwt_token_' + Date.now();

                    this.user = mockUser;
                    this.token = mockToken;
                    this.isAuthenticated = true;
                    this.persist();
                    return true;
                }
                return false;
            } catch (err: any) {
                this.error = 'Login failed. Please check your credentials.';
                return false;
            } finally {
                this.loading = false;
            }
        },

        logout() {
            this.user = null;
            this.token = '';
            this.isAuthenticated = false;
            localStorage.removeItem(STORAGE_KEY_USER);
            localStorage.removeItem(STORAGE_KEY_TOKEN);
        },

        persist() {
            if (this.user) localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(this.user));
            if (this.token) localStorage.setItem(STORAGE_KEY_TOKEN, this.token);
        },

        setLoading(status: boolean) {
            this.loading = status;
        }
    }
})
