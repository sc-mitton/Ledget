import * as React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import type { SvgProps } from 'react-native-svg';

function SvgComponent(props: SvgProps & { size?: number }) {
  return (
    <Svg
      x="0px"
      y="0px"
      viewBox="0 0 24 24"
      width={props.size}
      height={props.size}
      stroke="currentColor"
      fill="none"
      {...props}
    >
      <Path
        strokeWidth={0.85}
        strokeLinecap="round"
        strokeMiterlimit={10}
        d="M3.9 15.8V6.5c0-.4.3-.6.6-.6h15c.4 0 .6.3.6.6v9.3"
      />
      <Path
        fill="none"
        strokeWidth={0.8}
        d="M21.7 18.1H2.3c-.3 0-.5-.2-.5-.5v-.3c0-.3.2-.5.4-.5h19.5c.4 0 .6.2.6.5v.3c0 .3-.3.5-.6.5z"
      />
      <Circle fill="currentColor" cx={12} cy={8.1} r={0.2} />
    </Svg>
  );
}

export default SvgComponent;
