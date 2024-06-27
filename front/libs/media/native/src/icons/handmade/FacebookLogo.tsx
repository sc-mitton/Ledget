import Svg, { Path } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

function SvgComponent({ size = 32, ...rest }: SvgProps & { size?: number }) {
  return (
    <Svg x="0px" y="0px" viewBox="0 0 48 48" width={size} height={size} {...rest}>
      <Path
        d="M24 .5C11 .5.5 11 .5 24c0 11.8 8.7 21.6 20 23.2v-17h-5.8V24h5.8v-3.9c0-6.8 3.3-9.8 9-9.8 2.7 0 4.2.1 4.8.2v5.4h-3.8c-2.3 0-3.2 2.2-3.2 4.8V24h7l-1 6.2h-6v17.1C38.7 45.7 47.5 35.9 47.5 24 47.5 11 37 .5 24 .5z"
        fill="#039be5"
      />
    </Svg>
  );
}

export default SvgComponent;
