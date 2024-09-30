import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native'
import Big from 'big.js';
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { useSprings } from '@react-spring/native';
import { Grid } from 'geist-native-icons';
import { useSharedValue } from 'react-native-reanimated';

import styles from './styles/panel';
import { DollarCents, Text, Box, Button, AnimatedView, Icon, CarouselDots } from '@ledget/native-ui';
import { useGetAccountsQuery, Account } from '@ledget/shared-features'
import { AccountsTabsScreenProps } from '@types'
import Transactions from '../TransactionsList/Transactions'
import { Card } from '@components'
import { CARD_WIDTH, CARD_HEIGHT } from '@components/card/constants'
import { DefaultHeader, AccountHeader } from '../Header';
import CarouselItem from './Carouseltem';

export default function Panel(props: AccountsTabsScreenProps<'Credit'>) {
  const [bottomOfContentPos, setBottomOfContentPos] = useState(0)
  const [accounts, setAccounts] = useState<Account[]>()
  const [account, setAccount] = useState<Account>()
  const [transactionsListExpanded, setTransactionsListExpanded] = useState(false)

  const ref = useRef<View>(null)
  const progress = useSharedValue<number>(0);
  const carouselRef = useRef<ICarouselInstance>(null)
  const [carouselIndex, setCarouselIndex] = useState(0)

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
    to: { opacity: i === carouselIndex ? 1 : 0.65 },
    config: { duration: 200 }
  }));

  useEffect(() => {
    cardsApi.start((i) => ({
      to: { opacity: i === carouselIndex ? 1 : 0.65 },
      config: { duration: 200 }
    }))
  }, [carouselIndex])

  // Update account
  useEffect(() => {
    if (!account && accounts) {
      setAccount(props.route.params?.account || accounts[0])
    } else {
      setAccount(accounts?.[carouselIndex])
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
        header: () => <AccountHeader account={account} />
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
          setBottomOfContentPos(event.nativeEvent.layout.height + 28)
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
            <Text color='secondaryText' fontSize={15} style={styles.totalBalanceText}>
              total card balance
            </Text>
          </View>
          <Button
            onPress={() => props.navigation.navigate(
              'Modals',
              {
                screen: 'PickerCard',
                params: { options: { title: 'Cards' }, currentAccount: account?.id }
              })
            }
          >
            <Icon icon={Grid} strokeWidth={1.6} size={25} color='tertiaryText' />
          </Button>
        </View>
        {accounts
          ?
          <>
            <View style={styles.carouselContainer}>
              <Carousel
                ref={carouselRef}
                vertical={false}
                snapEnabled={true}
                mode='parallax'
                data={accounts}
                renderItem={({ item, index }) => (
                  <AnimatedView style={[cardTransparencies[index]]}>
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
                onSnapToItem={(index) => { setCarouselIndex(index) }}
                style={[{ height: CARD_HEIGHT * 1.3 }, styles.carousel]}
                modeConfig={{
                  parallaxAdjacentItemScale: 0.8,
                  parallaxScrollingScale: 1,
                  parallaxScrollingOffset: 0,
                }}
              />
            </View>
            <View style={styles.pageDots}>
              <CarouselDots currentIndex={carouselIndex} length={accounts.length} />
            </View>
          </>
          :
          <View style={styles.skeletonCard}><Card skeleton={true} /></View>}
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
