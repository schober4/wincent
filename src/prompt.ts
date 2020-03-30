import * as readline from 'readline';
import {Writable} from 'stream';

type Options = {
  private?: boolean;
};

export default async function prompt(
  text: string,
  options: Options = {}
): Promise<string> {
  let muted = false;

  // https://stackoverflow.com/a/33500118/2103996
  const stdout = new Writable({
    write: (chunk, _encoding, callback) => {
      if (!muted) {
        process.stdout.write(chunk);
      }
      callback();
    },
  });

  const rl = readline.createInterface({
    historySize: 0,
    input: process.stdin,
    output: stdout,
    terminal: true,
  });

  try {
    const response = new Promise<string>((resolve) => {
      rl.question(text, (response) => {
        process.stdout.write('\n');
        resolve(response);
      });
    });

    muted = !!options.private;

    return await response;
  } finally {
    rl.close();
  }
}
