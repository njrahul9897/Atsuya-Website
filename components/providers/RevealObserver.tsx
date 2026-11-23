"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// One IntersectionObserver for every [data-reveal] element on the page. Server components only
// need the attribute (and an optional --reveal-delay) to take part in the entrance motion.
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-reveal", "in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    const scan = (root: ParentNode) => root.querySelectorAll('[data-reveal]:not([data-reveal="in"])').forEach((node) => observer.observe(node));
    scan(document);

    // Filters and tabs add nodes after load.
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches('[data-reveal]:not([data-reveal="in"])')) observer.observe(node);
          scan(node);
        });
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, [pathname]);

  return null;
}
