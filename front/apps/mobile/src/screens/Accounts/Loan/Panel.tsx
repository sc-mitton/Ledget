import { View } from "react-native"

import styles from './styles/panel'
import { AccountsTabsScreenProps } from "@types"
import { Box } from "@ledget/native-ui"
import { useGetLiabilitiesQuery } from "@ledget/shared-features"

export default function Panel(props: AccountsTabsScreenProps<'Loan'>) {
  const { data: liabilities } = useGetLiabilitiesQuery()

  return (
    <Box
      padding='pagePadding'
      style={styles.main}
    >
      <Box variant='nestedContainer' marginTop='m'>
      </Box>
    </Box>
  )
}
