import * as Sentry from "@sentry/react";

const dsn = import.meta.env.VITE_SENTRY_DSN;
const env = import.meta.env.MODE;

export function initSentry() {
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: env,
    // Rastrear 10% das sessões em produção para performance
    tracesSampleRate: env === "production" ? 0.1 : 0,
    // Não capturar erros de rede esperados (4xx)
    beforeSend(event, hint) {
      const err = hint?.originalException;
      if (err?.response?.status && err.response.status < 500) return null;
      return event;
    },
  });
}

export function setUserContext(user) {
  if (!dsn) return;
  if (user) {
    Sentry.setUser({ id: user.id, email: user.email });
  } else {
    Sentry.setUser(null);
  }
}

export { Sentry };
