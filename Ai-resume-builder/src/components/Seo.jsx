import { useEffect } from "react";
import {
  DEFAULT_KEYWORDS,
  SITE_CREATOR,
  SITE_NAME,
  absoluteUrl,
  getSiteOrigin,
} from "@/lib/seo";

const upsertMeta = (attr, key, content) => {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const upsertLink = (rel, href) => {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

const upsertJsonLd = (id, data) => {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
};

/**
 * Per-route SEO head tags (title, description, OG, Twitter, JSON-LD).
 */
const Seo = ({
  title,
  description,
  path = "/",
  noIndex = false,
  type = "website",
  jsonLd,
}) => {
  useEffect(() => {
    const fullTitle = title?.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    upsertMeta("name", "description", description);
    upsertMeta("name", "keywords", DEFAULT_KEYWORDS);
    upsertMeta("name", "author", SITE_CREATOR);
    upsertMeta(
      "name",
      "robots",
      noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large"
    );

    const url = absoluteUrl(path);
    const image = absoluteUrl("/og-image.png");
    const origin = getSiteOrigin();

    upsertLink("canonical", url);

    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", image);
    upsertMeta("property", "og:locale", "en_US");

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image);
    upsertMeta("name", "twitter:creator", SITE_CREATOR);

    if (jsonLd) {
      upsertJsonLd("seo-jsonld", jsonLd);
    } else if (origin && path === "/") {
      upsertJsonLd("seo-jsonld", {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            name: SITE_NAME,
            url: origin,
            description,
            creator: {
              "@type": "Person",
              name: SITE_CREATOR,
            },
          },
          {
            "@type": "SoftwareApplication",
            name: SITE_NAME,
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            author: {
              "@type": "Person",
              name: SITE_CREATOR,
            },
            description,
            url: origin,
            image,
          },
        ],
      });
    }
  }, [title, description, path, noIndex, type, jsonLd]);

  return null;
};

export default Seo;
