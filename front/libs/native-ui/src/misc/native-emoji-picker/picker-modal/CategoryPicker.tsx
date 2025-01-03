import React, { useEffect } from 'react';
import { View } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useTheme } from '@shopify/restyle';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import styles from './styles/category-picker';
import { Box } from '../../../restyled/Box';
import type { CategoryPickerProps } from './types';

const CategoryPicker = (props: CategoryPickerProps) => {
  const theme = useTheme();

  return (
    <Box
      style={styles.categoryPicker}
      borderBottomWidth={2}
      borderBottomColor="seperator"
    >
      <View>
        <FontAwesome6
          name="face-smile"
          size={20}
          style={{
            color:
              props.selectedCategory === 'Smileys & Emotion'
                ? theme.colors.faintBlueText
                : theme.colors.quinaryText,
          }}
        />
      </View>
      <View>
        <FontAwesome6
          name="bowl-food"
          size={20}
          style={{
            color:
              props.selectedCategory === 'Food & Drink'
                ? theme.colors.faintBlueText
                : theme.colors.quinaryText,
          }}
        />
      </View>
      <View>
        <MaterialIcons
          name="sports-football"
          size={20}
          style={{
            color:
              props.selectedCategory === 'Activities'
                ? theme.colors.faintBlueText
                : theme.colors.quinaryText,
          }}
        />
      </View>
      <View>
        <FontAwesome6
          name="tree"
          size={20}
          style={{
            color:
              props.selectedCategory === 'Animals & Nature'
                ? theme.colors.faintBlueText
                : theme.colors.quinaryText,
          }}
        />
      </View>
      <View>
        <FontAwesome6
          name="person"
          size={20}
          style={{
            color:
              props.selectedCategory === 'People & Body'
                ? theme.colors.faintBlueText
                : theme.colors.quinaryText,
          }}
        />
      </View>
      <View>
        <FontAwesome6
          name="plane"
          size={20}
          style={{
            color:
              props.selectedCategory === 'Travel & Places'
                ? theme.colors.faintBlueText
                : theme.colors.quinaryText,
          }}
        />
      </View>
      <View>
        <MaterialIcons
          name="emoji-objects"
          size={26}
          style={{
            color:
              props.selectedCategory === 'Objects'
                ? theme.colors.faintBlueText
                : theme.colors.quinaryText,
          }}
        />
      </View>
      <View>
        <FontAwesome6
          name="font-awesome-flag"
          size={20}
          style={{
            color:
              props.selectedCategory === 'Flags'
                ? theme.colors.faintBlueText
                : theme.colors.quinaryText,
          }}
        />
      </View>
      <View>
        <MaterialIcons
          name="emoji-symbols"
          size={20}
          style={{
            color:
              props.selectedCategory === 'Symbols'
                ? theme.colors.faintBlueText
                : theme.colors.quinaryText,
          }}
        />
      </View>
    </Box>
  );
};

export default CategoryPicker;
