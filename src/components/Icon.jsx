const drawings = {
  shield: <><path d="M12 3 19 6v5c0 4.4-2.7 8-7 10-4.3-2-7-5.6-7-10V6l7-3Z" /><path d="m9 12 2 2 4-4" /></>,
  dashboard: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
  incidents: <><path d="M7 4h10l3 3v13H4V4h3Z" /><path d="M14 4v4h5M8 12h8M8 16h6" /></>,
  report: <><path d="M12 5v14M5 12h14" /><circle cx="12" cy="12" r="9" /></>,
  analytics: <><path d="M4 19V5M4 19h16" /><path d="m7 15 4-4 3 2 5-6" /></>,
  activity: <><path d="M3 12h4l2.2-6 4.1 12 2.2-6H21" /></>,
  users: <><circle cx="9" cy="8" r="3" /><path d="M3.5 20c.3-3.4 2.2-5.2 5.5-5.2s5.2 1.8 5.5 5.2M16 5.5a3 3 0 0 1 0 5.8M17 15c2.3.4 3.5 2 3.7 4.5" /></>,
  chevronRight: <path d="m9 5 7 7-7 7" />,
  chevronLeft: <path d="m15 5-7 7 7 7" />,
  stack: <><rect x="5" y="5" width="14" height="14" rx="2" /><path d="M8 9h8M8 12h8M8 15h5" /></>,
  alert: <><path d="M12 4 21 20H3L12 4Z" /><path d="M12 10v4M12 17h.01" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  check: <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></>,
};

function Icon({ name, size = 18, className = "" }) {
  return <svg className={`ui-icon ${className}`.trim()} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{drawings[name] || drawings.incidents}</svg>;
}

export default Icon;
