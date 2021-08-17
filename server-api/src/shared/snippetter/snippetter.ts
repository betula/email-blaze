import { shared } from 'node-shared';
import { sharedLogger } from 'shared/logger';
import { clearifyEmailText } from './clearify-email-text';
import { cpdReportParser } from './cpd-report-parser';
import { cpdRun } from './cpd-runner';
import { splitLongSnippets } from './split-long-snippets';


export class Snippetter {

  async snippetsFromEmails(rawTexts: string[]) {
    const texts = rawTexts
      .map(clearifyEmailText)
      .filter(text => text);

    sharedLogger().info('count of texts for cpd', texts.length);

    const report = await cpdRun(texts);


    if (!report) {
      sharedLogger().warn('no have report from cpd');
      return;
    }

    return splitLongSnippets(
      cpdReportParser(report, texts)
    );
  }

}

export const sharedSnippetter = () => shared(Snippetter);
