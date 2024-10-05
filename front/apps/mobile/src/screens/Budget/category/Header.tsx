
import { View, Dimensions } from 'react-native'
import { Canvas, Rect, LinearGradient, vec } from '@shopify/react-native-skia'
import { BlurView } from 'expo-blur'
import { useTheme } from '@shopify/restyle'

import styles from './styles/header'
import { BillCatEmoji, Box, DollarCents, Header, Text } from '@ledget/native-ui'
import { useAppearance } from '@/features/appearanceSlice'
import { Category } from "@ledget/shared-features"


const EmojiHeader = ({ category }: { category: Category }) => {
  const { mode } = useAppearance()
  const theme = useTheme();

  return (
    <>
      <Box style={styles.header}>
        <View>
          <BillCatEmoji
            emoji={category.emoji}
            period={category.period}
          />
        </View>
        <View>
          <Text variant='bold' fontSize={24} lineHeight={28}>
            {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
          </Text>
          <View style={styles.spendingData}>
            <DollarCents withCents={false} color='secondaryText' value={category.amount_spent} />
            <Text color='secondaryText' >spent of</Text>
            <DollarCents withCents={false} color='secondaryText' value={category.limit_amount} />
          </View>
        </View>
      </Box>
      <BlurView
        intensity={100}
        style={[styles.blurView, { borderBottomColor: theme.colors.menuSeperator }]}
        tint={mode === 'dark' ? 'dark' : 'light'}
      />
      <Canvas style={styles.canvas}>
        <Rect x={0} y={0} width={Dimensions.get('window').width} height={150}>
          <LinearGradient
            colors={[
              mode === 'dark' ? 'hsla(0, 0%, 0%, 0)' : 'hsla(0, 0%, 100%, 0)',
              theme.colors.mainBackground
            ]}
            start={vec(0, 0)}
            end={vec(0, 150)}
          />
        </Rect>
      </Canvas>
      <Text style={[
        styles.blurEmoji,
        { opacity: mode === 'dark' ? .9 : .7 }
      ]}>
        {category.emoji}
      </Text>
    </>
  )
}

export default EmojiHeader;
