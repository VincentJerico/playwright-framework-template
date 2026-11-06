/**
 * The demo's user personas. SauceDemo prints these usernames on its login page; each one triggers a
 * different behavior. On your own app, replace them with your test accounts.
 */
export const USERS = {
  standard: 'standard_user',
  lockedOut: 'locked_out_user',
  problem: 'problem_user',
  performanceGlitch: 'performance_glitch_user',
  error: 'error_user',
  visual: 'visual_user',
} as const;

export type Persona = keyof typeof USERS;
