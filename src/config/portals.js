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
    url: 'https://example-student-portal.edu.ph/', // TODO: replace with real URL
    allowedDomains: ['example-student-portal.edu.ph'], // TODO: replace
  },
  {
    id: 'learning-portal',
    name: 'Learning Portal',
    url: 'https://example-learning-portal.edu.ph/', // TODO: replace with real URL
    allowedDomains: ['example-learning-portal.edu.ph'], // TODO: replace
  },
];

export function getPortalById(id) {
  return PORTALS.find((portal) => portal.id === id) || null;
}