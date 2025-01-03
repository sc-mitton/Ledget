import * as React from 'react';
import Svg, { Path, Circle, SvgProps } from 'react-native-svg';

function SvgComponent(props: SvgProps & { size?: number }) {
  const { fill, stroke, size = 58, ...rest } = props;
  return (
    <Svg
      x="0px"
      y="0px"
      viewBox="0 0 153.6 195.2"
      width={size}
      height={size}
      {...props}
    >
      <Path
        fill={fill}
        stroke={stroke}
        strokeWidth={8}
        strokeMiterlimit={10}
        d="M130.7 191.2H22.9c-10.4 0-18.9-8.4-18.9-18.9V99.8c0-10.4 8.4-18.9 18.9-18.9h107.9c10.4 0 18.9 8.4 18.9 18.9v72.6c-.1 10.4-8.6 18.8-19 18.8zM116.6 80.9V43.8c0-22-17.8-39.8-39.8-39.8S37 21.8 37 43.8v37.1"
      />
      <Circle fill={stroke} cx={37} cy={135.9} r={5.7} />
      <Circle fill={stroke} cx={116.6} cy={135.9} r={5.7} />
      <Circle fill={stroke} cx={63.5} cy={135.9} r={5.7} />
      <Circle fill={stroke} cx={90.1} cy={135.9} r={5.7} />
    </Svg>
  );
}

export default SvgComponent;
