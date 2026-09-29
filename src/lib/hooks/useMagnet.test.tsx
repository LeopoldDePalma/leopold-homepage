import {fireEvent, render, screen} from '@testing-library/react';

import {useMagnet} from './useMagnet';

// The link sits at 100..300 across and 100..140 down, so its resting centre is 200 / 120.
const linkBox = {left: 100, top: 100, width: 200, height: 40} as const;

const MagneticLink = () => {
  const magnet = useMagnet();

  return (
    <a href="#top" {...magnet}>
      Target
    </a>
  );
};

const renderLink = () => {
  render(<MagneticLink />);

  const link = screen.getByRole('link', {name: 'Target'});

  link.getBoundingClientRect = vi.fn(() => ({...linkBox, right: 300, bottom: 140}) as DOMRect);

  return link;
};

const pointer = (clientX: number, clientY: number) => ({pointerType: 'mouse', clientX, clientY});

describe('useMagnet', () => {
  it('leans a quarter of the way towards the pointer and lets go on leave', () => {
    const link = renderLink();

    fireEvent.pointerEnter(link, pointer(200, 120));
    fireEvent.pointerMove(link, pointer(240, 140));

    expect(link.style.translate).toBe('10px 5px');

    fireEvent.pointerLeave(link, pointer(400, 400));
    expect(link.style.translate).toBe('');
  });

  it('measures the centre once, so repeated moves do not drift', () => {
    const link = renderLink();

    fireEvent.pointerEnter(link, pointer(200, 120));
    fireEvent.pointerMove(link, pointer(240, 120));
    fireEvent.pointerMove(link, pointer(240, 120));

    expect(link.style.translate).toBe('10px 0px');
  });

  it('stays put for touch, which lands on the link anyway', () => {
    const link = renderLink();

    fireEvent.pointerEnter(link, pointer(200, 120));
    fireEvent.pointerMove(link, {pointerType: 'touch', clientX: 240, clientY: 140});

    expect(link.style.translate).toBe('');
  });
});
