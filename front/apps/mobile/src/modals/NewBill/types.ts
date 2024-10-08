import { Control, UseFormResetField } from "react-hook-form";
import { z } from "zod";

import { billSchema } from "@ledget/form-schemas";

export interface Error {
  message?: string,
  type: string
}

export type Value = {
  day?: number;
  week?: number;
  week_day?: number;
  month?: number;
  year?: number;
}

export interface ModalProps {
  control: Control<z.infer<typeof billSchema>>;
  resetField: UseFormResetField<z.infer<typeof billSchema>>;
  error?: Error
}
