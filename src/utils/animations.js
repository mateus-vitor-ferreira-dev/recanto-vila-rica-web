import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FROM = { opacity: 0, y: 30 };
const TO = { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", clearProps: "all" };

export const FADE_UP = { opacity: 0, y: 30, duration: 0.7, ease: "power2.out" };

export function animateFadeInUp(targets, overrides = {}) {
    return gsap.fromTo(targets, FROM, { ...TO, ...overrides });
}

export function animateStagger(targets, overrides = {}) {
    return gsap.fromTo(targets, FROM, { ...TO, stagger: 0.1, ...overrides });
}
