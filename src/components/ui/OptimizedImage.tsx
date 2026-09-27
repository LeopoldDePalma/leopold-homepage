'use client';

import {chakra} from '@chakra-ui/react';
import NextImage from 'next/image';

/**
 * next/image with Chakra's style props. `width` and `height` are style props to Chakra, so they
 * are forwarded explicitly: next/image needs them as the intrinsic size to reserve space and pick
 * a source. Client-side, because the factory runs at import.
 */
export const OptimizedImage = chakra(NextImage, {}, {forwardProps: ['width', 'height']});
