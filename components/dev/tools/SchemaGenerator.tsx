"use client";

import { useMemo, useState } from "react";
import { fieldClass, inputClass, CopyButton, Panel, Labeled } from "@/components/dev/ui";

const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);
const has = (v?: string) => Boolean(v && v.trim());

type FieldDef = { key: string; label: string; placeholder?: string; area?: boolean };

type SchemaType = {
  id: string;
  label: string;
  fields: FieldDef[];
  build: (v: Record<string, string>) => Record<string, unknown>;
};

const TYPES: SchemaType[] = [
  {
    id: "Organization",
    label: "Organization",
    fields: [
      { key: "name", label: "Name", placeholder: "Acme Inc." },
      { key: "url", label: "URL", placeholder: "https://acme.com" },
      { key: "logo", label: "Logo URL", placeholder: "https://acme.com/logo.png" },
      { key: "sameAs", label: "Social profile URLs (one per line)", area: true, placeholder: "https://x.com/acme" },
    ],
    build: (v) => ({
      "@context": "https://schema.org",
      "@type": "Organization",
      ...(has(v.name) && { name: v.name }),
      ...(has(v.url) && { url: v.url }),
      ...(has(v.logo) && { logo: v.logo }),
      ...(has(v.sameAs) && { sameAs: lines(v.sameAs) }),
    }),
  },
  {
    id: "Article",
    label: "Article",
    fields: [
      { key: "headline", label: "Headline" },
      { key: "author", label: "Author name" },
      { key: "datePublished", label: "Date published", placeholder: "2026-06-01" },
      { key: "image", label: "Image URL" },
      { key: "url", label: "Article URL" },
    ],
    build: (v) => ({
      "@context": "https://schema.org",
      "@type": "Article",
      ...(has(v.headline) && { headline: v.headline }),
      ...(has(v.author) && { author: { "@type": "Person", name: v.author } }),
      ...(has(v.datePublished) && { datePublished: v.datePublished }),
      ...(has(v.image) && { image: v.image }),
      ...(has(v.url) && { mainEntityOfPage: v.url }),
    }),
  },
  {
    id: "Product",
    label: "Product",
    fields: [
      { key: "name", label: "Name" },
      { key: "image", label: "Image URL" },
      { key: "description", label: "Description", area: true },
      { key: "brand", label: "Brand" },
      { key: "price", label: "Price", placeholder: "29.00" },
      { key: "priceCurrency", label: "Currency", placeholder: "USD" },
    ],
    build: (v) => ({
      "@context": "https://schema.org",
      "@type": "Product",
      ...(has(v.name) && { name: v.name }),
      ...(has(v.image) && { image: v.image }),
      ...(has(v.description) && { description: v.description }),
      ...(has(v.brand) && { brand: { "@type": "Brand", name: v.brand } }),
      ...((has(v.price) || has(v.priceCurrency)) && {
        offers: {
          "@type": "Offer",
          ...(has(v.price) && { price: v.price }),
          ...(has(v.priceCurrency) && { priceCurrency: v.priceCurrency }),
          availability: "https://schema.org/InStock",
        },
      }),
    }),
  },
  {
    id: "FAQPage",
    label: "FAQ Page",
    fields: [
      { key: "faqs", label: "FAQs — one per line as “Question :: Answer”", area: true, placeholder: "Is it free? :: Yes, completely." },
    ],
    build: (v) => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: lines(v.faqs)
        .map((l) => l.split("::"))
        .filter((p) => p.length >= 2)
        .map((p) => ({
          "@type": "Question",
          name: p[0].trim(),
          acceptedAnswer: { "@type": "Answer", text: p.slice(1).join("::").trim() },
        })),
    }),
  },
  {
    id: "LocalBusiness",
    label: "Local Business",
    fields: [
      { key: "name", label: "Name" },
      { key: "url", label: "URL" },
      { key: "telephone", label: "Telephone" },
      { key: "street", label: "Street address" },
      { key: "city", label: "City" },
    ],
    build: (v) => ({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      ...(has(v.name) && { name: v.name }),
      ...(has(v.url) && { url: v.url }),
      ...(has(v.telephone) && { telephone: v.telephone }),
      ...((has(v.street) || has(v.city)) && {
        address: {
          "@type": "PostalAddress",
          ...(has(v.street) && { streetAddress: v.street }),
          ...(has(v.city) && { addressLocality: v.city }),
        },
      }),
    }),
  },
];

export default function SchemaGenerator() {
  const [typeId, setTypeId] = useState(TYPES[0].id);
  const [values, setValues] = useState<Record<string, string>>({});
  const type = TYPES.find((t) => t.id === typeId)!;

  const output = useMemo(() => {
    const obj = type.build(values);
    return `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n</` + `script>`;
  }, [type, values]);

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="space-y-4">
        <Labeled label="Schema type">
          <select
            value={typeId}
            onChange={(e) => { setTypeId(e.target.value); setValues({}); }}
            className={inputClass}
          >
            {TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </Labeled>
        {type.fields.map((f) => (
          <Labeled key={f.key} label={f.label}>
            {f.area ? (
              <textarea
                value={values[f.key] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                spellCheck={false}
                placeholder={f.placeholder}
                className={`${fieldClass} min-h-[5rem]`}
              />
            ) : (
              <input
                value={values[f.key] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className={inputClass}
              />
            )}
          </Labeled>
        ))}
      </div>
      <Panel label="JSON-LD" actions={<CopyButton value={output} />}>
        <pre className={`${fieldClass} min-h-[24rem] overflow-auto whitespace-pre`}>{output}</pre>
      </Panel>
    </div>
  );
}
