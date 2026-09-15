// scripts/test-doc-urls.mjs
// Verification suite for Documentation URL sanitization, validation, and rendering logic

import assert from "assert";

// Replicated sanitization logic matching lib/utils/url.ts
function sanitizeWebUrl(url) {
  if (!url || typeof url !== "string") {
    return null;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("file:") ||
    lower.startsWith("#") ||
    lower === "javascript:void(0)"
  ) {
    return null;
  }

  if (!/^https?:\/\//i.test(trimmed)) {
    return null;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    if (!parsed.hostname || parsed.hostname.trim().length === 0) {
      return null;
    }
    return trimmed;
  } catch {
    return null;
  }
}

console.log("==================================================");
console.log("CYBERFORAGE DOCUMENTATION URL TEST SUITE");
console.log("==================================================\n");

// 1. Valid Documentation URLs
console.log("1. Valid Documentation URLs:");
const doc1 = sanitizeWebUrl("https://cyberforage.space/docs");
assert.strictEqual(doc1, "https://cyberforage.space/docs");
console.log("   ✔ Standard https URL accepted");

const doc2 = sanitizeWebUrl("https://github.com/nishchaygaur/cyberforage/wiki");
assert.strictEqual(doc2, "https://github.com/nishchaygaur/cyberforage/wiki");
console.log("   ✔ External docs/wiki URL accepted");

const doc3 = sanitizeWebUrl("  https://audit.cyberforage.space/api-docs   ");
assert.strictEqual(doc3, "https://audit.cyberforage.space/api-docs");
console.log("   ✔ Trimmed whitespace URL accepted");

const doc4 = sanitizeWebUrl("http://internal-docs.cyberforage.space:8080/guide");
assert.strictEqual(doc4, "http://internal-docs.cyberforage.space:8080/guide");
console.log("   ✔ Valid http with port accepted");

// 2. Unsafe & Malicious Schemes (Must be rejected / return null)
console.log("\n2. Malicious Schemes & XSS Vectors (Must return null):");
const bad1 = sanitizeWebUrl("javascript:alert(document.domain)");
assert.strictEqual(bad1, null, "javascript: must be blocked");
console.log("   ✔ javascript: scheme blocked");

const bad2 = sanitizeWebUrl("JAVASCRIPT:alert(1)");
assert.strictEqual(bad2, null, "Uppercase JAVASCRIPT: must be blocked");
console.log("   ✔ Case-insensitive javascript: blocked");

const bad3 = sanitizeWebUrl("data:text/html,<script>alert(1)</script>");
assert.strictEqual(bad3, null, "data: must be blocked");
console.log("   ✔ data: URI blocked");

const bad4 = sanitizeWebUrl("vbscript:msgbox(1)");
assert.strictEqual(bad4, null, "vbscript: must be blocked");
console.log("   ✔ vbscript: blocked");

const bad5 = sanitizeWebUrl("file:///etc/passwd");
assert.strictEqual(bad5, null, "file: scheme must be blocked");
console.log("   ✔ file: scheme blocked");

// 3. Placeholders & Dead Links (Must return null)
console.log("\n3. Placeholders & Empty Values (Must return null):");
const ph1 = sanitizeWebUrl("#");
assert.strictEqual(ph1, null, "# must be blocked");
console.log("   ✔ '#' placeholder blocked");

const ph2 = sanitizeWebUrl("#documentation");
assert.strictEqual(ph2, null, "#documentation must be blocked");
console.log("   ✔ '#documentation' anchor blocked");

const ph3 = sanitizeWebUrl("javascript:void(0)");
assert.strictEqual(ph3, null, "javascript:void(0) must be blocked");
console.log("   ✔ 'javascript:void(0)' blocked");

const ph4 = sanitizeWebUrl("");
assert.strictEqual(ph4, null, "Empty string must return null");
console.log("   ✔ Empty string returns null");

const ph5 = sanitizeWebUrl("    ");
assert.strictEqual(ph5, null, "Whitespace-only string must return null");
console.log("   ✔ Whitespace returns null");

const ph6 = sanitizeWebUrl(null);
assert.strictEqual(ph6, null, "null must return null");
console.log("   ✔ null returns null");

const ph7 = sanitizeWebUrl(undefined);
assert.strictEqual(ph7, null, "undefined must return null");
console.log("   ✔ undefined returns null");

// 4. Component Rendering State Simulation
console.log("\n4. Component Rendering State Simulation:");
function renderProjectCardActions(project) {
  const targetUrl = sanitizeWebUrl(project.project_url || project.demo_url);
  const docUrl = sanitizeWebUrl(project.documentation_url);
  const githubUrl = sanitizeWebUrl(project.github_url);

  const actions = [];
  if (targetUrl) actions.push({ type: "VIEW_PROJECT", href: targetUrl });
  if (docUrl) actions.push({ type: "DOCUMENTATION", href: docUrl });
  if (githubUrl) actions.push({ type: "SOURCE", href: githubUrl });

  if (actions.length === 0) {
    actions.push({ type: "DETAILS", href: "/projects" });
  }

  return actions;
}

// Case A: Full project with all 3 links
const pAll = renderProjectCardActions({
  project_url: "https://cyberforage.space",
  documentation_url: "https://docs.cyberforage.space",
  github_url: "https://github.com/nishchaygaur/cyberforage",
});
assert.strictEqual(pAll.length, 3);
assert.strictEqual(pAll.find((a) => a.type === "DOCUMENTATION")?.href, "https://docs.cyberforage.space");
console.log("   ✔ Project with all actions renders View Project, Documentation, and Source");

// Case B: Project with NO documentation URL (null / empty)
const pNoDoc = renderProjectCardActions({
  project_url: "https://audit.cyberforage.space",
  documentation_url: null,
  github_url: "https://github.com/nishchaygaur/pdf-malware-analyzer",
});
assert.strictEqual(pNoDoc.length, 2);
assert.strictEqual(pNoDoc.find((a) => a.type === "DOCUMENTATION"), undefined);
console.log("   ✔ Project without documentation URL cleanly hides Documentation button");

// Case C: Project with invalid/unsafe documentation URL
const pBadDoc = renderProjectCardActions({
  project_url: "https://cyberforage.space",
  documentation_url: "javascript:alert(1)",
  github_url: "https://github.com/nishchaygaur/cyberforage",
});
assert.strictEqual(pBadDoc.length, 2);
assert.strictEqual(pBadDoc.find((a) => a.type === "DOCUMENTATION"), undefined);
console.log("   ✔ Project with malicious documentation URL safely drops button without rendering href");

// Case D: Project with no URLs at all
const pEmpty = renderProjectCardActions({
  project_url: null,
  documentation_url: "",
  github_url: undefined,
});
assert.strictEqual(pEmpty.length, 1);
assert.strictEqual(pEmpty[0].type, "DETAILS");
assert.strictEqual(pEmpty[0].href, "/projects");
console.log("   ✔ Project with no URLs falls back to internal /projects route without # placeholder");

console.log("\n==================================================");
console.log("ALL DOCUMENTATION URL TESTS PASSED (100% SUCCESS)");
console.log("==================================================");
