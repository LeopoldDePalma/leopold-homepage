import {act, render, screen} from '@testing-library/react';
import {NextIntlClientProvider} from 'next-intl';

import {Typewriter} from './Typewriter';

const TEXT = 'مطوّر';

const renderTypewriter = () => {
  const {container} = render(
    <NextIntlClientProvider locale="ar" messages={{}}>
      <Typewriter text={TEXT} />
    </NextIntlClientProvider>,
  );

  // The visually typed layer is the last child of the paragraph.
  const typedLayer = container.querySelector('p > span:last-child');

  return {typedText: () => typedLayer?.textContent};
};

// Each tick schedules the next one after re-rendering, so ticks are advanced one at a time.
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
      vi.fn(() => ({matches: false})),
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('gives assistive technology the full text immediately', () => {
    renderTypewriter();

    expect(screen.getByText(TEXT, {selector: '.sr-only'})).toBeInTheDocument();
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
});
