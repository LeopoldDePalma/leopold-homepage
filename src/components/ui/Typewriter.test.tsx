import {ChakraProvider} from '@chakra-ui/react';
import {act, render} from '@testing-library/react';
import {NextIntlClientProvider} from 'next-intl';
import type {ReactNode} from 'react';

import {system} from '@/styles/system';

import {Typewriter} from './Typewriter';

const TEXT = 'مطوّر';

const Providers = ({children}: {children: ReactNode}) => {
  return (
    <ChakraProvider value={system}>
      <NextIntlClientProvider locale="ar" messages={{}}>
        {children}
      </NextIntlClientProvider>
    </ChakraProvider>
  );
};

const renderTypewriter = () => {
  const {container, rerender} = render(<Typewriter text={TEXT} />, {wrapper: Providers});

  const typedLayer = container.querySelector('p > span:last-child');

  const retype = (text: string) => {
    rerender(<Typewriter text={text} />);
  };

  return {container, typedText: () => typedLayer?.textContent, retype};
};

const typeGraphemes = (count: number) => {
  for (let tick = 0; tick < count; tick++) {
    act(() => {
      vi.advanceTimersToNextTimer();
    });
  }
};

describe('Typewriter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn()})),
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('gives assistive technology the full text immediately', () => {
    const {container} = renderTypewriter();

    expect(container.querySelector('p > span:first-child')).toHaveTextContent(TEXT);
  });

  it('types grapheme by grapheme, keeping letters with their diacritics', () => {
    const {typedText} = renderTypewriter();

    expect(typedText()).toBe('');

    typeGraphemes(3);
    // The third grapheme is "وّ" — the letter and its shadda appear together.
    expect(typedText()).toBe('مطوّ');

    typeGraphemes(10);
    expect(typedText()).toBe(TEXT);
  });

  it('starts over when the text changes, as it does on a locale switch', () => {
    const {typedText, retype} = renderTypewriter();

    typeGraphemes(3);
    retype('Developer');

    expect(typedText()).toBe('');

    typeGraphemes(3);
    expect(typedText()).toBe('Dev');
  });
});
