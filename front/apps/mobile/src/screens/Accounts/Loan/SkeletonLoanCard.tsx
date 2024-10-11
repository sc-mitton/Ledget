import { View } from "react-native";
import { Calendar } from "geist-native-icons";
import { useTheme } from "@shopify/restyle";

import styles from './styles/loan-card';
import { Box, Text, InstitutionLogo, Seperator, Icon, PulseBox } from "@ledget/native-ui";


const MAX_LIGHT_MODE_OPACITY = 0.6;
const MAX_DARK_MODE_OPACITY = 1;

const LoanCard = () => {
  const theme = useTheme();

  return (
    <Box variant='nestedContainer' style={styles.box}>
      <View style={styles.header}>
        <Box gap='m' marginTop='xs'>
          <PulseBox height='s' width={150} backgroundColor="menuSeperator" />
          <PulseBox height='s' width={75} backgroundColor="menuSeperator" />
        </Box>
        <View style={styles.logo}>
          <InstitutionLogo size={34} />
        </View>
      </View>
      <View style={styles.seperator}>
        <Seperator backgroundColor="nestedContainerSeperator" />
      </View>
      <View style={styles.middleRow}>
        <View style={styles.middleRowCell}>
          <Text color='quaternaryText' fontSize={14}>
            Principal
          </Text>
        </View>
        <View style={styles.middleRowCell}>
          <Text color='quaternaryText' fontSize={14}>
            Min. Payment
          </Text>
        </View>
        <View style={styles.middleRowCell}>
          <Text color='quaternaryText' fontSize={14}>
            Rate
          </Text>
        </View>
      </View>
      <View style={styles.progressBars}>
        {Array.from({ length: 4 }, (_, i) => {
          return (
            <Box
              style={[
                styles.progressBar,
                {
                  backgroundColor: theme.colors.menuSeperator,
                  opacity: theme.colors.mode === 'light'
                    ? MAX_LIGHT_MODE_OPACITY
                    : MAX_DARK_MODE_OPACITY
                }
              ]}
            />
          )
        })}
      </View>
      <View style={styles.dates}>
        <Text fontSize={15} color='secondaryText'>
          &nbsp;&nbsp;
        </Text>
        <Text fontSize={15} color='secondaryText'>
          &nbsp;&nbsp;
        </Text>
      </View>
      <View style={styles.seperator}>
        <Seperator backgroundColor="nestedContainerSeperator" variant='m' />
      </View>
      <Text fontSize={14} color='quaternaryText'>
        <Icon icon={Calendar} color='quaternaryText' size={16} />
        &nbsp;&nbsp;
        <Text color='quaternaryText' fontSize={14}>Last payment on     &mdash;</Text>
      </Text>
    </Box >
  )
}

export default LoanCard;
