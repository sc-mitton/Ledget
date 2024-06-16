import type { SvgProps as ReactNativeSvgProps } from 'react-native-svg';
import type { SVGProps } from 'react';

interface NativeSvgProps extends ReactNativeSvgProps {
  size?: number | string;
}

interface SvgProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export type { NativeSvgProps, SvgProps };
