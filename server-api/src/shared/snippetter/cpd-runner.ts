import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import execa from 'execa';
import { PMD_PATH_BIN } from 'constants/pmd';
import { sharedLogger } from 'shared/logger';

const TMP_PREFIX = 'email-blaze-';

const createDirWithTexts = async (texts: string[]) => {
  let directory = '';
  try {
    directory = await fs.mkdtemp(path.join(os.tmpdir(), TMP_PREFIX));
  } catch (e) {
    return;
  }

  try {
    const len = texts.length;
    for (let i = 0; i < len; i++) {
      await fs.writeFile(path.join(directory, '_' + i), texts[i]);
    }
    return directory;
  } catch (_err) {
    await removeDirWithTexts(directory);
  }
}

const removeDirWithTexts = async (directory: string) => {
  try {
    await execa('rm', [
      '-rf',
      directory
    ]);
  }
  catch (_err) {}
}

const cmd = async (directory: string, texts: string[]) => {
  try {
    const { stdout } = await execa(
      path.resolve(PMD_PATH_BIN),
      [
        'cpd',
        '--minimum-tokens', '3',
        '--files',
        ...texts.map((_text, i) => '_' + i),
        '--format', 'xml',
        '--language', 'text'
      ],
      {
        cwd: directory
      }
    );
    return stdout
  } catch (err) {
    if (err.stdout && err.exitCode === 4) {
      return err.stdout;
    }
    throw err
  }
}

export const cpdRun = async (texts: string[]) => {
  const directory = await createDirWithTexts(texts);
  if (!directory) {
    sharedLogger().error('No possible to create tmp directory for cpd texts');
    return;
  }

  try {
    return await cmd(directory, texts);
  }
  catch (err) {
    sharedLogger().error('Error during snippets creation', err);
  }
  finally {
    await removeDirWithTexts(directory);
  }
}
