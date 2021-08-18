import parser from 'fast-xml-parser';

const MAX_LEN_SNIPPET = 400;

type SnippetConfig = {
  column: number;
  endcolumn: number;
  endline: number;
  line: number;
}

const extractSnippet = (file: string[], config: SnippetConfig) => {
  const slice = file.slice(config.line, config.endline + 1);
  const len = slice.length;
  if (!len) return;
  if (config.line === config.endline) {
    slice[0] = slice[0].slice(config.column, config.endcolumn + 1);
  } else {
    slice[0] = slice[0].slice(config.column);
    slice[len - 1] = slice[len - 1].slice(0, config.endcolumn + 1)
  }

  return slice.join('\n');
}

const getTextIndexFromPath = (p?: string) => {
  const m = String(p).match(/_([0-9]+)$/);
  if (!m) return;
  const ind = parseInt(m[1]);
  if (isNaN(ind)) return;
  return ind;
}

export const cpdReportParser = (report: string, texts: string[]) => {
  if (parser.validate(report) !== true) return;

  const raw = parser.parse(report, {
    ignoreAttributes : false,
    attributeNamePrefix : '',
  });

  const dups = raw?.['pmd-cpd']?.['duplication'];
  if (!dups || !Array.isArray(dups)) return;

  const files = texts.map(text => text.split('\n'));

  const snippets = [] as [number, string][];

  for (let dup of dups) {
    const count = dup?.file?.length || 0;
    const info = dup?.file?.[0];
    if (!info) continue;

    const index = getTextIndexFromPath(info?.path);
    if (typeof index !== 'number') continue;

    const keys = ['column', 'endcolumn', 'endline', 'line'];
    const config = {} as any;
    keys.forEach(key => config[key] = parseInt(info?.[key]) - 1);

    if (keys.some(key => isNaN(config[key]))) continue;

    const snippet = extractSnippet(files[index], config);
    if (!snippet) continue;

    // to cut potential copies of messages
    if (snippet.length > MAX_LEN_SNIPPET) continue;

    snippets.push([count, snippet]);
  }

  // sort by frequency
  snippets.sort(([a], [b]) => b - a);

  return snippets.map(([_len, text]) => text);
}
