import { View, Alert, TouchableOpacity } from 'react-native';
import { Big } from 'big.js';
import { Info } from 'geist-native-icons';
import dayjs from 'dayjs';

import sharedStyles from './styles/shared';
import styles from './styles/spending-summary';
import PickerOption from './PickerOption';
import { Box, Text, DollarCents, Icon, PulseBox } from '@ledget/native-ui';
import { WidgetProps } from '@features/widgetsSlice';
import { useAppSelector } from '@hooks';
import { useGetCategoriesQuery, useGetMeQuery } from '@ledget/shared-features';
import {
  selectBudgetMonthYear,
  selectCategoryMetaData,
} from '@ledget/shared-features';
import { useAppearance } from '@/features/appearanceSlice';

const SquareFilled = (props: WidgetProps & { loading: boolean }) => {
  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const { monthly_spent, yearly_spent } = useAppSelector(
    selectCategoryMetaData
  );
  const { data: user } = useGetMeQuery();
  const { mode } = useAppearance();

  return (
    <Box padding="xxs" style={sharedStyles.box}>
      <View style={sharedStyles.title}>
        <Box
          backgroundColor="yearColor"
          borderColor="nestedContainer"
          borderWidth={2}
          style={sharedStyles.dot}
        />
        <View style={sharedStyles.overlappingDot}>
          <Box
            backgroundColor="monthColor"
            borderColor="nestedContainer"
            borderWidth={2}
            style={sharedStyles.dot}
          />
        </View>
        <Text color="secondaryText" fontSize={13}>
          {dayjs(`${year}-${month}-01`).format('MMM')}&nbsp;Spending
        </Text>
      </View>
      <View style={sharedStyles.totalAmount}>
        <DollarCents
          value={Big(monthly_spent).plus(yearly_spent).toNumber()}
          withCents={false}
          variant="bold"
          fontSize={28}
        />
      </View>
      <Box style={sharedStyles.bottomRow} paddingHorizontal="xxxs">
        <View style={sharedStyles.bottomRowCell}>
          <View style={sharedStyles.bottomTitle}>
            <Box
              backgroundColor="monthColor"
              borderColor="nestedContainer"
              borderWidth={2}
              style={sharedStyles.dot}
            />
            <Text fontSize={13} color="secondaryText">
              Month
            </Text>
          </View>
          <DollarCents
            value={Big(monthly_spent).toNumber()}
            withCents={false}
            fontSize={15}
          />
        </View>
        <View style={sharedStyles.bottomRowCell}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert(
                'Yearly Spending',
                `Resets every year on ${dayjs(user?.yearly_anchor).format(
                  'MMM D'
                )}`,
                [{ text: 'OK' }],
                { userInterfaceStyle: mode }
              )
            }
          >
            <View style={sharedStyles.bottomTitle}>
              <Box
                backgroundColor="yearColor"
                borderColor="nestedContainer"
                borderWidth={2}
                style={sharedStyles.dot}
              />
              <Text fontSize={13} color="secondaryText">
                Year
              </Text>
              <Icon
                icon={Info}
                size={12}
                color="tertiaryText"
                strokeWidth={2}
              />
            </View>
          </TouchableOpacity>
          <DollarCents
            value={Big(yearly_spent).toNumber()}
            withCents={false}
            fontSize={15}
          />
        </View>
      </Box>
    </Box>
  );
};

const RectangleFilled = (props: WidgetProps & { loading: boolean }) => {
  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const {
    monthly_spent,
    yearly_spent,
    limit_amount_monthly,
    limit_amount_yearly,
  } = useAppSelector(selectCategoryMetaData);
  const { data: user } = useGetMeQuery();
  const { mode } = useAppearance();

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <Box style={styles.rectangleBox}>
      <View style={styles.rectangleLeft}>
        <View style={styles.rectangleLeftInner}>
          <View style={styles.dots}>
            <Box
              backgroundColor="yearColor"
              borderColor="nestedContainer"
              borderWidth={2}
              style={sharedStyles.dot}
            />
            <View style={sharedStyles.overlappingDot}>
              <Box
                backgroundColor="monthColor"
                borderColor="nestedContainer"
                borderWidth={2}
                style={sharedStyles.dot}
              />
            </View>
          </View>
          <Text color="secondaryText" fontSize={13}>
            {dayjs(`${year}-${month}-01`).format('MMM')}&nbsp;Spending
          </Text>
          <View style={styles.totalAmount}>
            {props.loading ? (
              <Box marginTop="s">
                <PulseBox width={100} height="l" borderRadius="s" />
              </Box>
            ) : (
              <DollarCents
                value={Big(monthly_spent).plus(yearly_spent).toNumber()}
                withCents={false}
                variant="bold"
                fontSize={24}
              />
            )}
          </View>
        </View>
      </View>
      <Box
        backgroundColor="nestedContainerSeperator"
        borderRadius="l"
        style={styles.rectangleRight}
      >
        <View style={styles.rectangleRightColumn}>
          <View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                Alert.alert(
                  'Monthly Spending',
                  `You've spent $${Big(
                    monthly_spent
                  ).toNumber()} this month from your monthly spending categories`,
                  [{ text: 'OK' }],
                  { userInterfaceStyle: mode }
                )
              }
            >
              <View style={sharedStyles.bottomTitle}>
                <Box
                  backgroundColor="monthColor"
                  borderColor="nestedContainer"
                  borderWidth={2}
                  style={sharedStyles.dot}
                />
                <Text fontSize={13} color="secondaryText">
                  Month
                </Text>
                <Icon
                  icon={Info}
                  size={12}
                  color="tertiaryText"
                  strokeWidth={2}
                />
              </View>
            </TouchableOpacity>
            {props.loading ? (
              <Box marginTop="xs">
                <PulseBox width={54} height="reg" borderRadius="s" />
              </Box>
            ) : (
              <DollarCents
                value={Big(monthly_spent).toNumber()}
                withCents={false}
                fontSize={15}
              />
            )}
          </View>
          <View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                Alert.alert(
                  'Yearly Spending',
                  'Resets every year on ' +
                    dayjs(user?.yearly_anchor).format('MMM D'),
                  [{ text: 'OK' }],
                  { userInterfaceStyle: mode }
                )
              }
            >
              <View style={sharedStyles.bottomTitle}>
                <Box
                  backgroundColor="yearColor"
                  borderColor="nestedContainer"
                  borderWidth={2}
                  style={sharedStyles.dot}
                />
                <Text fontSize={13} color="secondaryText">
                  Year
                </Text>
                <Icon
                  icon={Info}
                  size={12}
                  color="tertiaryText"
                  strokeWidth={2}
                />
              </View>
            </TouchableOpacity>
            {props.loading ? (
              <Box marginTop="xs">
                <PulseBox width={54} height="reg" borderRadius="s" />
              </Box>
            ) : (
              <DollarCents
                value={Big(yearly_spent).toNumber()}
                withCents={false}
                fontSize={15}
              />
            )}
          </View>
        </View>
        <View style={styles.rectangleRightColumn}>
          <View style={styles.cell}>
            <Box backgroundColor="menuSeperator" style={styles.divider} />
            <View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  Alert.alert(
                    'Monthy Spending Left',
                    'You have ' +
                      formatter.format(
                        Big(limit_amount_monthly)
                          .minus(monthly_spent)
                          .div(100)
                          .toNumber()
                      ) +
                      ' left from your monthly spending categories',
                    [{ text: 'OK' }],
                    { userInterfaceStyle: mode }
                  )
                }
              >
                <View style={sharedStyles.bottomTitle}>
                  <Box
                    backgroundColor="monthColor"
                    borderColor="nestedContainer"
                    borderWidth={2}
                    style={sharedStyles.dot}
                  />
                  <Text fontSize={13} color="secondaryText">
                    Left
                  </Text>
                  <Icon
                    icon={Info}
                    size={12}
                    color="tertiaryText"
                    strokeWidth={2}
                  />
                </View>
              </TouchableOpacity>
              {props.loading ? (
                <Box marginTop="xs">
                  <PulseBox width={54} height="reg" borderRadius="s" />
                </Box>
              ) : (
                <DollarCents
                  value={Big(limit_amount_monthly)
                    .minus(monthly_spent)
                    .toNumber()}
                  withCents={false}
                  fontSize={15}
                />
              )}
            </View>
          </View>
          <View style={styles.cell}>
            <Box backgroundColor="menuSeperator" style={styles.divider} />
            <View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  Alert.alert(
                    'Yearly Spending Left',
                    'You have ' +
                      formatter.format(
                        Big(limit_amount_yearly)
                          .minus(yearly_spent)
                          .div(100)
                          .toNumber()
                      ) +
                      ' left from your yearly spending categories',
                    [{ text: 'OK' }],
                    { userInterfaceStyle: mode }
                  )
                }
              >
                <View style={sharedStyles.bottomTitle}>
                  <Box
                    backgroundColor="yearColor"
                    borderColor="nestedContainer"
                    borderWidth={2}
                    style={sharedStyles.dot}
                  />
                  <Text fontSize={13} color="secondaryText">
                    Left
                  </Text>
                  <Icon
                    icon={Info}
                    size={12}
                    color="tertiaryText"
                    strokeWidth={2}
                  />
                </View>
              </TouchableOpacity>
              {props.loading ? (
                <Box marginTop="xs">
                  <PulseBox width={54} height="reg" borderRadius="s" />
                </Box>
              ) : (
                <DollarCents
                  value={Big(limit_amount_yearly)
                    .minus(yearly_spent)
                    .toNumber()}
                  withCents={false}
                  fontSize={15}
                />
              )}
            </View>
          </View>
        </View>
      </Box>
    </Box>
  );
};

const SpendingSummary = (widget: WidgetProps) => {
  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const { isLoading } = useGetCategoriesQuery(
    { month, year },
    { skip: !month || !year }
  );

  return widget.id ? (
    widget.shape === 'square' ? (
      <SquareFilled {...widget} loading={isLoading} />
    ) : (
      <RectangleFilled {...widget} loading={isLoading} />
    )
  ) : (
    <PickerOption loading={isLoading} />
  );
};

export default SpendingSummary;
