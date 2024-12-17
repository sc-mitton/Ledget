import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native'
import Big from 'big.js';
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { useSprings } from '@react-spring/native'
import { Grid } from 'geist-native-icons';
import Animated, { useSharedValue, FadeOut, FadeIn } from 'react-native-reanimated';

import styles from './styles/panel';
import { DollarCents, Text, Box, Button, AnimatedView, Icon, CarouselDots } from '@ledget/native-ui';
import { useGetAccountsQuery, Account } from '@ledget/shared-features'
import { setAccountsTabCreditAccounts } from '@/features/uiSlice';
import { AccountsTabsScreenProps } from '@types'
import Transactions from '../TransactionsList/Transactions'
import { Card } from '@components'
import { CARD_WIDTH, CARD_HEIGHT } from '@components/card/constants'
import { DefaultHeader, AccountHeader } from '../Header';
import { useAppDispatch } from '@/hooks';
import CarouselItem from './Carouseltem';
import { useLoaded } from '@ledget/helpers';

export default function Panel(props: AccountsTabsScreenProps<'Credit'>) {
  const dispatch = useAppDispatch()
  const loaded = useLoaded(500)
  const [bottomOfContentPos, setBottomOfContentPos] = useState(0)
  const [accounts, setAccounts] = useState<Account[]>()
  const [account, setAccount] = useState<Account>()
  const [transactionsListExpanded, setTransactionsListExpanded] = useState(false)
  const [carouselIndex, setCarouselIndex] = useState(0)

  const ref = useRef<View>(null)
  const carouselIndexLock = useRef(false)
  const carouselRef = useRef<ICarouselInstance>(null)
  const progress = useSharedValue(0)

  const { data: accountsData } = useGetAccountsQuery()

  useEffect(() => {
    if (accountsData) {
      setAccounts(accountsData.accounts.filter(account => account.type === props.route.name.toLowerCase()))
    }
  }, [accountsData])

  useEffect(() => {
    if (props.route.params?.account && accounts) {
      carouselRef.current?.scrollTo({
        count: accounts?.findIndex(account => account.id === props.route.params.account?.id) || 0,
        animated: true
      })
    }
  }, [accounts, props.route.params])

  const [cardTransparencies, cardsApi] = useSprings(accounts?.length || 0, (i) => ({
    from: { opacity: 1 },
    to: { opacity: i === carouselIndex ? 1 : 0.25 },
    config: { duration: loaded ? 200 : 0 }
  }));

  useEffect(() => {
    cardsApi.start((i) => ({
      to: { opacity: i === carouselIndex ? 1 : 0.25 },
      config: { duration: loaded ? 200 : 0 }
    }))
  }, [carouselIndex])

  // Update account
  useEffect(() => {
    if (!account && accounts) {
      const acnt = props.route.params?.account || accounts[0]
      setAccount(acnt)
      dispatch(setAccountsTabCreditAccounts([acnt]))
    } else {
      const acnt = accounts?.[carouselIndex]
      setAccount(acnt)
      if (acnt) {
        dispatch(setAccountsTabCreditAccounts([acnt]))
      }
    }
  }, [props.route.params?.account, accounts, carouselIndex])

  useEffect(() => {
    if (props.route.params?.account) {
      setAccount(props.route.params.account)
    }
    if ((accounts?.length || 0) > 0 && !props.route.params?.account) {
      setAccount(accounts?.[carouselIndex])
    }
  }, [props.route.params?.account, accounts])

  useEffect(() => {
    if (transactionsListExpanded && account) {
      props.navigation.setOptions({
        header: () => <AccountHeader accountType='credit' />
      })
    } else {
      props.navigation.setOptions({
        header: () => <DefaultHeader routeName={props.route.name} />
      })
    }
  }, [transactionsListExpanded, account])

  return (
    <View style={styles.main}>
      <View
        ref={ref}
        style={styles.topContainer}
        onLayout={(event) => {
          setBottomOfContentPos(event.nativeEvent.layout.height + 32)
        }}
      >
        <View style={styles.totalBalanceContainer}>
          <View style={styles.totalBalance}>
            <DollarCents
              fontSize={22}
              variant='bold'
              value={accounts?.reduce((acc, account) =>
                Big(acc).plus(account.balances.current), Big(0)).times(100).toNumber() || 0}
            />
            <Text color='tertiaryText' fontSize={15} style={styles.totalBalanceText}>
              Total Card Balance
            </Text>
          </View>
          <Button
            backgroundColor='grayButton'
            variant='square'
            onPress={() => props.navigation.navigate(
              'Modals',
              {
                screen: 'PickerCard',
                params: { options: { title: 'Cards' }, currentAccount: account?.id }
              })
            }
          >
            <Icon icon={Grid} size={18} color='secondaryText' strokeWidth={1.75} />
          </Button>
        </View>
        {accounts
          ?
          <>
            <Animated.View style={styles.carouselContainer} entering={FadeIn}>
              <Carousel
                ref={carouselRef}
                vertical={false}
                snapEnabled={true}
                mode='parallax'
                data={accounts}
                renderItem={({ item, index }) => (
                  <AnimatedView
                    pointerEvents={index === carouselIndex ? 'auto' : 'none'}
                    style={[cardTransparencies[index]]}>
                    <CarouselItem
                      account={item}
                      onPress={() =>
                        props.navigation.navigate(
                          'AccountsTabs',
                          { screen: 'Credit', params: { account: item } })
                      }
                    />
                  </AnimatedView>
                )}
                width={CARD_WIDTH}
                onProgressChange={(p) => {
                  if (progress.value === 0) {
                    progress.value = p
                    return
                  }
                  if (carouselIndexLock.current) {
                    return
                  }
                  if (p - progress.value > 20) {
                    setCarouselIndex(carouselIndex - 1 >= 0 ? carouselIndex - 1 : accounts.length - 1)
                    carouselIndexLock.current = true
                    progress.value = p
                  } else if (p - progress.value < -20) {
                    setCarouselIndex(carouselIndex + 1 < accounts.length ? carouselIndex + 1 : 0)
                    carouselIndexLock.current = true
                    progress.value = p
                  }
                }}
                onScrollEnd={(index) => {
                  setTimeout(() => {
                    carouselIndexLock.current = false
                  }, 200)
                  setCarouselIndex(index)
                  progress.value = 0
                }}
                style={[{ height: CARD_HEIGHT * 1.3 }, styles.carousel]}
                modeConfig={{
                  parallaxAdjacentItemScale: 0.8,
                  parallaxScrollingScale: 1,
                  parallaxScrollingOffset: -10,
                }}
              />
            </Animated.View>
            <View style={styles.pageDots}>
              <Box backgroundColor='grayButton' style={styles.pageDotsBack}>
                <CarouselDots currentIndex={carouselIndex} length={accounts.length} />
              </Box>
            </View>
          </>
          :
          <>
            <Animated.View style={styles.skeletonCard} exiting={FadeOut}>
              <Card skeleton={true} />
            </Animated.View>
            <View style={styles.pageDots}>
              <Box backgroundColor='grayButton' style={styles.pageDotsBack}>
                <CarouselDots length={3} />
              </Box>
            </View>
          </>}
      </View>
      <Transactions
        collapsedTop={bottomOfContentPos}
        onStateChange={(state) => { setTransactionsListExpanded(state === 'expanded' ? true : false) }}
        expandedTop={24}
        account={account}
        {...props}
      />
    </View>
  )
}
