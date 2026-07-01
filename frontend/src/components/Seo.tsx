import { useEffect } from "react";

type JsonLd = Record<string, unknown>;

export interface SeoProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  jsonLd?: JsonLd;
}

const DEFAULT_IMAGE = "/images/partnerships.jpeg";

const getSiteUrl = () => {
  if (import.meta.env.VITE_SITE_URL) {
    return import.meta.env.VITE_SITE_URL as string;
  }

  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }

  return "https://tedxguc-hub.vercel.app";
};

const setMeta = (selector: string, attribute: "name" | "property", value: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    const [, key] = selector.match(/\[(?:name|property)="([^"]+)"\]/) || [];
    if (key) {
      element.setAttribute(attribute, key);
    }
    document.head.appendChild(element);
  }

  element.setAttribute("content", value);
};

const setLink = (rel: string, href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
};

const setScript = (id: string, jsonLd?: JsonLd) => {
  const existing = document.head.querySelector<HTMLScriptElement>(`script#${id}`);

  if (!jsonLd) {
    existing?.remove();
    return;
  }

  const script = existing ?? document.createElement("script");
  script.id = id;
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(jsonLd);

  if (!existing) {
    document.head.appendChild(script);
  }
};

const Seo = ({ title, description, path = "/", image = DEFAULT_IMAGE, jsonLd }: SeoProps) => {
  useEffect(() => {
    const siteUrl = getSiteUrl();
    const canonical = new URL(path, siteUrl).toString();
    const previewImage = image.startsWith("http") ? image : new URL(image, siteUrl).toString();

    document.title = `${title} | TEDxGUC`;
    setMeta('meta[name="description"]', "name", description);
    setMeta('meta[property="og:title"]', "property", title);
    setMeta('meta[property="og:description"]', "property", description);
    setMeta('meta[property="og:type"]', "property", "website");
    setMeta('meta[property="og:url"]', "property", canonical);
    setMeta('meta[property="og:image"]', "property", previewImage);
    setMeta('meta[property="og:image:width"]', "property", "1200");
    setMeta('meta[property="og:image:height"]', "property", "630");
    setMeta('meta[property="og:locale"]', "property", "en_US");
    setMeta('meta[name="twitter:card"]', "name", "summary_large_image");
    setMeta('meta[name="twitter:image"]', "name", previewImage);
    setLink("canonical", canonical);
    setScript("structured-data", jsonLd);
  }, [description, image, jsonLd, path, title]);

  return null;
};

export default Seo;