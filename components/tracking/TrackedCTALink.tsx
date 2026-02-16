"use client";

import { trackWhatsAppClick, trackPhoneCall } from "@/lib/tracking";

type TrackedCTALinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  trackingType: "whatsapp" | "phone";
};

/**
 * Drop-in replacement for <a> that fires GA4 + Google Ads conversion
 * tracking before the browser navigates.
 *
 * For target="_blank" links the page stays open, so a plain onClick is fine.
 * For tel: links the dialer opens in a new context, but the page stays.
 * We still use preventDefault + setTimeout as a safety net on mobile where
 * the browser may aggressively suspend the page.
 */
export default function TrackedCTALink({
  trackingType,
  onClick,
  children,
  href,
  target,
  ...props
}: TrackedCTALinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (trackingType === "whatsapp") {
      trackWhatsAppClick();
    } else {
      trackPhoneCall();
    }

    onClick?.(e);

    // Small delay to let the tracking beacon fire before navigation
    setTimeout(() => {
      if (target === "_blank") {
        window.open(href || "", "_blank", "noopener,noreferrer");
      } else {
        window.location.href = href || "";
      }
    }, 150);
  };

  return (
    <a href={href} target={target} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
