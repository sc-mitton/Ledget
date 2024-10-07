export type Option = {
  label: string;
  value: string;
}

export type RadiosProps<T extends Option> = {
  options: Readonly<T[]>;
  onChange: (value: T[][number]['value']) => void;
  defaultValue?: T[][number]['value'];
}
