import { shared } from 'node-shared';
import { sharedLogger } from 'shared/logger';
import { clearifyEmailText } from './clearify-email-text';
import { cpdReportParser } from './cpd-report-parser';
import { cpdRun } from './cpd-runner';


export class Snippetter {

  async snippetsFromEmails(rawTexts: string[]) {
    try {
      const texts = rawTexts
        .map(clearifyEmailText)
        .filter(text => text);

      const report = await cpdRun(texts);
      if (!report) return;

      return cpdReportParser(report, texts);
    } catch (err) {
      sharedLogger().error('Error during snippets from emails', err);
    }
  }

}

export const sharedSnippetter = () => shared(Snippetter);
