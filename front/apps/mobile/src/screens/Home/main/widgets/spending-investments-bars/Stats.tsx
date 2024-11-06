import { useState, useEffect, useMemo } from "react";
import { View } from "react-native";
import { SlotText } from "react-native-slot-text";
import Big from "big.js";
import { useTheme } from "@shopify/restyle";

import styles from './styles/filled';
import rectangleStyles from './styles/rectangleStyles';
import sharedStyles from "./styles/sharedStyles";
import { Box, Text } from "@ledget/native-ui";
import { useGetBreakdownHistoryQuery } from "@ledget/shared-features";


export const HorizontalStats = ({ index }: { index: number }) => {
  const { data } = useGetBreakdownHistoryQuery();
  const theme = useTheme();
  const [saved, setSaved] = useState(`${0}`);
  const [negativeSaved, setNegativeSaved] = useState(false);
  const [invested, setInvested] = useState(`${0}`);

  useEffect(() => {
    if (data) {
      const { spending, investment_transfer_out, income } = data[index]
      setNegativeSaved(Big(income).minus(spending).minus(investment_transfer_out).lt(0));
      setSaved(Big(income).minus(spending).minus(investment_transfer_out).abs().toFixed(0));
      setInvested(`${investment_transfer_out}`);
    }
  }, [data, index]);

  return (
    <>
      <View style={sharedStyles.topRow}>
        <View>
          <View style={sharedStyles.topRowHeader}>
            <Box
              style={sharedStyles.dot}
              backgroundColor={negativeSaved ? 'redText' : 'greenText'}
            />
            <Text fontSize={13} lineHeight={24} color='tertiaryText'>Saved</Text>
          </View>
          <View style={sharedStyles.currencyContainer}>
            <SlotText
              value={saved as `${number}`}
              fontStyle={[
                { color: theme.colors.mainText },
                styles.fontStyle
              ]}
              animationDuration={200}
              prefix={negativeSaved ? '-$' : '$'}
              includeComma={true}
            />
          </View>
        </View>
        <View>
          <View style={sharedStyles.topRowHeader}>
            <Box backgroundColor='purpleText' style={sharedStyles.dot} />
            <Text fontSize={13} lineHeight={24} color='tertiaryText'>Invested</Text>
          </View>
          <View style={sharedStyles.currencyContainer}>
            <SlotText
              value={invested as `${number}`}
              fontStyle={[
                { color: theme.colors.mainText },
                styles.fontStyle
              ]}
              animationDuration={200}
              prefix={'$'}
              includeComma={true}
            />
          </View>
        </View>
      </View>
    </>
  )
}

export const VerticalStats = ({ index }: { index: number }) => {
  const theme = useTheme();
  const { data } = useGetBreakdownHistoryQuery();
  const [saved, setSaved] = useState(`${0}`);
  const [negativeSaved, setNegativeSaved] = useState(false);
  const [invested, setInvested] = useState(`${0}`);
  const [income, setIncome] = useState(`${0}`);

  useEffect(() => {
    if (data) {
      const { spending, investment_transfer_out, income } = data[index]
      setNegativeSaved(Big(income).minus(spending).minus(investment_transfer_out).lt(0));
      setSaved(Big(income).minus(spending).minus(investment_transfer_out).abs().toFixed(0));
      setInvested(`${investment_transfer_out}`);
      setIncome(`${income}`);
    }
  }, [data, index]);

  return (
    <Box
      backgroundColor={'nestedContainerSeperator'}
      borderRadius='l'
      paddingHorizontal={'l'}
      paddingVertical={'s'}
      style={styles.rectangleLeftSide}
    >
      <View style={rectangleStyles.statsTopRow}>
        <View style={sharedStyles.topRowHeader}>
          <Box style={sharedStyles.dot} backgroundColor={'quinaryText'} />
          <Text color='tertiaryText' fontSize={15}>Income</Text>
        </View>
        <SlotText
          value={income as `${number}`}
          fontStyle={[
            { color: theme.colors.mainText },
            styles.largeFontStyle
          ]}
          animationDuration={200}
          prefix={'$'}
          includeComma={true}
        />
      </View>
      <View style={rectangleStyles.statsBottomRow}>
        <View style={rectangleStyles.bottomRowCell}>
          <View style={sharedStyles.topRowHeader}>
            <Box
              style={sharedStyles.dot}
              backgroundColor={negativeSaved ? 'redText' : 'greenText'}
            />
            <Text fontSize={13} lineHeight={24} color='tertiaryText'>Saved</Text>
          </View>
          <SlotText
            value={saved as `${number}`}
            fontStyle={[
              { color: theme.colors.mainText },
              styles.fontStyle
            ]}
            animationDuration={200}
            prefix={negativeSaved ? '-$' : '$'}
            includeComma={true}
          />
        </View>
        <View style={rectangleStyles.bottomRowCell}>
          <View style={sharedStyles.topRowHeader}>
            <Box backgroundColor='purpleText' style={sharedStyles.dot} />
            <Text fontSize={13} lineHeight={24} color='tertiaryText'>Invested</Text>
          </View>
          <SlotText
            value={invested as `${number}`}
            fontStyle={[
              { color: theme.colors.mainText },
              styles.fontStyle
            ]}
            animationDuration={200}
            prefix={'$'}
            includeComma={true}
          />
        </View>
      </View>
    </Box>
  )
}
