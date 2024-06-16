import type { SvgProps as ReactNativeSvgProps } from 'react-native-svg';
import type { SVGProps } from 'react';

interface NativeSvgProps extends ReactNativeSvgProps {
  size: number;
}

interface SvgProps extends SVGProps<SVGSVGElement> {
  size: number;
}

export type { NativeSvgProps, SvgProps };
