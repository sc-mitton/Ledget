import { useState } from 'react';
import { Check, CornerDownLeft } from 'geist-native-icons';

import styles from './styles'
import { Box, Icon, Text, Menu } from '@ledget/native-ui';

type Windows = readonly {
  key: string
  label: string
}[]

type Props<W extends Windows> = {
  onSelect: (window: W[number]['key']) => void
  onShowChange?: (show: boolean) => void
  onClose?: () => void
  closeOption?: boolean
  windows: W
  defaultWindow?: W[number]['key']
}

export const ChartWindowsMenu = <W extends Windows>(props: Props<W>) => {
  const [window, setWindow] = useState<typeof props.windows[number]['key']>(props.defaultWindow ?? props.windows[0].key)

  return (
    <Menu
      as='menu'
      onShowChange={props.onShowChange}
      items={[
        ...props.windows.map(w => ({
          label: w.label,
          icon: () => <Icon icon={Check} color={window === w.key ? 'blueText' : 'transparent'} strokeWidth={2} />,
          onSelect: () => {
            setWindow(w.key)
            props.onSelect(w.key)
          }
        }))
      ]}
      placement='right'
      closeOnSelect={true}
    >
      <Box backgroundColor='lightBlueButton' style={styles.menuButton}>
        <Text color='blueText'>{window}</Text>
      </Box>
    </Menu>
  )
}
