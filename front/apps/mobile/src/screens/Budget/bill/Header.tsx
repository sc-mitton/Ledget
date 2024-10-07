import { View, Dimensions, StyleSheet } from 'react-native'
import { BlurView } from 'expo-blur';
import {
  Canvas,
  Rect,
  LinearGradient,
  vec
} from '@shopify/react-native-skia';
import { useTheme } from '@shopify/restyle';

import styles from './styles/header';
import { Header, BillCatEmoji, Box, Text, Seperator } from '@ledget/native-ui';
import { useAppearance } from '@/features/appearanceSlice';
import { Bill } from '@ledget/shared-features';

const EmojihHeader = ({ bill }: { bill: Bill }) => {
  const { mode } = useAppearance()
  const theme = useTheme()

  return (
    <>
      <Box style={styles.headerBox}>
        <View style={styles.header}>
          <View>
            <BillCatEmoji
              emoji={bill.emoji}
              period={bill.period}
            />
          </View>
          <Header>
            {bill.name.charAt(0).toUpperCase() + bill.name.slice(1)}
          </Header>
        </View>
        <BlurView
          intensity={100}
          style={[StyleSheet.absoluteFill, styles.blurView]}
          tint={mode === 'dark' ? 'dark' : 'light'}
        />
        <Canvas style={StyleSheet.absoluteFill}>
          <Rect x={0} y={0} width={Dimensions.get('window').width} height={150}>
            <LinearGradient
              colors={[
                mode === 'dark' ? 'hsla(0, 0%, 0%, 0)' : 'hsla(0, 0%, 100%, 0)',
                theme.colors.nestedContainer
              ]}
              start={vec(0, 0)}
              end={vec(0, 150)}
            />
          </Rect>
        </Canvas>
        <Text style={styles.blurEmoji}>{bill.emoji}</Text>
        <View style={styles.seperator}>
          <Seperator backgroundColor='mainScreenSeperator' variant='bare' height={2} />
        </View>
      </Box>
    </>
  )
}

export default EmojihHeader
