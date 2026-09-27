import {Button, type ButtonProps} from '@chakra-ui/react';

/**
 * A quiet button for secondary actions: ink on a hairline border, turning gold on hover. With
 * `asChild` it dresses a link, such as the way back from the 404 page.
 */
export const OutlineButton = (props: ButtonProps) => {
  return (
    <Button
      variant="outline"
      color="fg"
      _hover={{color: 'accent', borderColor: 'accent', bg: 'transparent'}}
      _active={{transform: 'scale(0.97)'}}
      _motionReduce={{transition: 'none', _active: {transform: 'none'}}}
      {...props}
    />
  );
};
