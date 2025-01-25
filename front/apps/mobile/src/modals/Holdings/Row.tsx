import { useState, useEffect, useRef } from 'react';
import { TouchableHighlight, View } from 'react-native';
import { Pin } from 'geist-native-icons';
import Swipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import Big from 'big.js';
import { useTheme } from '@shopify/restyle';

import styles from './styles/row';
import { useAppDispatch, useAppSelector } from '@/hooks';
import {
  InstitutionLogo,
  Text,
  Box,
  DollarCents,
  Icon,
  Seperator,
  TrendNumber,
} from '@ledget/native-ui';
import {
  selectTrackedHoldings,
  Holding,
  usePinHoldingMutation,
  useUnPinHoldingMutation,
  pinHolding,
  unPinHolding,
  selectPinnedHoldings,
} from '@ledget/shared-features';

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

  const [isPinned, setIsPinned] = useState(false);
  const ref = useRef<SwipeableMethods>(null);
  const [pinHoldingMutate] = usePinHoldingMutation();
  const [unPinHoldingMutate] = useUnPinHoldingMutation();
  const dispatch = useAppDispatch();

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
    setIsPinned(
      pinnedHoldings?.some(
        (p) => p.security_id === holding.security_id || ''
      ) || false
    );
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
                  if (isPinned) {
                    pinHoldingMutate(holding.security_id || '');
                    dispatch(pinHolding(holding.security_id || ''));
                  } else {
                    unPinHoldingMutate(holding.security_id || '');
                    dispatch(unPinHolding(holding.security_id || ''));
                  }
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
                    unPinHolding(holding.security_id || '');
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
                    borderRadius="xs"
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
              {percentChange === undefined ? (
                <Text color="tertiaryText" fontSize={14}>
                  &mdash;
                </Text>
              ) : (
                <TrendNumber value={percentChange} suffix="%" fontSize={14} />
              )}
            </View>
          </Box>
        </Box>
      </Swipeable>
    </>
  );
};

export default Row;
