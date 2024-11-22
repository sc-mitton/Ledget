import { Image } from 'react-native';

import LogoIconGrayscaleDark from '../../../shared/brand-pngs/logoIconGrayscaleDark.png';
import LogoIconGrayscaleLight from '../../../shared/brand-pngs/logoIconGrayscaleLight.png';

const LogoIconGrayscale = ({ dark = false, size = 64 }) => {
    return dark ? (
        <Image
            style={{ width: size, height: size }}
            source={LogoIconGrayscaleDark}
            resizeMode='contain'
        />
    ) : (
        <Image
            style={{ width: size, height: size }}
            source={LogoIconGrayscaleLight}
            resizeMode='contain'
        />
    );
};

export default LogoIconGrayscale;
