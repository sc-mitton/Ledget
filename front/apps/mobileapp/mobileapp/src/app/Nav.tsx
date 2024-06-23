import { StyleSheet } from 'react-native';
import { Home, DollarSign, Activity, User } from 'geist-icons-native';
import { useTheme } from '@shopify/restyle';

import { Box } from '@components';
import { Institution } from '@ledget/media/native';

export default function Nav() {
  const theme = useTheme();

  return (
    <Box
      style={styles.nav}
      backgroundColor='navBackground'
      shadowColor='navShadow'
      shadowOffset={{ width: 0, height: -5 }}
      shadowRadius={20}
      shadowOpacity={.95}
    >
      <Home stroke={theme.colors.text} size={20} />
      <DollarSign stroke={theme.colors.text} size={20} />
      <Activity stroke={theme.colors.text} size={20} />
      <Institution stroke={theme.colors.text} size={20} />
      <User stroke={theme.colors.text} size={20} />
    </Box>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: 'absolute',
    justifyContent: 'space-between',
    flexDirection: 'row',
    bottom: 0,
    paddingLeft: 32,
    paddingRight: 32,
    paddingTop: 30,
    paddingBottom: 40,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});
