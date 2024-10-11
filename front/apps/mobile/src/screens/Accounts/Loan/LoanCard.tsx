import { View } from "react-native";
import { AlertCircle, Calendar } from "geist-native-icons";
import { useTheme } from "@shopify/restyle";
import Big from "big.js";
import dayjs from "dayjs";

import styles from './styles/loan-card';
import { StudentLoan, Mortgage } from "@ledget/shared-features";
import { Box, Text, InstitutionLogo, Seperator, DollarCents, Icon } from "@ledget/native-ui";


const MAX_LIGHT_MODE_OPACITY = 0.6;
const MAX_DARK_MODE_OPACITY = 1;

const LoanCard = ({ liability }: { liability: Mortgage | StudentLoan }) => {
  const theme = useTheme();

  const daysSinceStart = dayjs().diff(dayjs(liability.origination_date), 'day')
  const loanLength = dayjs(liability.expected_payoff_date || liability.last_payment_date).diff(dayjs(liability.origination_date), 'day')

  return (
    <Box variant='nestedContainer' style={styles.box}>
      <View style={styles.header}>
        <View>
          {liability.is_overdue &&
            <View style={styles.overdueContainer}>
              <Icon icon={AlertCircle} color='redText' size={16} />
              <Text color='redText'>Overdue</Text>
            </View>
          }
          <Text fontSize={18} variant='bold' lineHeight={32}>{liability.name}</Text>
          <Text color='tertiaryText'>
            {liability.subtype.charAt(0).toUpperCase() + liability.subtype.slice(1)}
            &nbsp;
            {liability.type.charAt(0).toUpperCase() + liability.type.slice(1)}
          </Text>
        </View>
        <View style={styles.logo}>
          <InstitutionLogo account={liability.account_id} size={28} />
        </View>
      </View>
      <View style={styles.seperator}>
        <Seperator backgroundColor="nestedContainerSeperator" />
      </View>
      {!liability.product_not_supported
        ?
        (
          <>
            <View style={styles.middleRow}>
              <View style={styles.middleRowCell}>
                <Text color='tertiaryText' fontSize={14}>
                  Principal
                </Text>
                <DollarCents
                  variant='bold'
                  withCents={false}
                  value={Big(liability.origination_principal_amount).times(100).toNumber()}
                />
              </View>
              <View style={styles.middleRowCell}>
                <Text color='tertiaryText' fontSize={14}>
                  Min. Payment
                </Text>
                {liability.minimum_payment_amount
                  ? <DollarCents
                    variant='bold'
                    value={Big(liability.minimum_payment_amount).times(100).toNumber()}
                  />
                  : <Text variant='bold' color='tertiaryText'>&mdash;</Text>}
              </View>
              <View style={styles.middleRowCell}>
                <Text color='tertiaryText' fontSize={14}>
                  Rate
                </Text>
                {liability.interest_rate_percentage
                  ? <Text variant='bold'>{`${liability.interest_rate_percentage}%`}</Text>
                  : <Text variant='bold' color='tertiaryText'>&mdash;</Text>}
              </View>
            </View>
            <View style={styles.progressBars}>
              {Array.from({ length: 4 }, (_, i) => {

                const lastFraction = (i / 4)
                const fraction = ((i + 1) / 4)
                const progress = (daysSinceStart / loanLength)
                const partialProgress = progress > lastFraction && progress < fraction
                  ? (progress - lastFraction) / (fraction - lastFraction)
                  : undefined
                return (
                  <Box
                    style={[
                      styles.progressBar,
                      {
                        backgroundColor: progress > lastFraction
                          ? liability.institution.primary_color
                          : theme.colors.menuSeperator,
                        opacity: partialProgress
                          ? theme.colors.mode === 'light'
                            ? MAX_LIGHT_MODE_OPACITY * partialProgress
                            : MAX_DARK_MODE_OPACITY * partialProgress
                          : theme.colors.mode === 'light'
                            ? MAX_LIGHT_MODE_OPACITY
                            : MAX_DARK_MODE_OPACITY
                      }
                    ]}
                  />
                )
              })}
            </View>
            <View style={styles.dates}>
              <Text fontSize={15} color='tertiaryText'>
                {dayjs(liability.origination_date).format('M/D/YY')}
              </Text>
              <Text fontSize={15} color='tertiaryText'>
                {dayjs(liability.expected_payoff_date || liability.last_payment_date).format('M/D/YY')}
              </Text>
            </View>
            <View style={styles.seperator}>
              <Seperator backgroundColor="nestedContainerSeperator" variant='m' />
            </View>
            <Text fontSize={14} color='quaternaryText'>
              <Icon icon={Calendar} color='quaternaryText' size={16} />
              &nbsp;&nbsp;
              <Text color='quaternaryText' fontSize={14}>Last payment on {dayjs(liability.last_payment_date).format('MMM D, YYYY')}</Text>
            </Text>
          </>
        )
        :
        <View style={styles.noData}>
          <Text color='quinaryText'>No data available</Text>
        </View>
      }
    </Box >
  )
}

export default LoanCard;
