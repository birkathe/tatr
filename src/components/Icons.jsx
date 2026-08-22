export function Icon({ name, size = 18 }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }
  const paths = {
    home: <><path d="M4 11.5 12 4l8 7.5" /><path d="M6.5 10.5V20h11V10.5" /></>,
    wallet: <><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M16 12h4" /></>,
    send: <><path d="M4 12h16" /><path d="M13 5l7 7-7 7" /></>,
    card: <><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18" /></>,
    vault: <><rect x="4" y="4" width="16" height="16" rx="2" /><circle cx="12" cy="12" r="3" /><path d="M12 9v-2" /></>,
    chart: <><path d="M4 19h16" /><path d="M7 16v-5" /><path d="M12 16V8" /><path d="M17 16v-8" /></>,
    file: <><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 19c0-3 2.5-5 6-5s6 2 6 5" /><circle cx="17" cy="9" r="2.2" /></>,
    inbox: <><path d="M4 7h16v12H4z" /><path d="M4 11h4l2 3h4l2-3h4" /></>,
    gear: <><circle cx="12" cy="12" r="3" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" /></>,
    search: <><circle cx="11" cy="11" r="6" /><path d="M20 20l-3.5-3.5" /></>,
    bell: <><path d="M6 16h12l-1-2V10a5 5 0 0 0-10 0v4z" /><path d="M10 16v1a2 2 0 0 0 4 0v-1" /></>,
    logout: <><path d="M10 7V5h9v14h-9v-2" /><path d="M4 12h11" /><path d="M12 8l4 4-4 4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    check: <><path d="M5 12.5 9.5 17 19 7.5" /></>,
    eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
    eyeOff: <><path d="M3 3l18 18" /><path d="M10.6 10.6A3 3 0 0 0 13.4 13.4" /><path d="M7 7.4C4.6 8.8 3 12 3 12s4 7 10 7c1.8 0 3.4-.5 4.8-1.3" /><path d="M14.1 6.3A10 10 0 0 1 21 12s-1 1.8-2.7 3.5" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" /></>,
    moon: <><path d="M17.5 15.5A7 7 0 1 1 10 5a6 6 0 0 0 7.5 10.5z" /></>,
  }
  return <svg {...p}>{paths[name]}</svg>
}
