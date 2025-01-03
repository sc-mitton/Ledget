import { View, Dimensions, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Canvas, Rect, LinearGradient, vec } from '@shopify/react-native-skia';
import { useTheme } from '@shopify/restyle';
import { Bell } from 'geist-native-icons';

import styles from './styles/header';
import {
  Header,
  BillCatEmoji,
  Box,
  Text,
  Seperator,
  DollarCents,
  Icon,
  Button,
} from '@ledget/native-ui';
import { useAppearance } from '@/features/appearanceSlice';
import { Category } from '@ledget/shared-features';

const EmojiHeader = ({ category }: { category: Category }) => {
  const { mode } = useAppearance();
  const theme = useTheme();

  return (
    <Box style={styles.headerBox}>
      <View style={styles.header}>
        <View>
          <BillCatEmoji emoji={category.emoji} period={category.period} />
        </View>
        <View>
          <Header>
            {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
          </Header>
          <View style={styles.spendingData}>
            <DollarCents
              withCents={false}
              color="secondaryText"
              value={category.amount_spent || 0}
            />
            <Text color="secondaryText">spent of</Text>
            <DollarCents
              withCents={false}
              color="secondaryText"
              value={category.limit_amount}
            />
          </View>
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
        {category.emoji}
      </Text>
    </Box>
  );
};

export default EmojiHeader;
