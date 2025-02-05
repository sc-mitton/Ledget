import { z } from 'zod';

export const billSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'required' })
      .max(50, { message: 'Name is too long.' })
      .transform((val) => val.toLowerCase().trim()),
    range: z.boolean().optional(),
    emoji: z.string().optional(),
    lower_amount: z.number().optional(),
    upper_amount: z.number().min(1, { message: 'Required' }),
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
        { message: 'Required', path: ['day'] }
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
  .refine(
    (data) => {
      const hasError =
        data.lower_amount && data.upper_amount
          ? data.lower_amount > data.upper_amount
          : false;
      if (hasError) return false;
      else return true;
    },
    {
      message: 'First amount must be less than the second',
      path: ['lower_amount'],
    }
  )
  .transform((data) => {
    const { schedule, lower_amount, upper_amount } = data;

    return {
      ...data,
      ...schedule,
      lower_amount: lower_amount === undefined ? undefined : lower_amount * 100,
      upper_amount: upper_amount === undefined ? undefined : upper_amount * 100,
    };
  });

export const categorySchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'required' })
      .transform((val) => val.toLowerCase().trim()),
    emoji: z.string().optional().nullable(),
    limit_amount: z.number().min(1, { message: 'required' }),
    period: z.enum(['month', 'year']),
    alerts: z.array(z.object({ percent_amount: z.number() })).optional(),
  })
  .transform((data) => ({
    ...data,
    limit_amount: data.limit_amount * 100,
  }));
