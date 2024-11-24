import { useEffect } from 'react';
import { View } from 'react-native'
import { Plus } from 'geist-native-icons';
import { useSprings } from '@react-spring/web';

import sharedStyles from './styles/shared';
import styles from '@/components/bill-cat-select/styles';
import { OnboardingScreenProps } from '@/types'
import { LogoIcon } from '@ledget/media/native';
import { Button, Box, Text, Icon, AnimatedView, InstitutionLogo } from '@ledget/native-ui';
import { Institution } from '@ledget/media/native';
import { useGetPlaidItemsQuery } from '@ledget/shared-features';
import { usePlaidLink } from '@hooks';

const DOT_LENGTH = 7

const Connect = (props: OnboardingScreenProps<'Connect'>) => {
  const { openLink } = usePlaidLink()
  const { data: plaidItems } = useGetPlaidItemsQuery()

  const [dots, api] = useSprings(DOT_LENGTH, (index) => ({ opacity: .2 }))

  useEffect(() => {
    for (let i = 0; i < DOT_LENGTH; i++) {
      const delay = i * 100
      setTimeout(() => {
        api.start((index) => {
          if (index !== i) return
          return ({
            to: async (next) => {
              await next({ opacity: .2 })
              await next({ opacity: 1 })
              await next({ opacity: .2 })
            },
            loop: true,
            config: { duration: 1500 }
          })
        })
      }, delay)
    }
  }, [])

  return (
    <Box variant='screen'>
      <View style={sharedStyles.mainContainer}>
        <Box padding='s' borderRadius='m' style={styles.linkGraphic}>
          <View style={styles.ledgetLogo}>
            <LogoIcon size={44} />
          </View>
          <View style={styles.dots}>
            {dots.map((props, index) => (
              <AnimatedView style={props}>
                <Box backgroundColor={index >= 4 ? 'mainText' : 'blueText'} style={styles.dot} />
              </AnimatedView>
            ))}
          </View>
          <Box borderRadius='circle' padding='s' backgroundColor='mediumGrayButton'>
            <Icon icon={Institution} size={30} color='mainText' strokeWidth={1.75} />
          </Box>
        </Box>
        <Box paddingHorizontal='xs' marginTop='xxl'>
          <Text fontSize={24} lineHeight={28} variant='geistSemiBold' marginVertical='m'>
            Connect
          </Text>
          <Text>
            Link your financial accounts to take advantage of all the app's features.
          </Text>
          <Text variant={'footer'} paddingTop='xs'>
            We use Plaid to connect to your financial institutions. All
            of your information is encrypted and secure.
          </Text>
        </Box>
        <Box variant='nestedContainer'>
          {plaidItems?.length !== 0 &&
            <View style={styles.logos}>
              {plaidItems?.map((item) => (
                <Box style={styles.logo} borderWidth={3} borderColor='nestedContainer' borderRadius='circle'>
                  <InstitutionLogo institution={item.institution?.id} size={32} />
                </Box>
              ))}
            </View>}
          <View style={styles.addAccountButtonContainer}>
            <Button
              icon={<Icon icon={Plus} size={16} strokeWidth={2} color='blueText' />}
              label='Add Account'
              onPress={openLink}
              labelPlacement='left'
              variant='rectangle'
              backgroundColor='transparent'
              textColor='blueText'
            />
          </View>
        </Box>
      </View>
      <Box paddingBottom='xxxxl' style={sharedStyles.bottomSplitButtons}>
        <Button
          label='Skip'
          textColor='mainText'
          variant='rectangle'
          onPress={() => props.navigation.navigate('AddCategories')}
        />
        <Button
          label='Done'
          textColor='blueText'
          variant='rectangle'
          onPress={() => props.navigation.navigate('AddCategories')}
        />
      </Box>
    </Box>
  )
}
export default Connect
