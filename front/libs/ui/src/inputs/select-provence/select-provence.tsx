
import { Control, FieldError } from "react-hook-form";

import './select-provence.scss'
import { states as provences } from './provences-data'
import BakedComboBox from "../baked-selects/baked-combo-box";

export const SelectProvence = ({ control, errors }: { control: Control, errors: FieldError[] }) => {

  return (
    <BakedComboBox
      name='state'
      placeholder="State"
      control={control}
      placement="left"
      options={provences}
    />
  )
}
