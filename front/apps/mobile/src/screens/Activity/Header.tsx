import { View } from 'react-native';

import styles from './styles/header';
import { Seperator, Text, TabsTrack } from '@ledget/native-ui';
import { useAppSelector } from '@hooks';
import {
  useGetTransactionsCountQuery,
  selectBudgetMonthYear,
} from '@ledget/shared-features';
import { useAppearance } from '@/features/appearanceSlice';
import { useContext } from './context';

const Header = ({
  index,
  setIndex,
}: {
  index: number;
  setIndex: (index: number) => void;
}) => {
  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const { data } = useGetTransactionsCountQuery(
    { confirmed: false, month, year },
    { skip: !month || !year }
  );
  const { mode } = useAppearance();
  const { itemWithFocus } = useContext();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <TabsTrack onIndexChange={setIndex}>
          <TabsTrack.Tab index={0}>
            <View style={styles.countCountainer}>
              <View style={styles.countBackgroundOuterContainer}>
                <Text variant="bold" color={'secondaryText'}>
                  {data?.count}
                </Text>
              </View>
            </View>
            <Text color={index === 0 ? 'mainText' : 'secondaryText'}>New</Text>
          </TabsTrack.Tab>
          <TabsTrack.Tab index={1}>
            <Text color={index === 1 ? 'mainText' : 'secondaryText'}>
              History
            </Text>
          </TabsTrack.Tab>
        </TabsTrack>
      </View>
      <View style={[styles.seperator]}>
        <Seperator
          height={1.75}
          variant={'bare'}
          backgroundColor={
            itemWithFocus && mode === 'light'
              ? 'menuSeperator'
              : 'modalSeperator'
          }
        />
      </View>
    </View>
  );
};

export default Header;
