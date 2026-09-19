import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {NextIntlClientProvider} from 'next-intl';

import messages from '@/messages/en.json';

import {THEME_STORAGE_KEY} from './theme';
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
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('switches between light and dark themes and remembers the choice', async () => {
    const user = userEvent.setup();
    renderToggle();

    const button = screen.getByRole('button', {name: 'Toggle theme'});

    await user.click(button);
    expect(document.documentElement).toHaveClass('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');

    await user.click(button);
    expect(document.documentElement).not.toHaveClass('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });
});
