import { useState, useEffect, useRef } from 'react';
import { TouchableHighlight, View } from 'react-native';
import {
  Pin,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
} from 'geist-native-icons';
import Swipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import Big from 'big.js';
import { useTheme } from '@shopify/restyle';

import styles from './styles/row';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  selectPinnedHoldings,
  pinHolding,
  unPinHolding,
} from '@/features/uiSlice';
import {
  InstitutionLogo,
  Text,
  Box,
  DollarCents,
  Icon,
  Seperator,
} from '@ledget/native-ui';
import { selectTrackedHoldings, Holding } from '@ledget/shared-features';

const Row = ({
  holding,
  account,
  index,
}: {
  holding: Holding;
  account: string;
  index: number;
}) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const [isPinned, setIsPinned] = useState(false);
  const ref = useRef<SwipeableMethods>(null);

  const trackedHoldings = useAppSelector(selectTrackedHoldings);
  const pinnedHoldings = useAppSelector(selectPinnedHoldings);
  const [percentChange, setPercentChange] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    let previous_institution_value,
      current_institution_value: number | undefined = undefined;

    if (
      holding.security_id &&
      trackedHoldings[holding.security_id].length > 1
    ) {
      previous_institution_value =
        trackedHoldings[holding.security_id][
          trackedHoldings[holding.security_id].length - 1
        ].institution_value;
      current_institution_value =
        trackedHoldings[holding.security_id][
          trackedHoldings[holding.security_id].length - 1
        ].institution_value;
      setPercentChange(
        Big(current_institution_value)
          .minus(previous_institution_value)
          .div(previous_institution_value)
          .times(100)
          .toNumber()
      );
    }
  }, []);

  useEffect(() => {
    setIsPinned(pinnedHoldings?.includes(holding.security_id || '') || false);
  }, [pinnedHoldings]);

  return (
    <>
      <Swipeable
        ref={ref}
        friction={2}
        rightThreshold={-10000}
        renderRightActions={() => null}
        renderLeftActions={() => (
          <Box
            borderTopRightRadius="xs"
            borderBottomRightRadius="xs"
            backgroundColor="modalSeperator"
            style={styles.leftActions}
          >
            <TouchableHighlight
              activeOpacity={0.9}
              style={styles.pinButton}
              underlayColor={theme.colors.mainText}
              onPress={() => {
                setTimeout(() => {
                  isPinned
                    ? dispatch(unPinHolding(holding.security_id || ''))
                    : dispatch(pinHolding(holding.security_id || ''));
                }, 500);
                ref.current?.close();
              }}
            >
              <Box
                borderColor="menuSeperator"
                backgroundColor={isPinned ? 'menuSeperator' : 'modalSeperator'}
                borderWidth={1}
                borderRadius="circle"
                padding="xs"
              >
                <Icon
                  icon={Pin}
                  size={18}
                  rotate={45}
                  borderColor="secondaryText"
                />
              </Box>
            </TouchableHighlight>
          </Box>
        )}
      >
        {index !== 0 && (
          <Box paddingHorizontal="pagePadding" style={styles.seperator}>
            <Seperator backgroundColor="modalSeperator" variant="bare" />
          </Box>
        )}
        <Box backgroundColor="modalBox100">
          <Box
            backgroundColor="modalBox100"
            borderRadius="l"
            style={styles.row}
          >
            {isPinned && (
              <View style={styles.pinBox}>
                <TouchableHighlight
                  style={styles.pinButton}
                  underlayColor={theme.colors.mainText}
                  onPress={() => {
                    dispatch(unPinHolding(holding.security_id || ''));
                    ref.current?.close();
                  }}
                >
                  <Box
                    backgroundColor="modalBox100"
                    borderRadius="circle"
                    padding="xs"
                  >
                    <Icon icon={Pin} borderColor="secondaryText" size={16} />
                  </Box>
                </TouchableHighlight>
              </View>
            )}
            <View>
              <InstitutionLogo account={account} />
            </View>
            <View style={styles.nameContainer}>
              <Text>
                <Text lineHeight={28}>{holding.security.name}</Text>
                &nbsp;&nbsp;&nbsp;
                {holding.security.ticker_symbol && (
                  <Box
                    style={styles.tickerSymbol}
                    backgroundColor="modalSeperator"
                    borderRadius="circle"
                    paddingHorizontal="s"
                    marginLeft="s"
                  >
                    <Text color="tertiaryText">
                      {holding.security.ticker_symbol?.toUpperCase()}
                    </Text>
                  </Box>
                )}
              </Text>
            </View>
            <View style={styles.amountContainer}>
              {holding.institution_value ? (
                <DollarCents
                  value={Big(holding.institution_value).times(100).toNumber()}
                />
              ) : (
                <Text>—</Text>
              )}
              <View style={styles.holdingTrend}>
                <Text
                  fontSize={14}
                  color={
                    percentChange !== undefined
                      ? percentChange < 0
                        ? 'redText'
                        : 'greenText'
                      : 'tertiaryText'
                  }
                >
                  {percentChange !== undefined ? `${percentChange}%` : '—'}
                </Text>
                {percentChange !== undefined ? (
                  <Icon
                    icon={
                      percentChange === 0
                        ? ArrowRight
                        : percentChange < 0
                        ? ArrowDownRight
                        : ArrowUpRight
                    }
                    size={13}
                    color={percentChange < 0 ? 'redText' : 'greenText'}
                    strokeWidth={2}
                  />
                ) : null}
              </View>
            </View>
          </Box>
        </Box>
      </Swipeable>
    </>
  );
};

export default Row;
