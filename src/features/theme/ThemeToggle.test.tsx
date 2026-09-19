import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {NextIntlClientProvider} from 'next-intl';

import messages from '@/messages/en.json';

import {THEME_COOKIE} from './theme';
import {ThemeToggle} from './ThemeToggle';

const renderToggle = () => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ThemeToggle />
    </NextIntlClientProvider>,
  );
};

describe('ThemeToggle', () => {
  beforeEach(() => {
    document.cookie = `${THEME_COOKIE}=;max-age=0;path=/`;
    document.documentElement.removeAttribute('data-theme');
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({matches: false})),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('switches between light and dark themes and remembers the choice', async () => {
    const user = userEvent.setup();
    renderToggle();

    const button = screen.getByRole('button', {name: 'Toggle theme'});

    await user.click(button);
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(document.cookie).toContain(`${THEME_COOKIE}=dark`);

    await user.click(button);
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    expect(document.cookie).toContain(`${THEME_COOKIE}=light`);
  });
});
