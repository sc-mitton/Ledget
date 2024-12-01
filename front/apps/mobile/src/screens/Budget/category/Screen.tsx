import { useEffect, useState } from 'react'
import { Big } from 'big.js'
import dayjs from 'dayjs'
import { View } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { Clock, Bell } from 'geist-native-icons'

import styles from './styles/screen'
import { BudgetScreenProps } from '@types'
import { useGetCategorySpendingHistoryQuery } from '@ledget/shared-features'
import { Box, TabsTrack, Icon, Text } from '@ledget/native-ui'

import EmojiHeader from './Header'
import Menu from './Menu'
import Chart from './Chart'
import HistoryBox from './HistoryBox'
import AlertsBox from './AlertsBox'



const Category = (props: BudgetScreenProps<'Category'>) => {
  const [tabIndex, setTabIndex] = useState(0);

  const { data: fetchedSpendingData } = useGetCategorySpendingHistoryQuery({
    categoryId: props.route.params.category.id,
  })

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => <Menu {...props} />,
    })
  }, [])

  return (
    <Box variant='nestedScreen' paddingHorizontal='none'>
      <EmojiHeader category={props.route.params.category} />
      <Chart
        data={
          fetchedSpendingData?.map((item) => ({
            date: dayjs(`${item.year}-${item.month}-01`).format('MM-DD-YYYY'),
            amount_spent: Big(item.amount_spent).toNumber()
          }))
        }
        notEnoughData={(fetchedSpendingData?.length || 0) < 3}
        category={props.route.params.category}
      />
      <Box style={styles.boxesContainer} marginBottom='navHeight' paddingHorizontal='pagePadding'>
        <View style={styles.tabButtons}>
          <TabsTrack
            containerStyle={styles.tabsTrack}
            onIndexChange={(index) => setTabIndex(index)}
          >
            <TabsTrack.Tab index={0}>
              {({ selected }) => (
                <View style={styles.tabButton}>
                  <Icon size={16} icon={Clock} color={selected ? 'mainText' : 'secondaryText'} />
                  <Text color={selected ? 'mainText' : 'secondaryText'}>
                    History
                  </Text>
                </View>
              )}
            </TabsTrack.Tab>
            <TabsTrack.Tab index={1}>
              {({ selected }) => (
                <View style={styles.tabButton}>
                  <Icon size={16} icon={Bell} color={selected ? 'mainText' : 'secondaryText'} />
                  <Text color={selected ? 'mainText' : 'secondaryText'}>
                    Alerts
                  </Text>
                </View>
              )}
            </TabsTrack.Tab>
          </TabsTrack>
        </View>
        {tabIndex === 0
          ?
          <Animated.View
            entering={FadeIn.duration(200).delay(200)}
            exiting={FadeOut.duration(200)}
            style={styles.tabPanel}
          >
            <HistoryBox {...props} />
          </Animated.View>
          :
          <Animated.View
            entering={FadeIn.duration(200).delay(200)}
            exiting={FadeOut.duration(200)}
            style={styles.tabPanel}
          >
            <AlertsBox category={props.route.params.category} />
          </Animated.View>
        }
      </Box>
    </Box>
  )
}
export default Category
