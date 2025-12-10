export const setAuthToken = (token: string) => {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem('auth_token', token);
    }
};

export const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return sessionStorage.getItem('auth_token');
    }
    return null;
};

export const clearAuthToken = () => {
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem('auth_token');
    }
};

export const isAuthenticated = (): boolean => {
    return getAuthToken() !== null;
};
