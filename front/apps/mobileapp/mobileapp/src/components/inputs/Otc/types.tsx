export type Props = {
  codeLength: number;
  onCodeChange: (code: string) => void;
  error?: string;
  autoFocus?: boolean;
}
