'use client';

import {chakra} from '@chakra-ui/react';
import NextImage from 'next/image';

// Chakra treats `width` and `height` as style props; next/image needs them itself.
export const OptimizedImage = chakra(NextImage, {}, {forwardProps: ['width', 'height']});
