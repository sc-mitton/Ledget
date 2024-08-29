type Error = {
  message?: string,
  type?: string
}

export type PickerOption = {
  [key: string]: any;
} | string;

type BaseModalPickerProps<O extends PickerOption, TMultiple extends boolean> = {
  multiple?: TMultiple;
  options: O[];
  placeholder?: string;
  labelKey?: O extends { [key: string]: any } ? keyof O : never;
  error?: Error;
  label?: string;
  searchable?: boolean;
  header?: string
  renderOption?: (option: O) => React.ReactNode;
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


type TContextBase = {
  options: PickerOption[];
  setOptions: (options: PickerOption[]) => void;
  multiple: boolean;
  setMultiple: (value: boolean) => void;
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  searchable: boolean;
  setSearchable: (value: boolean) => void;
  header?: string;
  setHeader: (value?: string) => void;
  labelKey?: string | number;
  setLabelKey: (value: string | number) => void;
  renderOption?: (option: PickerOption) => React.ReactNode;
  setRenderOption: (value?: (option: PickerOption) => React.ReactNode) => void;
}


export type TContext<O extends PickerOption, TMultiple extends boolean> =
  TMultiple extends true
  ? { value?: O[]; setValue: (value: O[]) => void } & TContextBase
  : { value?: O; setValue: (value: O) => void } & TContextBase;
