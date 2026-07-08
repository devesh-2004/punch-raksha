"use client";

import { Node, mergeAttributes, type CommandProps } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Modal } from "../ToolbarUI";

// NOTE: class names below (callout / callout__label / callout__link) must stay
// byte-identical to the ones in renderHTML() further down and to the CSS in
// app/globals.css ([data-callout]) — the editor preview and the public page
// both rely on the exact same class names.

export interface CalloutAttrs {
  label: string;
  text: string;
  url: string;
}

export const CALLOUT_DEFAULTS: CalloutAttrs = {
  label: "Read more:",
  text: "Which engagement model you must choose?",
  url: "",
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    callout: {
      setCallout: (attrs: CalloutAttrs) => ReturnType;
    };
  }
}

export function CalloutFields({
  value,
  onChange,
}: {
  value: CalloutAttrs;
  onChange: (next: CalloutAttrs) => void;
}) {
  return (
    <div className="space-y-3">
      <input
        value={value.label}
        onChange={(e) => onChange({ ...value, label: e.target.value })}
        placeholder="Label (e.g. Read more:)"
        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#045830]"
      />
      <input
        value={value.text}
        onChange={(e) => onChange({ ...value, text: e.target.value })}
        placeholder="Text"
        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#045830]"
      />
      <input
        value={value.url}
        onChange={(e) => onChange({ ...value, url: e.target.value })}
        placeholder="Link URL (optional)"
        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#045830]"
      />
    </div>
  );
}

function CalloutView({ node, updateAttributes, deleteNode, selected }: NodeViewProps) {
  const attrs = node.attrs as CalloutAttrs;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<CalloutAttrs>(attrs);

  return (
    <NodeViewWrapper
      contentEditable={false}
      className={`callout relative group ${selected ? "ring-2 ring-[#045830] ring-offset-2" : ""}`}
      data-callout=""
    >
      <span className="callout__label">{attrs.label}</span>
      {attrs.url ? (
        <a className="callout__link" href={attrs.url} onClick={(e) => e.preventDefault()}>
          {attrs.text}
        </a>
      ) : (
        <span className="callout__link">{attrs.text}</span>
      )}

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
        <Modal title="Edit Callout" onClose={() => setEditing(false)}>
          <CalloutFields value={draft} onChange={setDraft} />
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

export const CalloutNode = Node.create({
  name: "callout",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      label: {
        default: CALLOUT_DEFAULTS.label,
        parseHTML: (el: HTMLElement) => el.querySelector(".callout__label")?.textContent?.trim() ?? "",
        renderHTML: () => ({}),
      },
      text: {
        default: CALLOUT_DEFAULTS.text,
        parseHTML: (el: HTMLElement) => el.querySelector(".callout__link")?.textContent?.trim() ?? "",
        renderHTML: () => ({}),
      },
      url: {
        default: CALLOUT_DEFAULTS.url,
        parseHTML: (el: HTMLElement) => el.querySelector("a.callout__link")?.getAttribute("href") || "",
        renderHTML: () => ({}),
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-callout]" }];
  },

  renderHTML({ HTMLAttributes, node }) {
    const { label, text, url } = node.attrs as CalloutAttrs;
    const linkOrText = url && url.trim()
      ? ["a", { class: "callout__link", href: url, target: "_blank", rel: "noopener noreferrer" }, text]
      : ["span", { class: "callout__link" }, text];
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-callout": "", class: "callout" }),
      ["span", { class: "callout__label" }, label],
      linkOrText,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutView);
  },

  addCommands() {
    return {
      setCallout:
        (attrs: CalloutAttrs) =>
        ({ commands }: CommandProps) =>
          commands.insertContent({ type: this.name, attrs }),
    };
  },
});
