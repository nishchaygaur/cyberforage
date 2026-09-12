import React from "react";
import {
  Linkedin,
  Instagram,
  Youtube,
  Github,
  Mail,
  Phone,
  Globe,
  Link as LinkIcon,
  MessageCircle,
} from "lucide-react";

export interface SocialIconProps {
  platform?: string;
  icon?: string | null;
  className?: string;
  size?: number;
}

/**
 * Clean SVG vectors for platforms not directly provided in Lucide
 * sized precisely to match Lucide's 24x24 canvas and stroke weight.
 */
export const XIcon: React.FC<{ className?: string; size?: number }> = ({
  className = "w-4 h-4",
  size,
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    width={size}
    height={size}
    className={className}
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const WhatsAppIcon: React.FC<{ className?: string; size?: number }> = ({
  className = "w-4 h-4",
  size,
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    aria-hidden="true"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    <path d="M9.5 9.5c.3-.5.7-.5 1 0 .2.3.6 1.3.7 1.5.1.2 0 .4-.1.6l-.4.5c-.1.1-.2.3 0 .5.3.5.9 1.4 1.8 1.9.3.2.5.1.7 0l.6-.7c.2-.2.4-.2.6-.1.3.1 1.4.7 1.6.8.2.1.2.3.2.5 0 .8-.5 1.5-1.2 1.5-.6 0-2.3-.2-4-1.9-1.8-1.7-2-3.4-2-4 0-.7.7-1.2 1.5-1.2.2 0 .4 0 .5.1z" />
  </svg>
);

export const TelegramIcon: React.FC<{ className?: string; size?: number }> = ({
  className = "w-4 h-4",
  size,
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    className={className}
    aria-hidden="true"
  >
    <path d="M21.5 2.5 2 10.5l6.5 2.5 2.5 7.5 4-4.5 5 3.5 1.5-17z" />
    <path d="m8.5 13 9-7" />
  </svg>
);

/**
 * Universal Social Icon resolver supporting all specified platforms and icon identifiers
 */
export const SocialIcon: React.FC<SocialIconProps> = ({
  platform = "",
  icon = "",
  className = "w-4 h-4",
  size,
}) => {
  const key = (icon || platform || "").toLowerCase().trim();

  switch (key) {
    case "linkedin":
      return <Linkedin className={className} size={size} />;
    case "instagram":
      return <Instagram className={className} size={size} />;
    case "whatsapp":
      return <WhatsAppIcon className={className} size={size} />;
    case "github":
      return <Github className={className} size={size} />;
    case "x":
    case "twitter":
    case "x/twitter":
      return <XIcon className={className} size={size} />;
    case "youtube":
      return <Youtube className={className} size={size} />;
    case "telegram":
      return <TelegramIcon className={className} size={size} />;
    case "email":
    case "mail":
      return <Mail className={className} size={size} />;
    case "phone":
    case "tel":
      return <Phone className={className} size={size} />;
    case "website":
    case "globe":
      return <Globe className={className} size={size} />;
    case "custom":
    case "link":
      return <LinkIcon className={className} size={size} />;
    default:
      return <Globe className={className} size={size} />;
  }
};

export interface PlatformPreset {
  key: string;
  label: string;
  icon: string;
  urlPlaceholder: string;
  urlPrefixHint: string;
  description: string;
}

export const PLATFORM_PRESETS: PlatformPreset[] = [
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: "linkedin",
    urlPlaceholder: "https://linkedin.com/in/username",
    urlPrefixHint: "https://linkedin.com/in/...",
    description: "Professional profile or company page",
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: "instagram",
    urlPlaceholder: "https://instagram.com/username",
    urlPrefixHint: "https://instagram.com/...",
    description: "Instagram visual feed",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    icon: "whatsapp",
    urlPlaceholder: "https://wa.me/1234567890",
    urlPrefixHint: "https://wa.me/<country-code><number>",
    description: "Direct WhatsApp chat link",
  },
  {
    key: "github",
    label: "GitHub",
    icon: "github",
    urlPlaceholder: "https://github.com/username",
    urlPrefixHint: "https://github.com/...",
    description: "Repositories and open-source contributions",
  },
  {
    key: "x",
    label: "X / Twitter",
    icon: "x",
    urlPlaceholder: "https://x.com/username",
    urlPrefixHint: "https://x.com/...",
    description: "Microblogging and public advisories",
  },
  {
    key: "youtube",
    label: "YouTube",
    icon: "youtube",
    urlPlaceholder: "https://youtube.com/@channel",
    urlPrefixHint: "https://youtube.com/@...",
    description: "Video demos, labs, and talks",
  },
  {
    key: "telegram",
    label: "Telegram",
    icon: "telegram",
    urlPlaceholder: "https://t.me/username",
    urlPrefixHint: "https://t.me/...",
    description: "Telegram channel or direct contact",
  },
  {
    key: "email",
    label: "Email",
    icon: "email",
    urlPlaceholder: "mailto:contact@cyberforage.space",
    urlPrefixHint: "mailto:user@domain.com or user@domain.com",
    description: "Inbound encrypted or standard email",
  },
  {
    key: "phone",
    label: "Phone",
    icon: "phone",
    urlPlaceholder: "tel:+1234567890",
    urlPrefixHint: "tel:+<number> or +<number>",
    description: "Telephone coordinate",
  },
  {
    key: "website",
    label: "Website",
    icon: "website",
    urlPlaceholder: "https://example.com",
    urlPrefixHint: "https://...",
    description: "External portal or reference site",
  },
  {
    key: "custom",
    label: "Custom",
    icon: "custom",
    urlPlaceholder: "https://...",
    urlPrefixHint: "Any valid URL",
    description: "Custom link or resource",
  },
];

export function getPlatformDefaults(platform: string): PlatformPreset {
  const normalized = (platform || "").toLowerCase().trim();
  const matched = PLATFORM_PRESETS.find(
    (p) => p.key === normalized || p.key === "x" && (normalized === "twitter" || normalized === "x/twitter")
  );
  return (
    matched || {
      key: normalized || "custom",
      label: platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : "Custom Link",
      icon: "custom",
      urlPlaceholder: "https://...",
      urlPrefixHint: "https://...",
      description: "Custom platform link",
    }
  );
}

/**
 * Validates URLs and handles platform-specific constraints:
 * - WhatsApp: must be valid wa.me or api.whatsapp.com URL, or formatted phone digits.
 * - Email: must be mailto: or valid email format.
 * - Phone: must be tel: or digits with standard telephony punctuation (+, -, (, )).
 * - Socials: must be a well-formed http(s) URL with an actual target path (not bare domain).
 */
export function validatePlatformUrl(
  platform: string,
  url: string
): { valid: boolean; formattedUrl: string; error?: string } {
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
    // If the admin typed raw digits or a phone number for WhatsApp
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

  // Standard web platforms: LinkedIn, GitHub, X, Instagram, YouTube, Telegram, Website, Custom
  let formatted = trimmed;
  if (!/^https?:\/\//i.test(formatted)) {
    formatted = `https://${formatted}`;
  }

  try {
    const parsed = new URL(formatted);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { valid: false, formattedUrl: formatted, error: "Only http and https protocols are permitted." };
    }

    // Specific check for social accounts: reject bare domain placeholders with no profile path
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
