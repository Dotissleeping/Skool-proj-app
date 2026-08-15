// src/config/portals.js
//
// Fixed school portal configuration. These are NOT user-editable — the
// Portals screen only ever reads from this file. Replace the placeholder
// name/url/allowedDomains below once the real portal details are provided
// (Phase 8). Nothing else in the app needs to change when you do.

export const PORTALS = [
  {
    id: 'student-portal',
    name: 'Student Portal',
    url: 'https://ueplms.orangeapps.ph/', // TODO: replace with real URL
    allowedDomains: ['ueplms.orangeapps.ph'], // TODO: replace
  },
  {
    id: 'learning-portal',
    name: 'Learning Portal',
    url: 'https://uepcollege.acctech.ph/', // TODO: replace with real URL
    allowedDomains: ['uepcollege.acctech.ph'], // TODO: replace
  },
];

export function getPortalById(id) {
  return PORTALS.find((portal) => portal.id === id) || null;
}