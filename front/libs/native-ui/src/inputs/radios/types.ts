export type Option = {
  label: string;
  value: string | number;
}

export type RadiosProps<T extends Option> = {
  options: Readonly<T[]>;
  onChange: (value: T[][number]['value']) => void;
  defaultValue?: T[][number]['value'];
  horizontal?: true;
  cardStyle?: true;
}
