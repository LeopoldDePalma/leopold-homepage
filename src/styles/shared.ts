import type {SystemStyleObject} from '@chakra-ui/react';

export const whenDark = (styles: SystemStyleObject): SystemStyleObject => ({
  _themeDark: styles,
  _osDark: {_themeUnset: styles},
});

export const TILT_ON_GROUP_HOVER = {
  transitionProperty: 'rotate',
  transitionDuration: 'slow',
  _groupHover: {rotate: '-12deg', _rtl: {rotate: '12deg'}},
  _motionReduce: {transition: 'none'},
} satisfies SystemStyleObject;
