import { marked } from 'marked';
import hljs from 'highlight.js';
import DOMPurify from 'dompurify';

// Configure marked with highlight.js
marked.setOptions({
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
  gfm: true
});

/**
 * Renders markdown to sanitized HTML
 * @param {string} content - Raw markdown content
 * @returns {string} - Sanitized HTML
 */
export function renderMarkdown(content) {
  if (!content) return '';
  const rawHtml = marked.parse(content);
  return DOMPurify.sanitize(rawHtml);
}
