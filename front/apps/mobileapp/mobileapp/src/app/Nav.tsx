import { Home, DollarSign, Activity, User, Star } from 'geist-icons-native';
import { BlurView } from 'expo-blur';
import { View } from 'react-native';
import { useTheme } from '@shopify/restyle';

import { Box, Icon } from '@components';
import { Institution } from '@ledget/media/native';
import { styles } from './Styles';
import { useAppearance } from '@/theme';

export default function Nav() {
  const { mode } = useAppearance();
  const theme = useTheme();

  console.log('theme.colors.navBackground', theme.colors.navBackground)

  return (
    <>
      <BlurView
        intensity={mode === 'dark' ? 40 : 20}
        tint={mode === 'dark' ? 'dark' : 'light'}
        style={styles.navBlurView}
      >
        <View style={{ ...styles.navBack, backgroundColor: theme.colors.navBackground }} />
        <Box
          style={styles.nav}
          shadowColor='navShadow'
          shadowOffset={{ width: 0, height: -5 }}
          shadowRadius={20}
          shadowOpacity={.95}
          backgroundColor={'transparent'}
        >
          <Icon icon={Home} />
          <Icon icon={DollarSign} />
          <Icon icon={Activity} />
          <Icon icon={Institution} />
          <Icon icon={User} />
        </Box>
      </BlurView>
    </>
  );
}

