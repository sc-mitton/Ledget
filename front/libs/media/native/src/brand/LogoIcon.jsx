import { Image } from 'react-native';
import logoicon from '../../../shared/brand-pngs/logoicon.png'

export const LogoIcon = () => {
  return <Image
    source={logoicon}
    style={{ width: 32, height: 32 }} />
}
