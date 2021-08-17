import { gmail_v1 } from 'googleapis/build/src/apis/gmail';

export const emailPartsExtractText = (parts?: gmail_v1.Schema$MessagePart[]) : string | void => {
  for (let part of parts || []) {
    if (part.mimeType === 'text/plain') {
      const body = part.body?.data;
      if (!body) break;

      const buff = Buffer.from(body, 'base64');
      const text = buff.toString('utf8');

      return text;
    } else if (part.mimeType === 'multipart/alternative') {
      return emailPartsExtractText(part.parts);
    }
  }
}
