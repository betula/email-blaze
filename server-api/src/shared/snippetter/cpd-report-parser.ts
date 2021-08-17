import parser from 'fast-xml-parser';
import { sharedLogger } from 'shared/logger';

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
  if (parser.validate(report) !== true) {
    sharedLogger().warn('cpd report is not valid xml');
    return;
  }

  const raw = parser.parse(report, {
    ignoreAttributes : false,
    attributeNamePrefix : '',
  });

  const dups = raw?.['pmd-cpd']?.['duplication'];
  if (!dups || !Array.isArray(dups)) {
    sharedLogger().warn('cpd report has not contain duplication');
    return;
  }

  const files = texts.map(text => text.split('\n'));

  const snippets = [];

  for (let dup of dups) {
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

    snippets.push(snippet);
  }

  sharedLogger().info('count of snippets in cpd report', snippets.length);

  return snippets;
}
