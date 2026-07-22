import { useEffect } from "react";

/**
 * Lightweight per-page SEO: sets document title + meta description.
 * No extra dependency needed (react-helmet not required for this scale).
 */
export default function Seo({ title, description }) {
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", "description");
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", description);
    }
  }, [title, description]);

  return null;
}
