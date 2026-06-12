import { useNotify, useTranslate } from "ra-core";
import { useState } from "react";
import { Link } from "react-router";
import { Copy, ExternalLink } from "lucide-react";

import { useCatalogue } from "./ProductsPage";

interface MediaEntry {
  url: string;
  productId: string;
  productTitle: string;
  category?: string;
}

/**
 * Luxury DAM, v1: every published product photograph, drawn from the live
 * catalogue (products.images[]). Hover reveals the piece + quick actions.
 * Campaign/video assets join once they live behind a browser-reachable
 * source (storage listing or manifest) — Drive isn't one.
 */
export const MediaLibraryPage = () => {
  const translate = useTranslate();
  const notify = useNotify();
  const { data: products } = useCatalogue();
  const [category, setCategory] = useState<string | null>(null);

  if (!products) return null;

  const media: MediaEntry[] = products.flatMap((product) =>
    (product.images ?? []).map((url) => ({
      url,
      productId: product.id,
      productTitle: product.title,
      category: product.category,
    })),
  );

  const categories = Array.from(
    new Set(media.map((entry) => entry.category).filter(Boolean)),
  ).sort() as string[];

  const visible = category
    ? media.filter((entry) => entry.category === category)
    : media;

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    notify(translate("crm.media.copied", { _: "Image URL copied." }), {
      type: "info",
    });
  };

  return (
    <div className="flex flex-col gap-8 mt-6">
      <div>
        <p className="overline">
          {translate("crm.nav.studio", { _: "Studio" })}
        </p>
        <div className="flex items-baseline justify-between flex-wrap gap-2 mt-1">
          <h1 className="display text-[28px] leading-none">
            {translate("crm.nav.media")}
          </h1>
          <span className="text-xs text-muted-foreground tabular-nums">
            {translate("crm.media.count", { smart_count: visible.length })}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t pt-4">
        <button
          type="button"
          onClick={() => setCategory(null)}
          className={`overline px-1 py-1 transition-colors ${
            !category
              ? "text-foreground border-b border-foreground"
              : "hover:text-foreground"
          }`}
        >
          {translate("crm.products.all", { _: "All" })}
        </button>
        {categories.map((entry) => (
          <button
            key={entry}
            type="button"
            onClick={() => setCategory(category === entry ? null : entry)}
            className={`overline px-1 py-1 transition-colors ${
              category === entry
                ? "text-foreground border-b border-foreground"
                : "hover:text-foreground"
            }`}
          >
            {entry}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
        {visible.map((entry) => (
          <div
            key={entry.url}
            className="plate group relative aspect-square overflow-hidden"
          >
            <img
              src={entry.url}
              alt={entry.productTitle}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
              <Link
                to={`/products/${entry.productId}`}
                className="text-[11px] font-medium text-white truncate no-underline hover:underline"
              >
                {entry.productTitle}
              </Link>
              <div className="flex gap-1 pt-1">
                <button
                  type="button"
                  aria-label="Copy URL"
                  onClick={() => copyUrl(entry.url)}
                  className="flex size-6 items-center justify-center bg-white/15 text-white hover:bg-white/30"
                >
                  <Copy className="size-3" />
                </button>
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open"
                  className="flex size-6 items-center justify-center bg-white/15 text-white hover:bg-white/30"
                >
                  <ExternalLink className="size-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
