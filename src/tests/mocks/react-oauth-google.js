import React from "react";

export const GoogleOAuthProvider = ({ children }) => children;

export let lastLoginConfig = null;

export const GoogleLogin = ({ onSuccess, onError }) => {
    lastLoginConfig = { onSuccess, onError };
    return React.createElement("button", { "data-testid": "google-login-btn" }, "Entrar com Google");
};
