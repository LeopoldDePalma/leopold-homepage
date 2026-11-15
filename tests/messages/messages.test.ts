import {flatMap, forEach, fromPairs, isString, keys, map, sortBy, toPairs} from 'lodash-es';

import ar from '@/messages/ar.json';
import en from '@/messages/en.json';
import fr from '@/messages/fr.json';

type MessageTree = {[key: string]: string | MessageTree};

// Placeholders only: each locale marks its own foreign fragments with tags.
const placeholderPattern = /\{(\w+)[^}]*\}/g;

const flatten = (messages: MessageTree, prefix = ''): [string, string][] =>
  flatMap(toPairs(messages), ([key, value]) => {
    const path = `${prefix}${key}`;

    if (isString(value)) {
      const entry: [string, string] = [path, value];

      return [entry];
    }

    return flatten(value, `${path}.`);
  });

const placeholders = (message: string) =>
  sortBy(map(Array.from(message.matchAll(placeholderPattern)), 1));

const source = fromPairs(flatten(en));

forEach({ar, fr}, (messages, locale) => {
  describe(`${locale} messages`, () => {
    const translation = fromPairs(flatten(messages));

    // The same order too, so a key sits in the same place in every file.
    it('has exactly the keys English has, in the same order', () => {
      expect(keys(translation)).toEqual(keys(source));
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
