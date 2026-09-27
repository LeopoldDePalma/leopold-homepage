import {
  difference,
  flatMap,
  forEach,
  fromPairs,
  isString,
  keys,
  map,
  sortBy,
  toPairs,
} from 'lodash-es';

import ar from './ar.json';
import en from './en.json';
import fr from './fr.json';

type MessageTree = {[key: string]: string | MessageTree};

// Placeholders only: each locale marks its own foreign fragments with tags.
const PLACEHOLDER = /\{(\w+)[^}]*\}/g;

const flatten = (messages: MessageTree, prefix = ''): [string, string][] => {
  return flatMap(toPairs(messages), ([key, value]) => {
    const path = `${prefix}${key}`;

    return isString(value) ? [[path, value] as [string, string]] : flatten(value, `${path}.`);
  });
};

const placeholders = (message: string) => {
  return sortBy(map(Array.from(message.matchAll(PLACEHOLDER)), 1));
};

const source = fromPairs(flatten(en));

forEach({ar, fr}, (messages, locale) => {
  describe(`${locale} messages`, () => {
    const translation = fromPairs(flatten(messages));

    it('has exactly the keys English has', () => {
      expect(difference(keys(source), keys(translation))).toEqual([]);
      expect(difference(keys(translation), keys(source))).toEqual([]);
    });

    it('keeps the placeholders of every message', () => {
      forEach(source, (message, key) => {
        expect({key, placeholders: placeholders(translation[key] ?? '')}).toEqual({
          key,
          placeholders: placeholders(message),
        });
      });
    });
  });
});
