type Error = {
  message?: string,
  type?: string
}

export type PickerOption = {
  [key: string]: any;
} | string | number;

type TContextBase = {
  options: PickerOption[];
  setOptions: (options: PickerOption[]) => void;
  multiple: boolean;
  setMultiple: (value: boolean) => void;
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
}

export type TContext<O extends PickerOption, TMultiple extends boolean> =
  TMultiple extends true
  ? { value?: O[]; setValue: (value: O[]) => void } & TContextBase
  : { value?: O; setValue: (value: O) => void } & TContextBase;

type BaseModalPickerProps<O extends PickerOption, TMultiple extends boolean> = {
  multiple?: TMultiple;
  options: O[];
  placeholder?: string;
  labelKey?: O extends { [key: string]: any } ? keyof O : never;
  error?: Error;
  label?: string;
}

export type ModalPickerProps<O extends PickerOption, TMultiple extends boolean> =
  TMultiple extends true
  ?
  {
    onChange?: (value: O[]) => void
    renderSelected?: (value?: O[]) => React.ReactNode;
  } & BaseModalPickerProps<O, TMultiple>
  :
  {
    onChange?: (value: O) => void
    renderSelected?: (value?: O) => React.ReactNode;
  } & BaseModalPickerProps<O, TMultiple>;
