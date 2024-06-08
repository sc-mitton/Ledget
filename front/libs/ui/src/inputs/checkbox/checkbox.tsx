import { forwardRef } from 'react'

import styles from './checkbox.module.scss'

interface CheckboxProps {
  id: string
  label: string
  checked?: boolean
  setChecked?: React.Dispatch<React.SetStateAction<boolean>>
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ checked, setChecked, ...rest }, ref) => {

  const handleLabelKeyDown = (event: React.KeyboardEvent<HTMLLabelElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      event.currentTarget.click()
    }
  }

  return (
    <div className={styles.container}>
      <svg className={styles.symbol}>
        <symbol id="check" viewBox="0 0 12 10">
          <polyline
            points="3 5.5 5.5 8 9.5 2"
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='1'
          />
        </symbol>
      </svg>
      <input
        value={checked ? 'on' : 'off'}
        checked={checked}
        onChange={() => setChecked && setChecked(!checked)}
        className={styles.input}
        type="checkbox"
        ref={ref}
        {...rest}
      />
      <label
        className={styles.checkbox}
        htmlFor={rest.id}
        onKeyDown={handleLabelKeyDown}
        tabIndex={0}
        role="checkbox"
      >
        <span>
          <svg>
            <use xlinkHref="#check"></use>
          </svg>
        </span>
        <span>{rest.label}</span>
      </label>
    </ div >
  )
})
