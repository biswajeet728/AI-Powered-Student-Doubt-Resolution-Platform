"use client";

import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your doubt in markdown...",
  minHeight = 200,
}: MarkdownEditorProps) {
  return (
    <div
      data-color-mode="dark"
      className="rounded-md overflow-hidden border border-white/10 focus-within:border-amber-500/50 transition-colors bg-[#2a2826]/80"
    >
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || "")}
        height={minHeight}
        className="bg-[#2a2826]/80 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-transparent"
        preview="edit"
        visibleDragbar={false}
        textareaProps={{
          placeholder,
          style: {
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "14px",
            backgroundColor: "transparent",
          },
        }}
      />
    </div>
  );
}
