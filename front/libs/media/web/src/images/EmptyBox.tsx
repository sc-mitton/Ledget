import emptyBoxLight from '../../../shared/images/empty-box-light.png';
import emptyBoxDark from '../../../shared/images/empty-box-dark.png';
import { HTMLProps } from 'react';

const EmptyBox = ({
  dark = false,
  size = 72,
  ...rest
}: HTMLProps<HTMLImageElement> & { dark?: boolean; size?: number }) => {
  return dark ? (
    <img style={{ width: size, height: size }} src={emptyBoxDark} {...rest} />
  ) : (
    <img style={{ width: size, height: size }} src={emptyBoxLight} {...rest} />
  );
};

export default EmptyBox;
