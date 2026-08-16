// Google Ads conversion tracking. No-op unless the Ads ID + label envs are set,
// so the app works normally before the campaign is wired up.
//
// Set these in Vercel (and .env.local) when you have them from Google Ads:
//   NEXT_PUBLIC_GOOGLE_ADS_ID      e.g. AW-1234567890
//   NEXT_PUBLIC_GADS_EDIT_LABEL    label for the "edit completed" conversion
//   NEXT_PUBLIC_GADS_REGISTER_LABEL label for the "email registered" conversion

const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const LABELS = {
  edit: process.env.NEXT_PUBLIC_GADS_EDIT_LABEL,
  register: process.env.NEXT_PUBLIC_GADS_REGISTER_LABEL,
};

export const adsEnabled = Boolean(ADS_ID);

// Fire a Google Ads conversion. `kind` is "edit" (micro) or "register" (primary).
export function trackConversion(kind) {
  const label = LABELS[kind];
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  if (!ADS_ID || !label) return;
  window.gtag("event", "conversion", { send_to: `${ADS_ID}/${label}` });
}
