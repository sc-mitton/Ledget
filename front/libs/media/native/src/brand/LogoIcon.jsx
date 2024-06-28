import { Image } from 'react-native';
import logoicon from '../../../shared/brand-pngs/logoicon.png'

export const LogoIcon = ({ size = 32 }) => {
  return <Image
    source={logoicon}
    style={{ width: size, height: size }} />
}
