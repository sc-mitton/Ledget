import * as React from 'react';
import Svg, {
  LinearGradient,
  Stop,
  Path,
  Defs,
  Use,
  ClipPath,
  Circle,
  SvgProps,
} from 'react-native-svg';

function SvgComponent(props: SvgProps & { size?: number }) {
  const { size = 312, ...rest } = props;
  return (
    <Svg
      x="0px"
      y="0px"
      viewBox="0 0 300 600"
      width={size}
      height={size}
      {...rest}
    >
      <LinearGradient
        id="a"
        gradientUnits="userSpaceOnUse"
        x1={150.2884}
        y1={67.1225}
        x2={150.2884}
        y2={538.1779}
      >
        <Stop offset={0} stopColor="#bfbfbf" />
        <Stop offset={0.5825} stopColor="#bfbfbf" stopOpacity={0.1416} />
        <Stop offset={0.6786} stopColor="#bfbfbf" stopOpacity={0} />
      </LinearGradient>
      <Path
        fill="url(#a)"
        d="M263.4 200.2v-96.5c0-20.2-16.4-36.5-36.5-36.5H74c-20.2 0-36.5 16.4-36.5 36.5v52.7h-.1c-.8 0-1.4.6-1.4 1.4v13.9c0 .8.6 1.4 1.4 1.4h.1v16.2h-.1c-.8 0-1.4.6-1.4 1.4v29c0 .8.6 1.4 1.4 1.4h.1v8.8h-.1c-.8 0-1.4.6-1.4 1.4v29c0 .8.6 1.4 1.4 1.4h.1v240c0 20.2 16.4 36.5 36.5 36.5h152.9c20.2 0 36.5-16.4 36.5-36.5V251.3c.7-.1 1.2-.7 1.2-1.4v-48.4c0-.6-.5-1.2-1.2-1.3zm-11.5-97v398.9c0 13.5-11 24.5-24.5 24.5H73.5c-13.5 0-24.5-11-24.5-24.5V103.2c0-13.5 11-24.5 24.5-24.5h153.9c13.5 0 24.5 11 24.5 24.5z"
      />
      <Path
        fill="#e1e1e1"
        d="M224 299.4h-54.7c-5.2 0-9.4-4.2-9.4-9.4v-53.4c0-5.2 4.2-9.4 9.4-9.4H224c5.2 0 9.4 4.2 9.4 9.4V290c0 5.2-4.2 9.4-9.4 9.4zM222.4 213.3H78.2c-5.7 0-10.4-4.6-10.4-10.4v-56.5c0-5.7 4.6-10.4 10.4-10.4h144.2c5.7 0 10.4 4.6 10.4 10.4v56.5c0 5.8-4.7 10.4-10.4 10.4z"
      />
      <Path
        fill="#e1e1e1"
        d="M128.2 298.9H79.6c-6.2 0-11.3-5.1-11.3-11.3v-48.5c0-6.2 5.1-11.3 11.3-11.3h48.6c6.2 0 11.3 5.1 11.3 11.3v48.5c0 6.2-5.1 11.3-11.3 11.3z"
      />
      <Defs>
        <Path
          id="b"
          d="M128.2 298.9H79.6c-6.2 0-11.3-5.1-11.3-11.3v-48.5c0-6.2 5.1-11.3 11.3-11.3h48.6c6.2 0 11.3 5.1 11.3 11.3v48.5c0 6.2-5.1 11.3-11.3 11.3z"
        />
      </Defs>
      <Use xlinkHref="#b" fill="#e1e1e1" />
      <ClipPath id="c">
        <Use xlinkHref="#b" />
      </ClipPath>
      <Path
        clipPath="url(#c)"
        fill="none"
        stroke="#B3B3B3"
        strokeWidth={3}
        strokeLinecap="round"
        strokeMiterlimit={10}
        d="M67.7 276.7h.4c1.2 0 2.3.5 3.1 1.4l1.6 1.8c1.5 1.7 4.1 1.9 5.9.4v0c1.6-1.3 3.9-1.4 5.4 0l4.5 3.8c1.7 1.4 4.1 1.3 5.7-.2l1.4-1.4c.9-.9 2.2-1.4 3.5-1.2l1 .1c1.5.2 3.1-.5 4-1.8l3-4.3c1.1-1.5 3-2.2 4.7-1.6l2.2.7c.8.3 1.7.3 2.5 0l3.5-1.1 2.6-.8c.8-.2 1.5-.7 2-1.3l4-4.8c.9-1.1 2.3-1.7 3.7-1.5l2.1.2c1.2.1 2.4-.3 3.3-1.1l4.1-3.8"
      />
      <Path
        fill="none"
        stroke="#B3B3B3"
        strokeWidth={4}
        strokeLinecap="round"
        strokeMiterlimit={10}
        d="M76.2 244.1L107.1 244.1"
      />
      <Path
        fill="none"
        stroke="#B3B3B3"
        strokeWidth={4}
        strokeLinecap="round"
        strokeMiterlimit={10}
        d="M76.2 252.7L92.3 252.7"
      />
      <Path
        fill="none"
        stroke="#B3B3B3"
        strokeWidth={6}
        strokeLinecap="round"
        strokeMiterlimit={10}
        d="M91.6 167.2L122.5 167.2"
      />
      <Path
        fill="none"
        stroke="#B3B3B3"
        strokeWidth={6}
        strokeLinecap="round"
        strokeMiterlimit={10}
        d="M91.6 179.8L107.8 179.8"
      />
      <Path
        fill="#d5d5d5"
        d="M215.3 203.5h-61.8c-3.9 0-7.1-3.2-7.1-7.1V153c0-3.9 3.2-7.1 7.1-7.1h61.8c3.9 0 7.1 3.2 7.1 7.1v43.4c0 3.9-3.2 7.1-7.1 7.1z"
      />
      <Circle
        fill="none"
        stroke="#BFBFBF"
        strokeWidth={3}
        strokeLinecap="round"
        strokeMiterlimit={10}
        cx={181.1}
        cy={248.2}
        r={10.2}
      />
      <Circle
        fill="none"
        stroke="#BFBFBF"
        strokeWidth={3}
        strokeLinecap="round"
        strokeMiterlimit={10}
        cx={181}
        cy={277.7}
        r={10.2}
      />
      <Circle
        fill="none"
        stroke="#BFBFBF"
        strokeWidth={3}
        strokeLinecap="round"
        strokeMiterlimit={10}
        cx={212.2}
        cy={277.7}
        r={10.2}
      />
      <Path
        fill="none"
        stroke="#BFBFBF"
        strokeWidth={3}
        strokeLinecap="round"
        strokeMiterlimit={10}
        d="M212.2 238c5.6 0 10.2 4.6 10.2 10.2s-4.6 10.2-10.2 10.2-10.2-4.6-10.2-10.2 4.6-10.2 10.2-10.2"
      />
      <Path
        fill="none"
        stroke="#8C8C8C"
        strokeWidth={3}
        strokeLinecap="round"
        strokeMiterlimit={10}
        d="M212.2 238c5.6 0 10.2 4.6 10.2 10.2 0 2.8-1.1 5.3-3 7.2M181.1 238c5.6 0 10.2 4.6 10.2 10.2s-4.6 10.2-10.2 10.2c-3.7 0-6.9-2-8.7-4.9M181 267.6c5.6 0 10.2 4.6 10.2 10.2 0 2.3-.8 4.5-2.1 6.2M212.2 267.6c5.6 0 10.2 4.6 10.2 10.2s-4.6 10.2-10.2 10.2c-2.8 0-5.4-1.1-7.2-3"
      />
    </Svg>
  );
}

export default SvgComponent;
