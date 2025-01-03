import { View } from 'react-native';

import styles from './styles';
import { Text } from '../../restyled/Text';

function Selected({
  value,
  renderSelected,
  labelKey,
  placeholder,
}: {
  value: any;
  renderSelected?: (item: any, index: number) => React.ReactNode;
  labelKey?: string | number;
  placeholder?: string;
}) {
  return (
    <>
      {value ? (
        renderSelected ? (
          Array.isArray(value) ? (
            <View style={styles.defaultSelectedItems}>
              {value.map((item, index) => renderSelected(item, index))}
            </View>
          ) : (
            renderSelected(value, 0)
          )
        ) : Array.isArray(value) ? (
          <View style={styles.defaultSelectedItems}>
            {value.map((item, index) => {
              const label =
                typeof item === 'object' ? item[labelKey || 'label'] : item;
              return (
                <Text key={`${label}-${Math.random().toString().slice(2, 6)}`}>
                  {label}
                </Text>
              );
            })}
          </View>
        ) : (
          <Text>
            {typeof value === 'object'
              ? value[(labelKey as any) || 'label']
              : value}
          </Text>
        )
      ) : (
        <Text
          color={
            Array.isArray(value)
              ? value.length > 0
                ? 'mainText'
                : 'placeholderText'
              : value
              ? 'mainText'
              : 'placeholderText'
          }
        >
          {`${placeholder !== undefined ? placeholder : 'Select...'}`}
        </Text>
      )}
    </>
  );
}

export default Selected;
