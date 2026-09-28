import type {SystemStyleObject} from '@chakra-ui/react';

export const whenDark = (styles: SystemStyleObject): SystemStyleObject => ({
  _themeDark: styles,
  _osDark: {_themeUnset: styles},
});
