
import styles from './styles/panel'
import { AccountsTabsScreenProps } from "@types"
import { Box } from "@ledget/native-ui"
import { useGetLiabilitiesQuery } from "@ledget/shared-features"

export default function Panel(props: AccountsTabsScreenProps<'Loan'>) {

  return (
    <Box
      padding='pagePadding'
      style={styles.main}
    >
      <Box style={styles.main}>

      </Box>
    </Box>
  )
}
