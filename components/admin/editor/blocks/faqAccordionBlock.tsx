"use client";

import { Node, mergeAttributes, type CommandProps } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent, type NodeViewProps } from "@tiptap/react";
import { Trash2 } from "lucide-react";

// NOTE: class names below (faq-accordion / faq-accordion__heading / faq-accordion__list /
// faq-accordion__item / faq-accordion__question / faq-accordion__answer) must stay
// byte-identical to the ones in each node's renderHTML() and to the CSS in
// app/globals.css ([data-faq-accordion]) — the editor preview and the public page
// both rely on the exact same class names.

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    faqAccordion: {
      insertFaqAccordion: () => ReturnType;
    };
  }
}

function starterFaqItem() {
  return {
    type: "faqItem",
    content: [
      { type: "faqQuestion", content: [{ type: "text", text: "Your question here?" }] },
      {
        type: "faqAnswer",
        content: [{ type: "paragraph", content: [{ type: "text", text: "Your answer here." }] }],
      },
    ],
  };
}

// ─── faqAnswer: full rich text (paragraphs, bold, links, lists, ...) ──────────

export const FaqAnswerNode = Node.create({
  name: "faqAnswer",
  content: "block+",

  parseHTML() {
    return [{ tag: "details[data-faq-item] > div[data-faq-answer]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-faq-answer": "", class: "faq-accordion__answer" }), 0];
  },
});

// ─── faqQuestion: inline text (marks allowed) ─────────────────────────────────

export const FaqQuestionNode = Node.create({
  name: "faqQuestion",
  content: "inline*",

  parseHTML() {
    return [{ tag: "details[data-faq-item] > summary" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["summary", mergeAttributes(HTMLAttributes, { class: "faq-accordion__question" }), 0];
  },
});

// ─── faqItem: one question + one answer, serializes to native <details> ──────

function FaqItemView({ editor, getPos, node }: NodeViewProps) {
  const removeSelf = () => {
    const pos = getPos();
    if (typeof pos !== "number") return;
    editor.chain().focus().deleteRange({ from: pos, to: pos + node.nodeSize }).run();
  };

  return (
    <NodeViewWrapper
      as="details"
      open
      className="faq-accordion__item"
      data-faq-item=""
      style={{ position: "relative" }}
    >
      <NodeViewContent />
      <div contentEditable={false} className="absolute top-4 right-0">
        <button
          type="button"
          onClick={removeSelf}
          className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-red-600"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </NodeViewWrapper>
  );
}

export const FaqItemNode = Node.create({
  name: "faqItem",
  content: "faqQuestion faqAnswer",
  isolating: true,

  parseHTML() {
    return [{ tag: "details[data-faq-item]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["details", mergeAttributes(HTMLAttributes, { "data-faq-item": "", class: "faq-accordion__item" }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FaqItemView);
  },
});

// ─── faqAccordion: heading + N faqItems ───────────────────────────────────────

function FaqAccordionView({ node, updateAttributes, getPos, editor }: NodeViewProps) {
  const heading = (node.attrs as { heading: string }).heading;

  const addQuestion = () => {
    const pos = getPos();
    if (typeof pos !== "number") return;
    const endPos = pos + node.nodeSize - 1;
    editor.chain().focus().insertContentAt(endPos, starterFaqItem()).run();
  };

  return (
    <NodeViewWrapper className="faq-accordion" data-faq-accordion="">
      <div contentEditable={false}>
        <input
          value={heading}
          onChange={(e) => updateAttributes({ heading: e.target.value })}
          className="faq-accordion__heading w-full bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-[#045830] rounded"
        />
      </div>
      <NodeViewContent className="faq-accordion__list" />
      <div contentEditable={false} className="pb-4">
        <button
          type="button"
          onClick={addQuestion}
          className="w-full px-3 py-2 border border-dashed border-[#daefdc] rounded text-sm text-[#045830] hover:bg-[#EDF9F5] transition"
        >
          + Add Question
        </button>
      </div>
    </NodeViewWrapper>
  );
}

export const FaqAccordionNode = Node.create({
  name: "faqAccordion",
  group: "block",
  content: "faqItem+",
  isolating: true,

  addAttributes() {
    return {
      heading: {
        default: "Frequently asked questions",
        parseHTML: (el: HTMLElement) => el.dataset.heading ?? "Frequently asked questions",
        renderHTML: (attrs: { heading: string }) => ({ "data-heading": attrs.heading }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-faq-accordion]" }];
  },

  renderHTML({ HTMLAttributes, node }) {
    const { heading } = node.attrs as { heading: string };
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-faq-accordion": "", class: "faq-accordion" }),
      ["div", { class: "faq-accordion__heading" }, heading],
      ["div", { class: "faq-accordion__list" }, 0],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FaqAccordionView);
  },

  addCommands() {
    return {
      insertFaqAccordion:
        () =>
        ({ commands }: CommandProps) =>
          commands.insertContent({
            type: this.name,
            attrs: { heading: "Frequently asked questions" },
            content: [starterFaqItem()],
          }),
    };
  },
});
