// scripts/test-cms-logic.mjs
// Verification suite for CMS URL validation, platform defaults, and fallback logic

import assert from "assert";

// Inline replication of the validation logic from components/ui/SocialIcon.tsx
// to test across all required scenarios:
function validatePlatformUrl(platform, url) {
  if (!url || typeof url !== "string") {
    return { valid: false, formattedUrl: "", error: "URL cannot be empty." };
  }

  const trimmed = url.trim();
  const plat = (platform || "").toLowerCase();

  // Email platform validation
  if (plat === "email") {
    if (trimmed.startsWith("mailto:")) {
      const emailPart = trimmed.replace("mailto:", "").trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailPart)) {
        return { valid: false, formattedUrl: trimmed, error: "Please enter a valid email address." };
      }
      return { valid: true, formattedUrl: trimmed };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return { valid: false, formattedUrl: trimmed, error: "Please enter a valid email address." };
    }
    return { valid: true, formattedUrl: `mailto:${trimmed}` };
  }

  // Phone platform validation
  if (plat === "phone") {
    if (trimmed.startsWith("tel:")) {
      const phoneDigits = trimmed.replace("tel:", "").replace(/[\s\-\(\)\.]/g, "");
      if (phoneDigits.length < 5) {
        return { valid: false, formattedUrl: trimmed, error: "Please enter a valid phone number." };
      }
      return { valid: true, formattedUrl: trimmed };
    }
    const phoneRegex = /^\+?[0-9\s\-\(\)\.]{5,}$/;
    if (!phoneRegex.test(trimmed)) {
      return { valid: false, formattedUrl: trimmed, error: "Please enter a valid telephone number." };
    }
    const cleanNumber = trimmed.replace(/\s+/g, "");
    return { valid: true, formattedUrl: `tel:${cleanNumber}` };
  }

  // WhatsApp platform validation
  if (plat === "whatsapp") {
    if (trimmed.startsWith("https://wa.me/") || trimmed.startsWith("http://wa.me/")) {
      const digits = trimmed.replace(/^https?:\/\/wa\.me\//, "").split("?")[0].replace(/\D/g, "");
      if (digits.length < 6) {
        return { valid: false, formattedUrl: trimmed, error: "WhatsApp URL must contain a valid country code and phone number." };
      }
      return { valid: true, formattedUrl: trimmed };
    }
    if (trimmed.startsWith("https://api.whatsapp.com/send") || trimmed.startsWith("http://api.whatsapp.com/send")) {
      return { valid: true, formattedUrl: trimmed };
    }
    const rawDigits = trimmed.replace(/\D/g, "");
    if (rawDigits.length >= 7) {
      return { valid: true, formattedUrl: `https://wa.me/${rawDigits}` };
    }
    return {
      valid: false,
      formattedUrl: trimmed,
      error: "Enter a valid WhatsApp link (e.g. https://wa.me/1234567890) or international phone number with country code.",
    };
  }

  // Standard web platforms
  let formatted = trimmed;
  if (!/^https?:\/\//i.test(formatted)) {
    formatted = `https://${formatted}`;
  }

  try {
    const parsed = new URL(formatted);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { valid: false, formattedUrl: formatted, error: "Only http and https protocols are permitted." };
    }

    if (["linkedin", "github", "instagram", "x", "twitter", "youtube", "telegram"].includes(plat)) {
      const path = parsed.pathname.replace(/\/$/, "");
      if (!path || path === "") {
        return {
          valid: false,
          formattedUrl: formatted,
          error: `Please enter the specific profile URL for ${platform}, not just the domain.`,
        };
      }
    }

    return { valid: true, formattedUrl: formatted };
  } catch {
    return { valid: false, formattedUrl: formatted, error: "Please enter a valid URL." };
  }
}

console.log("Running CMS platform validation tests...\n");

// 1. WhatsApp Tests
console.log("1. WhatsApp Tests:");
const wa1 = validatePlatformUrl("whatsapp", "https://wa.me/15551234567");
assert.strictEqual(wa1.valid, true, "wa.me URL should be valid");
assert.strictEqual(wa1.formattedUrl, "https://wa.me/15551234567");

const wa2 = validatePlatformUrl("whatsapp", "+1 (555) 123-4567");
assert.strictEqual(wa2.valid, true, "Raw phone number for WhatsApp should format to wa.me");
assert.strictEqual(wa2.formattedUrl, "https://wa.me/15551234567");

const wa3 = validatePlatformUrl("whatsapp", "https://wa.me/");
assert.strictEqual(wa3.valid, false, "Empty wa.me should be rejected");

const wa4 = validatePlatformUrl("whatsapp", "not-a-number");
assert.strictEqual(wa4.valid, false, "Invalid string should be rejected");
console.log("   ✔ WhatsApp validation passed all tests");

// 2. Email Tests
console.log("2. Email Tests:");
const em1 = validatePlatformUrl("email", "analyst@cyberforage.space");
assert.strictEqual(em1.valid, true);
assert.strictEqual(em1.formattedUrl, "mailto:analyst@cyberforage.space");

const em2 = validatePlatformUrl("email", "mailto:analyst@cyberforage.space");
assert.strictEqual(em2.valid, true);
assert.strictEqual(em2.formattedUrl, "mailto:analyst@cyberforage.space");

const em3 = validatePlatformUrl("email", "invalid-email");
assert.strictEqual(em3.valid, false);
console.log("   ✔ Email validation passed all tests");

// 3. Phone Tests
console.log("3. Phone Tests:");
const ph1 = validatePlatformUrl("phone", "+1 (555) 019-2834");
assert.strictEqual(ph1.valid, true);
assert.strictEqual(ph1.formattedUrl, "tel:+1(555)019-2834");

const ph2 = validatePlatformUrl("phone", "tel:+15550192834");
assert.strictEqual(ph2.valid, true);
assert.strictEqual(ph2.formattedUrl, "tel:+15550192834");

const ph3 = validatePlatformUrl("phone", "abc");
assert.strictEqual(ph3.valid, false);
console.log("   ✔ Phone validation passed all tests");

// 4. Social Platform Profile Tests
console.log("4. Social Platforms & Bare Domain Rejection:");
const gh1 = validatePlatformUrl("github", "https://github.com/nishchaygaur");
assert.strictEqual(gh1.valid, true);

const ghBare = validatePlatformUrl("github", "https://github.com");
assert.strictEqual(ghBare.valid, false, "Bare github.com domain should be rejected");

const li1 = validatePlatformUrl("linkedin", "https://linkedin.com/in/cyberforage");
assert.strictEqual(li1.valid, true);

const liBare = validatePlatformUrl("linkedin", "https://linkedin.com");
assert.strictEqual(liBare.valid, false, "Bare linkedin.com domain should be rejected");

const x1 = validatePlatformUrl("x", "https://x.com/cyberforage");
assert.strictEqual(x1.valid, true);

const tg1 = validatePlatformUrl("telegram", "https://t.me/cyberforage");
assert.strictEqual(tg1.valid, true);

const yt1 = validatePlatformUrl("youtube", "https://youtube.com/@cyberforage");
assert.strictEqual(yt1.valid, true);

const ig1 = validatePlatformUrl("instagram", "https://instagram.com/cyberforage");
assert.strictEqual(ig1.valid, true);
console.log("   ✔ Social profile validation passed all tests");

console.log("\nALL CMS LOGIC TESTS PASSED SUCCESSFULLY! ✔");
