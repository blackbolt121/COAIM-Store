type SeoOptions = {
  title: string;
  description: string;
  canonicalPath?: string;
  image?: string;
  type?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
  jsonLdId?: string;
};

const siteUrl = import.meta.env.VITE_SITE_URL || 'https://siscadindustrial.cloud';

const ensureMeta = (selector: string, attrName: string, attrValue: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  return element;
};

const ensureLink = (rel: string) => {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  return element;
};

export function setSeo(options: SeoOptions) {
  if (typeof document === 'undefined') return;

  const title = options.title;
  const description = options.description;
  const canonical = options.canonicalPath ? new URL(options.canonicalPath, siteUrl).toString() : null;
  const image = options.image ? new URL(options.image, siteUrl).toString() : new URL('/siscadindustrial-recortado.svg', siteUrl).toString();
  const type = options.type || 'website';
  const robots = options.noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';

  document.title = title;

  ensureMeta('meta[name="description"]', 'name', 'description').content = description;
  ensureMeta('meta[name="robots"]', 'name', 'robots').content = robots;
  ensureMeta('meta[property="og:type"]', 'property', 'og:type').content = type;
  ensureMeta('meta[property="og:site_name"]', 'property', 'og:site_name').content = 'SISCAD Industrial';
  ensureMeta('meta[property="og:title"]', 'property', 'og:title').content = title;
  ensureMeta('meta[property="og:description"]', 'property', 'og:description').content = description;
  ensureMeta('meta[property="og:url"]', 'property', 'og:url').content = canonical || siteUrl;
  ensureMeta('meta[property="og:image"]', 'property', 'og:image').content = image;
  ensureMeta('meta[name="twitter:card"]', 'name', 'twitter:card').content = 'summary_large_image';
  ensureMeta('meta[name="twitter:title"]', 'name', 'twitter:title').content = title;
  ensureMeta('meta[name="twitter:description"]', 'name', 'twitter:description').content = description;
  ensureMeta('meta[name="twitter:image"]', 'name', 'twitter:image').content = image;

  if (canonical) {
    ensureLink('canonical').href = canonical;
  }

  if (options.jsonLdId) {
    const existingJsonLd = document.getElementById(options.jsonLdId);
    if (existingJsonLd) {
      existingJsonLd.remove();
    }
  }

  if (options.jsonLd) {

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    if (options.jsonLdId) script.id = options.jsonLdId;
    script.textContent = JSON.stringify(options.jsonLd);
    document.head.appendChild(script);
  }
}
