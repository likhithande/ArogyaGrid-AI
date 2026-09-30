import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockLanguage = '';
  let codeBlockLines: string[] = [];
  let inTable = false;
  let tableHeader: string[] = [];
  let tableRows: string[][] = [];

  const flushCodeBlock = (key: string) => {
    if (codeBlockLines.length > 0) {
      elements.push(
        <div
          key={key}
          style={{
            background: 'var(--bg-app)',
            border: '1px solid var(--border-color)',
            borderRadius: 8,
            padding: '12px 14px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            overflowX: 'auto',
            margin: '12px 0',
            color: 'var(--text-primary)',
            whiteSpace: 'pre-wrap',
          }}
        >
          {codeBlockLines.join('\n')}
        </div>
      );
      codeBlockLines = [];
    }
    inCodeBlock = false;
  };

  const flushTable = (key: string) => {
    if (tableHeader.length > 0 || tableRows.length > 0) {
      elements.push(
        <div key={key} className="ag-table-container" style={{ margin: '14px 0' }}>
          <table className="ag-table">
            {tableHeader.length > 0 && (
              <thead>
                <tr>
                  {tableHeader.map((th, i) => (
                    <th key={i}>{th.trim()}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {tableRows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx}>{renderInline(cell.trim())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableHeader = [];
      tableRows = [];
    }
    inTable = false;
  };

  const renderInline = (text: string): React.ReactNode => {
    // Process bold, inline code, links
    const parts: React.ReactNode[] = [];
    // Regex for bold **text** or `code`
    const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(
          <strong key={match.index} style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
            {token.substring(2, token.length - 2)}
          </strong>
        );
      } else if (token.startsWith('`') && token.endsWith('`')) {
        parts.push(
          <code
            key={match.index}
            style={{
              background: 'var(--bg-app)',
              padding: '2px 6px',
              borderRadius: 4,
              fontSize: '0.88em',
              fontFamily: 'JetBrains Mono',
              border: '1px solid var(--border-color)',
              color: 'var(--color-blue)',
            }}
          >
            {token.substring(1, token.length - 1)}
          </code>
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];

    // Check code blocks
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        flushCodeBlock(`code-${idx}`);
      } else {
        if (inTable) flushTable(`table-${idx}`);
        inCodeBlock = true;
        codeBlockLanguage = line.trim().replace('```', '');
        codeBlockLines = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    // Check tables
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const cells = line
        .trim()
        .split('|')
        .slice(1, -1);
      // Skip delimiter row like | :--- | :--- |
      if (cells.some((c) => c.includes('---'))) {
        continue;
      }
      if (!inTable) {
        inTable = true;
        tableHeader = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      flushTable(`table-${idx}`);
    }

    // Headings
    if (line.startsWith('### ')) {
      elements.push(
        <h3
          key={`h3-${idx}`}
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            margin: '16px 0 8px',
          }}
        >
          {line.replace('### ', '')}
        </h3>
      );
      continue;
    }

    if (line.startsWith('#### ')) {
      elements.push(
        <h4
          key={`h4-${idx}`}
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--text-primary)',
            margin: '12px 0 6px',
          }}
        >
          {line.replace('#### ', '')}
        </h4>
      );
      continue;
    }

    // Blockquotes
    if (line.startsWith('> ')) {
      elements.push(
        <div
          key={`quote-${idx}`}
          style={{
            borderLeft: '3px solid var(--color-green)',
            background: 'var(--color-green-light)',
            padding: '10px 14px',
            borderRadius: '0 8px 8px 0',
            fontSize: 13,
            color: 'var(--color-green-deep)',
            margin: '12px 0',
            lineHeight: 1.5,
          }}
        >
          {renderInline(line.replace('> ', ''))}
        </div>
      );
      continue;
    }

    // Lists
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      elements.push(
        <div
          key={`li-${idx}`}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            fontSize: 13,
            color: 'var(--text-primary)',
            margin: '4px 0',
            lineHeight: 1.5,
          }}
        >
          <span style={{ color: 'var(--color-green)', fontWeight: 800 }}>•</span>
          <div>{renderInline(line.trim().substring(2))}</div>
        </div>
      );
      continue;
    }

    // Numbered lists
    if (/^\d+\.\s/.test(line.trim())) {
      const match = line.trim().match(/^(\d+)\.\s(.*)/);
      if (match) {
        elements.push(
          <div
            key={`num-${idx}`}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              fontSize: 13,
              color: 'var(--text-primary)',
              margin: '4px 0',
              lineHeight: 1.5,
            }}
          >
            <span style={{ color: 'var(--color-blue)', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>
              {match[1]}.
            </span>
            <div>{renderInline(match[2])}</div>
          </div>
        );
        continue;
      }
    }

    // Regular paragraphs
    if (line.trim().length > 0) {
      elements.push(
        <p
          key={`p-${idx}`}
          style={{
            fontSize: 13,
            color: 'var(--text-primary)',
            lineHeight: 1.6,
            margin: '6px 0',
          }}
        >
          {renderInline(line)}
        </p>
      );
    }
  }

  if (inCodeBlock) flushCodeBlock('code-end');
  if (inTable) flushTable('table-end');

  return <div>{elements}</div>;
};
