import sanitizeHtml from "sanitize-html";

// The admin form lets authors format news with HTML. Only these tags reach the page, so stored text cannot run scripts
const allowedHtml: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "strong", "b", "em", "i", "u", "s",
    "h2", "h3", "h4", "ul", "ol", "li", "blockquote", "code", "pre", "hr", "a",
  ],
  allowedAttributes: { a: ["href", "target", "rel"] },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: {
    // the article title is already the page's h1
    h1: "h2",
    a: sanitizeHtml.simpleTransform("a", { target: "_blank", rel: "noopener noreferrer" }),
  },
};

export function newsHtml(description: string) {
  return sanitizeHtml(description, allowedHtml);
}

// For news cards, search results and anything else that shows plain text
export function newsPlainText(description: string) {
  // a space after each block, or "</p><p>" would glue two sentences together
  const spaced = description.replace(/<\/(p|h[1-6]|li|div)>|<br\s*\/?>/gi, "$& ");
  return sanitizeHtml(spaced, { allowedTags: [], allowedAttributes: {} })
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}
