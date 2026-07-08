"use client";

import { Node, mergeAttributes, type CommandProps } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Modal } from "../ToolbarUI";

// NOTE: class names below (cta-banner / cta-banner__text / cta-banner__heading /
// cta-banner__subtext / cta-banner__btn) must stay byte-identical to the ones in
// renderHTML() further down and to the CSS in app/globals.css ([data-cta-banner]) —
// the editor preview and the public page both rely on the exact same class names.

export type CtaBannerVariant = "light" | "dark";

export interface CtaBannerAttrs {
  variant: CtaBannerVariant;
  heading: string;
  subtext: string;
  buttonLabel: string;
  buttonUrl: string;
}

export const CTA_BANNER_DEFAULTS: CtaBannerAttrs = {
  variant: "light",
  heading: "Ready to get relief?",
  subtext: "Shop our clinically tested Ayurvedic piles care range today.",
  buttonLabel: "Shop Now",
  buttonUrl: "/products",
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    ctaBanner: {
      setCtaBanner: (attrs: CtaBannerAttrs) => ReturnType;
    };
  }
}

export function CtaBannerFields({
  value,
  onChange,
}: {
  value: CtaBannerAttrs;
  onChange: (next: CtaBannerAttrs) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {(["light", "dark"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange({ ...value, variant: v })}
            className={`flex-1 px-3 py-2 rounded border text-sm capitalize transition-colors ${
              value.variant === v ? "border-[#045830] bg-[#EDF9F5] font-semibold" : "border-gray-200 text-gray-600"
            }`}
          >
            {v}
          </button>
        ))}
      </div>
      <input
        value={value.heading}
        onChange={(e) => onChange({ ...value, heading: e.target.value })}
        placeholder="Heading"
        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#045830]"
      />
      <textarea
        value={value.subtext}
        onChange={(e) => onChange({ ...value, subtext: e.target.value })}
        placeholder="Subtext"
        rows={2}
        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#045830]"
      />
      <input
        value={value.buttonLabel}
        onChange={(e) => onChange({ ...value, buttonLabel: e.target.value })}
        placeholder="Button label"
        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#045830]"
      />
      <input
        value={value.buttonUrl}
        onChange={(e) => onChange({ ...value, buttonUrl: e.target.value })}
        placeholder="Button URL"
        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#045830]"
      />
    </div>
  );
}

function CtaBannerView({ node, updateAttributes, deleteNode, selected }: NodeViewProps) {
  const attrs = node.attrs as CtaBannerAttrs;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<CtaBannerAttrs>(attrs);

  return (
    <NodeViewWrapper
      contentEditable={false}
      className={`cta-banner relative group ${selected ? "ring-2 ring-[#045830] ring-offset-2" : ""}`}
      data-cta-banner=""
      data-variant={attrs.variant}
    >
      <div className="cta-banner__text">
        <div className="cta-banner__heading">{attrs.heading}</div>
        <div className="cta-banner__subtext">{attrs.subtext}</div>
      </div>
      <a className="cta-banner__btn" href={attrs.buttonUrl} onClick={(e) => e.preventDefault()}>
        {attrs.buttonLabel}
      </a>

      <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
        <button
          type="button"
          onClick={() => {
            setDraft(attrs);
            setEditing(true);
          }}
          className="w-7 h-7 flex items-center justify-center rounded bg-white/90 shadow text-gray-700 hover:text-[#045830]"
        >
          <Pencil size={14} />
        </button>
        <button
          type="button"
          onClick={() => deleteNode()}
          className="w-7 h-7 flex items-center justify-center rounded bg-white/90 shadow text-gray-700 hover:text-red-600"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {editing && (
        <Modal title="Edit CTA Banner" onClose={() => setEditing(false)}>
          <CtaBannerFields value={draft} onChange={setDraft} />
          <button
            type="button"
            onClick={() => {
              updateAttributes(draft);
              setEditing(false);
            }}
            className="w-full mt-3 px-3 py-2 bg-[#045830] text-white rounded text-sm hover:bg-[#034524] transition"
          >
            Save
          </button>
        </Modal>
      )}
    </NodeViewWrapper>
  );
}

export const CtaBannerNode = Node.create({
  name: "ctaBanner",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      variant: {
        default: CTA_BANNER_DEFAULTS.variant,
        parseHTML: (el: HTMLElement) => (el.dataset.variant as CtaBannerVariant) || "light",
        renderHTML: (attrs: CtaBannerAttrs) => ({ "data-variant": attrs.variant }),
      },
      heading: {
        default: CTA_BANNER_DEFAULTS.heading,
        parseHTML: (el: HTMLElement) => el.querySelector(".cta-banner__heading")?.textContent?.trim() ?? "",
        renderHTML: () => ({}),
      },
      subtext: {
        default: CTA_BANNER_DEFAULTS.subtext,
        parseHTML: (el: HTMLElement) => el.querySelector(".cta-banner__subtext")?.textContent?.trim() ?? "",
        renderHTML: () => ({}),
      },
      buttonLabel: {
        default: CTA_BANNER_DEFAULTS.buttonLabel,
        parseHTML: (el: HTMLElement) => el.querySelector(".cta-banner__btn")?.textContent?.trim() ?? "",
        renderHTML: () => ({}),
      },
      buttonUrl: {
        default: CTA_BANNER_DEFAULTS.buttonUrl,
        parseHTML: (el: HTMLElement) => el.querySelector(".cta-banner__btn")?.getAttribute("href") || "#",
        renderHTML: () => ({}),
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-cta-banner]" }];
  },

  renderHTML({ HTMLAttributes, node }) {
    const { heading, subtext, buttonLabel, buttonUrl } = node.attrs as CtaBannerAttrs;
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-cta-banner": "", class: "cta-banner" }),
      [
        "div",
        { class: "cta-banner__text" },
        ["div", { class: "cta-banner__heading" }, heading],
        ["div", { class: "cta-banner__subtext" }, subtext],
      ],
      [
        "a",
        {
          class: "cta-banner__btn",
          href: buttonUrl,
          target: "_blank",
          rel: "noopener noreferrer",
        },
        buttonLabel,
      ],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CtaBannerView);
  },

  addCommands() {
    return {
      setCtaBanner:
        (attrs: CtaBannerAttrs) =>
        ({ commands }: CommandProps) =>
          commands.insertContent({ type: this.name, attrs }),
    };
  },
});
