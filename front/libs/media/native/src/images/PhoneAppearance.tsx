import { Image, View } from 'react-native';

// Light Device
import LightDeviceDefaultDynamicIsland from '../../../shared/images/light-device-default-dynamic-island.png';
import LightDeviceDefaultDynamicIslandDark from '../../../shared/images/light-device-dark-dynamic-island.png';
import LightDeviceDefaultDynamicIslandLight from '../../../shared/images/light-device-light-dynamic-island.png';

import LightDeviceDefaultNotch from '../../../shared/images/light-device-default-notch.png';
import LightDeviceDefaultNotchDark from '../../../shared/images/light-device-dark-notch.png';
import LightDeviceDefaultNotchLight from '../../../shared/images/light-device-light-notch.png';

import LightDeviceDefault from '../../../shared/images/light-device-default.png';
import LightDeviceDefaultDark from '../../../shared/images/light-device-dark.png';
import LightDeviceDefaultLight from '../../../shared/images/light-device-light.png';

// Dark Device
import DarkDeviceDefaultDynamicIsland from '../../../shared/images/dark-device-default-dynamic-island.png';
import DarkDeviceDefaultDynamicIslandDark from '../../../shared/images/dark-device-dark-dynamic-island.png';
import DarkDeviceDefaultDynamicIslandLight from '../../../shared/images/dark-device-light-dynamic-island.png';

import DarkDeviceDefaultNotch from '../../../shared/images/dark-device-default-notch.png';
import DarkDeviceDefaultNotchDark from '../../../shared/images/dark-device-dark-notch.png';
import DarkDeviceDefaultNotchLight from '../../../shared/images/dark-device-light-notch.png';

import DarkDeviceDefault from '../../../shared/images/dark-device-default.png';
import DarkDeviceDefaultDark from '../../../shared/images/dark-device-dark.png';
import DarkDeviceDefaultLight from '../../../shared/images/dark-device-light.png';


interface TProps {
  appearance: 'dynamic' | 'notch' | 'punch-hole'
  imageMode: 'dark' | 'light' | 'default'
  mode: 'dark' | 'light'
  size?: number
}

const imageProps = {
  resizeMode: 'contain',
  style: {
    height: 70,
    width: 40,
  }
} as const

export const PhoneAppearance = (props: TProps) => (
  <>
    {(props.appearance === 'dynamic' && props.mode === 'light') && (
      <>
        {props.imageMode === 'dark' && <Image {...imageProps} source={LightDeviceDefaultDynamicIslandDark} />}
        {props.imageMode === 'light' && <Image {...imageProps} source={LightDeviceDefaultDynamicIslandLight} />}
        {props.imageMode === 'default' && <Image {...imageProps} source={LightDeviceDefaultDynamicIsland} />}
      </>
    )}
    {(props.appearance === 'notch' && props.mode === 'light') && (
      <>
        {props.imageMode === 'dark' && <Image {...imageProps} source={LightDeviceDefaultNotchDark} />}
        {props.imageMode === 'light' && <Image {...imageProps} source={LightDeviceDefaultNotchLight} />}
        {props.imageMode === 'default' && <Image {...imageProps} source={LightDeviceDefaultNotch} />}
      </>
    )}
    {(props.appearance === 'punch-hole' && props.mode === 'light') && (
      <>
        {props.imageMode === 'dark' && <Image {...imageProps} source={LightDeviceDefaultDark} />}
        {props.imageMode === 'light' && <Image {...imageProps} source={LightDeviceDefaultLight} />}
        {props.imageMode === 'default' && <Image {...imageProps} source={LightDeviceDefault} />}
      </>
    )}
    {(props.appearance === 'dynamic' && props.mode === 'dark') && (
      <>
        {props.imageMode === 'dark' && <Image {...imageProps} source={DarkDeviceDefaultDynamicIslandDark} />}
        {props.imageMode === 'light' && <Image {...imageProps} source={DarkDeviceDefaultDynamicIslandLight} />}
        {props.imageMode === 'default' && <Image {...imageProps} source={DarkDeviceDefaultDynamicIsland} />}
      </>
    )}
    {(props.appearance === 'notch' && props.mode === 'dark') && (
      <>
        {props.imageMode === 'dark' && <Image {...imageProps} source={DarkDeviceDefaultNotchDark} />}
        {props.imageMode === 'light' && <Image {...imageProps} source={DarkDeviceDefaultNotchLight} />}
        {props.imageMode === 'default' && <Image {...imageProps} source={DarkDeviceDefaultNotch} />}
      </>
    )}
    {(props.appearance === 'punch-hole' && props.mode === 'dark') && (
      <>
        {props.imageMode === 'dark' && <Image {...imageProps} source={DarkDeviceDefaultDark} />}
        {props.imageMode === 'light' && <Image {...imageProps} source={DarkDeviceDefaultLight} />}
        {props.imageMode === 'default' && <Image {...imageProps} source={DarkDeviceDefault} />}
      </>
    )}
  </>
)

export default PhoneAppearance;
