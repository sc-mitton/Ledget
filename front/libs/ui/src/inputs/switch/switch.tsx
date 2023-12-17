
import './switch.scss'
import { Switch } from '@headlessui/react'

interface DefaultSwitchProps {
  checked?: boolean
  onChange?: () => void,
  children: React.ReactNode
  className?: string
  as?: 'div' | 'li'
}

export const BakedSwitch = ({ checked, className, onChange, children, as = 'div', ...rest }: DefaultSwitchProps) => {

  return (
    <Switch.Group className={`switch--container ${className}`} as={as}>
      <Switch.Label>{children}</Switch.Label>
      <Switch
        checked={checked}
        onChange={onChange}
        className={`switch-crib ${checked ? 'enabled' : 'disabled'}`}
        {...rest}
      >
        {({ checked: isChecked }) => (
          <span className={`switch-pill ${isChecked ? 'enabled' : 'disabled'}`} />
        )}
      </Switch>
    </Switch.Group>
  )
}

