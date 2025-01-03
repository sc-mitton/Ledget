import { View, Dimensions, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Canvas, Rect, LinearGradient, vec } from '@shopify/react-native-skia';
import { useTheme } from '@shopify/restyle';

import styles from './styles/header';
import { Header, BillCatEmoji, Box, Text } from '@ledget/native-ui';
import { useAppearance } from '@/features/appearanceSlice';
import { Bill } from '@ledget/shared-features';

const EmojihHeader = ({ bill }: { bill: Bill }) => {
  const { mode } = useAppearance();
  const theme = useTheme();

  return (
    <Box style={styles.headerBox}>
      <View style={styles.header}>
        <View>
          <BillCatEmoji emoji={bill.emoji} period={bill.period} />
        </View>
        <View>
          <Header>
            {bill.name.charAt(0).toUpperCase() + bill.name.slice(1)}
          </Header>
        </View>
      </View>
      <BlurView
        intensity={100}
        style={[StyleSheet.absoluteFill, styles.blurView]}
        tint={mode === 'dark' ? 'dark' : 'light'}
      />
      <Canvas style={StyleSheet.absoluteFill}>
        <Rect x={0} y={0} width={Dimensions.get('window').width} height={125}>
          <LinearGradient
            colors={[
              mode === 'dark' ? 'hsla(0, 0%, 0%, 0)' : 'hsla(0, 0%, 100%, 0)',
              theme.colors.mainBackground,
            ]}
            start={vec(0, 0)}
            end={vec(0, 125)}
          />
        </Rect>
      </Canvas>
      <Text
        style={[styles.blurEmoji, { opacity: mode === 'dark' ? 0.7 : 0.5 }]}
      >
        {bill.emoji}
      </Text>
    </Box>
  );
};

export default EmojihHeader;
