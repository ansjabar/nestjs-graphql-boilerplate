import * as fs from 'fs';
import * as os from 'os';
import { join } from 'path';

const envFilePath = join(process.cwd(), '.env');

const readEnvVars = () => fs.readFileSync(envFilePath, 'utf-8').split(os.EOL);

export const setEnvValue = (key, value) => {
  const envVars = readEnvVars();
  const targetLine = envVars.find((line) => line.split('=')[0] === key);
  if (targetLine !== undefined) {
    const targetLineIndex = envVars.indexOf(targetLine);

    envVars.splice(targetLineIndex, 1, `${key}='${value}'`);
  } else {
    envVars.push(`${key}='${value}'`);
  }

  fs.writeFileSync(envFilePath, envVars.join(os.EOL));
};
