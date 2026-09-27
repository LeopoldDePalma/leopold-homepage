import {ChakraProvider} from '@chakra-ui/react';
import {fireEvent, render, screen} from '@testing-library/react';
import {NextIntlClientProvider} from 'next-intl';

import messages from '@/messages/en.json';
import {system} from '@/styles/system';

import {ContactButton} from './ContactButton';

// The button sits at 100..300 across and 100..140 down, so its resting centre is 200 / 120.
const BOX = {left: 100, top: 100, width: 200, height: 40} as const;

const renderButton = () => {
  render(
    <ChakraProvider value={system}>
      <NextIntlClientProvider locale="en" messages={messages}>
        <ContactButton />
      </NextIntlClientProvider>
    </ChakraProvider>,
  );

  const link = screen.getByRole('link', {name: 'Write to me'});

  link.getBoundingClientRect = vi.fn(() => ({...BOX, right: 300, bottom: 140}) as DOMRect);

  return link;
};

const pointer = (clientX: number, clientY: number) => {
  return {pointerType: 'mouse', clientX, clientY};
};

describe('ContactButton', () => {
  it('leans a quarter of the way towards the pointer and lets go on leave', () => {
    const link = renderButton();

    fireEvent.pointerEnter(link, pointer(200, 120));
    fireEvent.pointerMove(link, pointer(240, 140));

    expect(link.style.translate).toBe('10px 5px');

    fireEvent.pointerLeave(link, pointer(400, 400));
    expect(link.style.translate).toBe('');
  });

  it('measures the centre once, so repeated moves do not drift', () => {
    const link = renderButton();

    fireEvent.pointerEnter(link, pointer(200, 120));
    fireEvent.pointerMove(link, pointer(240, 120));
    fireEvent.pointerMove(link, pointer(240, 120));

    expect(link.style.translate).toBe('10px 0px');
  });

  it('stays put for touch, which lands on the button anyway', () => {
    const link = renderButton();

    fireEvent.pointerEnter(link, pointer(200, 120));
    fireEvent.pointerMove(link, {pointerType: 'touch', clientX: 240, clientY: 140});

    expect(link.style.translate).toBe('');
  });
});
