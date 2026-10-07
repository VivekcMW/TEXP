import type { Metadata } from "next";
import { siteConfig } from "@site-config";

export const absoluteUrl = (path: string) => `${siteConfig.domain}${path.startsWith("/") ? path : `/${path}`}`;

export function buildMetadata(args: { title: string; description: string; path: string; type?: "website" | "article" }): Metadata {
  if (args.title.length > 60) throw new Error(`title must be 60 characters or fewer: "${args.title}"`);
  if (args.description.length > 155) throw new Error(`description must be 155 characters or fewer for ${args.path}`);
  return {
    title: args.title,
    description: args.description,
    alternates: { canonical: args.path },
    openGraph: { url: absoluteUrl(args.path), title: args.title, description: args.description, type: args.type ?? "website", siteName: siteConfig.name },
    twitter: { card: "summary_large_image", title: args.title, description: args.description },
  };
}

const ctx = "https://schema.org";

export const organizationJsonLd = () => ({
  "@context": ctx, "@type": "Organization", "@id": `${siteConfig.domain}/#org`,
  name: siteConfig.name, legalName: siteConfig.legalName, url: siteConfig.domain,
  description: siteConfig.positioning, sameAs: [siteConfig.social.linkedin], email: siteConfig.contactEmail,
  founder: siteConfig.founders.map((f) => ({ "@type": "Person", name: f.name, jobTitle: f.role })),
});

export const webSiteJsonLd = () => ({ "@context": ctx, "@type": "WebSite", url: siteConfig.domain, name: siteConfig.name, publisher: { "@id": `${siteConfig.domain}/#org` } });

export const serviceJsonLd = (s: { slug: string; title: string; summary: string }) => ({
  "@context": ctx, "@type": "Service", name: s.title, description: s.summary, serviceType: s.title,
  url: absoluteUrl(`/services/${s.slug}`), provider: { "@type": "Organization", "@id": `${siteConfig.domain}/#org`, name: siteConfig.name },
  areaServed: siteConfig.markets,
});

export const articleJsonLd = (a: { title: string; description: string; path: string; publishedAt: string; updatedAt: string; authorName: string }) => ({
  "@context": ctx, "@type": "Article", headline: a.title, description: a.description, url: absoluteUrl(a.path),
  datePublished: a.publishedAt, dateModified: a.updatedAt,
  author: { "@type": "Person", name: a.authorName }, publisher: { "@id": `${siteConfig.domain}/#org` },
  mainEntityOfPage: absoluteUrl(a.path),
});

export const faqJsonLd = (faq: Array<{ q: string; a: string }>) => ({
  "@context": ctx, "@type": "FAQPage",
  mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});

export const personJsonLd = (f: { name: string; role: string; bio: string; linkedin: string }) => ({
  "@context": ctx, "@type": "Person", name: f.name, jobTitle: f.role, description: f.bio, sameAs: [f.linkedin],
  worksFor: { "@id": `${siteConfig.domain}/#org` },
});

export const breadcrumbJsonLd = (items: Array<{ name: string; path: string }>) => ({
  "@context": ctx, "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
});
