import { View } from 'react-native';
import { ArrowDown, ArrowUp } from 'geist-native-icons';

import styles from './styles/table-headers';
import { Button, Icon } from '@ledget/native-ui';
import { ModalScreenProps } from '@types';

const Headers = (props: ModalScreenProps<'PickAccount'>) => {
  return (
    <View style={styles.tableHeaders}>
      <Button
        onPress={() => {
          const order = props.route.params.options?.order;
          props.navigation.setParams({
            options: {
              ...props.route.params.options,
              order:
                order === 'name-desc'
                  ? 'name-asc'
                  : order === 'name-asc'
                  ? undefined
                  : 'name-desc',
            },
          });
        }}
        label="Name"
        textColor={
          props.route.params.options?.order?.includes('name')
            ? 'mainText'
            : 'quaternaryText'
        }
        fontSize={15}
      >
        <View style={styles.icon}>
          <Icon
            size={16}
            strokeWidth={2}
            color={
              props.route.params.options?.order?.includes('name')
                ? 'mainText'
                : 'quaternaryText'
            }
            icon={
              props.route.params.options?.order === 'name-desc'
                ? ArrowUp
                : ArrowDown
            }
          />
        </View>
      </Button>
      <Button
        onPress={() => {
          const order = props.route.params.options?.order;
          props.navigation.setParams({
            options: {
              ...props.route.params.options,
              order:
                order === 'balance-desc'
                  ? 'balance-asc'
                  : order === 'balance-asc'
                  ? undefined
                  : 'balance-desc',
            },
          });
        }}
        label="Balance"
        textColor={
          props.route.params.options?.order?.includes('balance')
            ? 'mainText'
            : 'quaternaryText'
        }
        fontSize={15}
      >
        <View style={styles.icon}>
          <Icon
            size={16}
            strokeWidth={2}
            color={
              props.route.params.options?.order?.includes('balance')
                ? 'mainText'
                : 'quaternaryText'
            }
            icon={
              props.route.params.options?.order === 'balance-desc'
                ? ArrowUp
                : ArrowDown
            }
          />
        </View>
      </Button>
    </View>
  );
};
export default Headers;
