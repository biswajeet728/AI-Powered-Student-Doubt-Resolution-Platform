import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-invert prose-sm max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <pre className="rounded-lg bg-white/5 border border-white/10 p-3 overflow-x-auto">
                <code className={`font-mono text-xs text-amber-300 ${className || ""}`} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-amber-300" {...props}>
                {children}
              </code>
            );
          },
          pre({ children }) {
            return <>{children}</>;
          },
          p({ children }) {
            return <p className="font-mono text-sm text-white/60 leading-relaxed mb-2 last:mb-0">{children}</p>;
          },
          h1({ children }) {
            return <h1 className="font-mono text-lg font-bold text-white mb-2">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="font-mono text-base font-bold text-white mb-2">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="font-mono text-sm font-bold text-white mb-1.5">{children}</h3>;
          },
          ul({ children }) {
            return <ul className="font-mono text-sm text-white/60 list-disc pl-5 mb-2 space-y-1">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="font-mono text-sm text-white/60 list-decimal pl-5 mb-2 space-y-1">{children}</ol>;
          },
          li({ children }) {
            return <li className="font-mono text-sm text-white/60">{children}</li>;
          },
          a({ href, children }) {
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" className="font-mono text-sm text-amber-400 underline underline-offset-2 hover:text-amber-300">
                {children}
              </a>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-2 border-amber-500/40 pl-3 my-2 text-white/50 italic">
                {children}
              </blockquote>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-2">
                <table className="font-mono text-xs text-white/60 border-collapse w-full">
                  {children}
                </table>
              </div>
            );
          },
          th({ children }) {
            return <th className="border border-white/10 px-2 py-1 bg-white/5 text-left font-medium">{children}</th>;
          },
          td({ children }) {
            return <td className="border border-white/10 px-2 py-1">{children}</td>;
          },
          hr() {
            return <hr className="border-white/10 my-3" />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
