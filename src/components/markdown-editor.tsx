"use client";

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
      className="md-editor-override rounded-md overflow-hidden border border-white/10 focus-within:border-amber-500/50 transition-colors bg-white/5"
    >
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || "")}
        height={minHeight}
        preview="edit"
        visibleDragbar={false}
        textareaProps={{
          placeholder,
          style: {
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "14px",
            color: "rgba(255,255,255,0.7)",
          },
        }}
      />
    </div>
  );
}
