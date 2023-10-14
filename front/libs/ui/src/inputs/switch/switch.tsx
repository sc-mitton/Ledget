
import './switch.css'
import { Switch } from '@headlessui/react'

interface DefaultSwitchProps {
  checked?: boolean
  onChange?: () => void,
  children: React.ReactNode
}

const DefaultSwitch = ({ checked, onChange, children, ...rest }: DefaultSwitchProps) => {

  return (
    <Switch.Group>
      <div className="switch--container">
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
      </div>
    </Switch.Group>
  )
}

export default DefaultSwitch
