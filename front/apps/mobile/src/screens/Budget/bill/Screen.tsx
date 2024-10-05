import { useEffect } from 'react';
import { View, Dimensions } from 'react-native'
import { BlurView } from 'expo-blur';
import {
  Canvas,
  Rect,
  LinearGradient,
  vec
} from '@shopify/react-native-skia';
import { useTheme } from '@shopify/restyle';

import styles from './styles/screen';
import Menu from './Menu';
import RemindersBox from './RemindersBox';
import DetailsBox from './DetailsBox';
import HistoryBox from './HistoryBox';
import { BudgetScreenProps } from '@types'
import { Header, BillCatEmoji, Box, Text } from '@ledget/native-ui';
import { useAppearance } from '@/features/appearanceSlice';

const Bill = (props: BudgetScreenProps<'Bill'>) => {
  const { mode } = useAppearance()
  const theme = useTheme()

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => <Menu {...props} />
    })
  }, [])

  return (
    <Box variant='nestedScreen'>
      <Box style={styles.header}>
        <View>
          <BillCatEmoji
            emoji={props.route.params.bill.emoji}
            period={props.route.params.bill.period}
          />
        </View>
        <Header>
          {props.route.params.bill.name.charAt(0).toUpperCase() + props.route.params.bill.name.slice(1)}
        </Header>
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
      <Text style={styles.blurEmoji}>{props.route.params.bill.emoji}</Text>
      <DetailsBox bill={props.route.params.bill} />
      <RemindersBox bill={props.route.params.bill} />
      <HistoryBox bill={props.route.params.bill} />
    </Box>
  )
}
export default Bill
