export interface CheckboxProps {
  default: 'checked' | 'unchecked';
  onChange: (value: boolean) => void;
  label?: string;
}
