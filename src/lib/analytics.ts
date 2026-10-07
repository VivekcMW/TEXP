import { siteConfig } from "@site-config";
export type AnalyticsEvent = "page_view" | "cta_click" | "booking_opened" | "tool_used" | "lead_captured";
type Props = Record<string, string | number>;
interface Provider { send(event: AnalyticsEvent, props?: Props): void }
const noop: Provider = { send() {} };
const plausible: Provider = { send(e, p) { (globalThis as { plausible?: (e: string, o?: { props?: Props }) => void }).plausible?.(e, { props: p }); } };
const ga4: Provider = { send(e, p) { (globalThis as { gtag?: (...a: unknown[]) => void }).gtag?.("event", e, p); } };
let provider: Provider = siteConfig.analytics.provider === "plausible" ? plausible : siteConfig.analytics.provider === "ga4" ? ga4 : noop;
export function track(event: AnalyticsEvent, props?: Props) { try { provider.send(event, props); } catch { /* never break the page */ } }
export function _setProviderForTests(p: Provider) { provider = p; }
