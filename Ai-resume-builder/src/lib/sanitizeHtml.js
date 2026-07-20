/**
 * Lightweight HTML sanitizer for resume rich text.
 * Keeps safe formatting tags and strips scripts/handlers.
 */

const ALLOWED_TAGS = new Set([
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'ul', 'ol', 'li', 'a', 'span', 'div',
]);

const ALLOWED_ATTR = new Set(['href', 'target', 'rel']);

export const sanitizeHtml = (dirty) => {
  if (!dirty) return '';
  if (typeof document === 'undefined') {
    return String(dirty).replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
  }

  const template = document.createElement('template');
  template.innerHTML = String(dirty);

  const walk = (node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType !== 1) return;

      const el = child;
      const tag = el.tagName.toLowerCase();

      if (!ALLOWED_TAGS.has(tag)) {
        const fragment = document.createDocumentFragment();
        while (el.firstChild) fragment.appendChild(el.firstChild);
        el.replaceWith(fragment);
        walk(node);
        return;
      }

      Array.from(el.attributes).forEach((attr) => {
        const name = attr.name.toLowerCase();
        if (name.startsWith('on') || !ALLOWED_ATTR.has(name)) {
          el.removeAttribute(attr.name);
        }
        if (name === 'href' && /^\s*javascript:/i.test(attr.value)) {
          el.removeAttribute('href');
        }
      });

      if (tag === 'a') {
        el.setAttribute('rel', 'noopener noreferrer');
        el.setAttribute('target', '_blank');
      }

      walk(el);
    });
  };

  walk(template.content);
  return template.innerHTML;
};

export default sanitizeHtml;
