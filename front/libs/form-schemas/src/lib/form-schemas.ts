import { z } from 'zod';

export const billSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'required' })
      .max(50, { message: 'Name is too long.' }),
    range: z.boolean().optional(),
    emoji: z.string().optional(),
    lower_amount: z.number().optional(),
    upper_amount: z.number().min(1, { message: 'required' }),
    period: z.enum(['once', 'month', 'year']),
    schedule: z
      .object({
        day: z.coerce.number().min(1).max(31).optional(),
        month: z.coerce.number().min(1).max(12).optional(),
        week: z.coerce.number().min(1).max(5).optional(),
        week_day: z.coerce.number().min(1).max(7).optional(),
        year: z.coerce.number().min(2021).optional(),
      })
      .refine(
        (data) => {
          const check1 = data.day === undefined;
          const check2 = data.week === undefined && data.week_day === undefined;
          const check3 = data.month === undefined && data.day === undefined;
          if (check1 && check2 && check3) return false;
          else return true;
        },
        { message: 'required', path: ['day'] }
      ),
    expires: z.string().optional(),
    reminders: z
      .array(
        z.object({
          period: z.enum(['day', 'week']),
          offset: z.number().min(1),
        })
      )
      .optional(),
  })
  .transform((data) => ({ ...data, ...data.schedule }))
  .refine(
    (data) => {
      // return data.lower_amount && data.upper_amount
      //   ? data.lower_amount < data.upper_amount
      //   : true;
      const hasError =
        data.lower_amount && data.upper_amount
          ? data.lower_amount > data.upper_amount
          : false;
      if (hasError) return false;
      else return true;
    },
    {
      message: 'Lower amount must be less than upper amount',
      path: ['lower_amount'],
    }
  );

export const categorySchema = z.object({
  name: z.string().min(1, { message: 'required' }).toLowerCase(),
  emoji: z.string().optional().nullable(),
  limit_amount: z.number().min(1, { message: 'required' }),
  period: z.enum(['month', 'year']),
  alerts: z.array(z.object({ percent_amount: z.number() })).optional(),
});
