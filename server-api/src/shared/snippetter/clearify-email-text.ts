
export const clearifyEmailText = (text: string) => {
  return ('' + text)
    .split('\n')
    .filter(piece => piece.trim()[0] !== '>')
    .join('\n');
}
