"use client";

import { Node, mergeAttributes, type CommandProps } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Modal } from "../ToolbarUI";

// NOTE: class names below (tip-box / tip-box__text / tip-box__icon) must stay
// byte-identical to the ones in renderHTML() further down and to the CSS in
// app/globals.css ([data-tip-box]) — the editor preview and the public page
// both rely on the exact same class names.

export interface TipBoxAttrs {
  text: string;
}

export const TIP_BOX_DEFAULTS: TipBoxAttrs = {
  text: "Share a helpful tip or interesting fact here.",
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    tipBox: {
      setTipBox: (attrs: TipBoxAttrs) => ReturnType;
    };
  }
}

export function TipBoxFields({
  value,
  onChange,
}: {
  value: TipBoxAttrs;
  onChange: (next: TipBoxAttrs) => void;
}) {
  return (
    <textarea
      value={value.text}
      onChange={(e) => onChange({ ...value, text: e.target.value })}
      placeholder="Tip text"
      rows={4}
      className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#045830]"
    />
  );
}

function TipBoxView({ node, updateAttributes, deleteNode, selected }: NodeViewProps) {
  const attrs = node.attrs as TipBoxAttrs;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<TipBoxAttrs>(attrs);

  return (
    <NodeViewWrapper
      contentEditable={false}
      className={`tip-box relative group ${selected ? "ring-2 ring-[#045830] ring-offset-2" : ""}`}
      data-tip-box=""
    >
      <div className="tip-box__text">{attrs.text}</div>
      <div className="tip-box__icon" />

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
        <Modal title="Edit Tip Box" onClose={() => setEditing(false)}>
          <TipBoxFields value={draft} onChange={setDraft} />
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

export const TipBoxNode = Node.create({
  name: "tipBox",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      text: {
        default: TIP_BOX_DEFAULTS.text,
        parseHTML: (el: HTMLElement) => el.querySelector(".tip-box__text")?.textContent?.trim() ?? "",
        renderHTML: () => ({}),
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-tip-box]" }];
  },

  renderHTML({ HTMLAttributes, node }) {
    const { text } = node.attrs as TipBoxAttrs;
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-tip-box": "", class: "tip-box" }),
      ["div", { class: "tip-box__text" }, text],
      ["div", { class: "tip-box__icon" }],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TipBoxView);
  },

  addCommands() {
    return {
      setTipBox:
        (attrs: TipBoxAttrs) =>
        ({ commands }: CommandProps) =>
          commands.insertContent({ type: this.name, attrs }),
    };
  },
});
