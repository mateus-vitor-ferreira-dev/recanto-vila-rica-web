import { vi } from "vitest";

export const GoogleOAuthProvider = ({ children }) => children;

export let lastLoginConfig = null;

export const useGoogleLogin = (config) => {
    lastLoginConfig = config;
    return vi.fn();
};
