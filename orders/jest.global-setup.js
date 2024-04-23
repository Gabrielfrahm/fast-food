import { exec } from 'child_process';
import { randomUUID } from 'crypto';
import * as dotenv from 'dotenv';
import { promisify } from 'util';
dotenv.config({ path: '.env.test' });

const prismaBinary = './node_modules/.bin/prisma';

export default async () => {
  console.info('\nMontando suíte de testes...');

  const execSync = promisify(exec);

  global.__SCHEMA__ = `test_${randomUUID()}`;

  process.env.DATABASE_URL = `${process.env.DATABASE_URL}&schema=${global.__SCHEMA__}`;

  await execSync(`${prismaBinary} migrate deploy`);

  console.info('Suíte pronta. Iniciando testes...\n');
};
