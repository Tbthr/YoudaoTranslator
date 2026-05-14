declare var tjs;

import Translator from './translator';

const main = async () => {
  const translator = new Translator(tjs.getenv('key'), tjs.getenv('secret'));

  const word: string = Array.from(tjs.args).pop() as string;

  const result = await translator.translate(word);

  console.log(result);
}

main();
