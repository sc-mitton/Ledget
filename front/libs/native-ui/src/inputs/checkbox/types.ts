export interface CheckboxProps {
  default?: 'checked' | 'unchecked';
  value?: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  size?: number;
}
