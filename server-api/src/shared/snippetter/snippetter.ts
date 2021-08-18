import { shared } from 'node-shared';
import { clearifyEmailText } from './clearify-email-text';
import { cpdReportParser } from './cpd-report-parser';
import { cpdRun } from './cpd-runner';


export class Snippetter {

  async snippetsFromEmails(rawTexts: string[]) {
    const texts = rawTexts
      .map(clearifyEmailText)
      .filter(text => text);

    const report = await cpdRun(texts);
    if (!report) return;

    return cpdReportParser(report, texts);
  }

}

export const sharedSnippetter = () => shared(Snippetter);
