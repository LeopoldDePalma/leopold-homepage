import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {IconButton} from './IconButton';

describe('IconButton', () => {
  it('exposes the label as the accessible name and handles clicks', async () => {
    const handleClick = vi.fn();
    render(<IconButton label="Open menu" onClick={handleClick} />);

    const button = screen.getByRole('button', {name: 'Open menu'});
    await userEvent.click(button);

    expect(button).toHaveAttribute('type', 'button');
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('lets a custom className override conflicting base utilities', () => {
    render(<IconButton label="Close" className="p-2" />);

    const button = screen.getByRole('button', {name: 'Close'});

    expect(button).toHaveClass('p-2');
    expect(button).not.toHaveClass('p-[0.5em]');
  });
});
