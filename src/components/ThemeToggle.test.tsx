import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';

import messages from '@/messages/en.json';

import { ThemeProvider } from './ThemeProvider';
import { ThemeToggle } from './ThemeToggle';

function renderToggle() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    </NextIntlClientProvider>,
  );
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    // jsdom has no matchMedia; report a light system theme.
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        // next-themes still subscribes through the legacy listener API.
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('switches between light and dark themes', async () => {
    const user = userEvent.setup();
    renderToggle();

    const button = screen.getByRole('button', { name: 'Toggle theme' });

    await user.click(button);
    expect(document.documentElement).toHaveClass('dark');

    await user.click(button);
    expect(document.documentElement).toHaveClass('light');
  });
});
