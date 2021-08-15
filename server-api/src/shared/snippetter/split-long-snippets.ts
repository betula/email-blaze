
const SOFT_LIMIT = 300;

export const splitLongSnippets = (texts?: string[]) => {
  if (!texts) return;

  const ret = [] as string[];

  for (let text of texts) {
    if (text.length <= SOFT_LIMIT) {
      ret.push(text);
      continue;
    }
    let acc = [] as string[];
    let accSize = 0;
    let pieces = text.split('\n');
    for (let piece of pieces) {
      acc.push(piece);
      accSize += piece.length;
      if (accSize >= SOFT_LIMIT) {
        ret.push(acc.join('\n'));
        acc = [];
        accSize = 0;
      }
    }
    if (accSize) {
      ret.push(acc.join('\n'));
    }
  }

  return ret;
}
