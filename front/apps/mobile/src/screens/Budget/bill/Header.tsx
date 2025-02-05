import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@shopify/restyle';

import styles from './styles/header';
import { Header, BillCatEmoji, Box, Text } from '@ledget/native-ui';
import { useAppearance } from '@/features/appearanceSlice';
import { Bill } from '@ledget/shared-features';

const EmojihHeader = ({ bill }: { bill: Bill }) => {
  const { mode } = useAppearance();
  const theme = useTheme();

  return (
    <Box style={styles.headerBox} marginTop="s">
      <View style={styles.header}>
        <View>
          <BillCatEmoji emoji={bill.emoji} period={bill.period} />
        </View>
        <Box>
          <Header>
            {bill.name.charAt(0).toUpperCase() + bill.name.slice(1)}
          </Header>
        </Box>
      </View>
      <BlurView
        intensity={100}
        style={[StyleSheet.absoluteFill, styles.blurView]}
        tint={mode === 'dark' ? 'dark' : 'light'}
      />
      <LinearGradient
        colors={[
          mode === 'dark' ? 'hsla(0, 0%, 0%, 0)' : 'hsla(0, 0%, 100%, 0)',
          theme.colors.mainBackground,
        ]}
        style={StyleSheet.absoluteFill}
      />
      <Text
        style={[styles.blurEmoji, { opacity: mode === 'dark' ? 0.7 : 0.5 }]}
      >
        {bill.emoji}
      </Text>
    </Box>
  );
};

export default EmojihHeader;
