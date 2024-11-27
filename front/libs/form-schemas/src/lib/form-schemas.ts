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
    schedule: z.object({
      day: z.coerce.number().min(1).max(31).optional(),
      month: z.coerce.number().min(1).max(12).optional(),
      week: z.coerce.number().min(1).max(5).optional(),
      week_day: z.coerce.number().min(1).max(7).optional(),
      year: z.coerce.number().min(2021).optional()
    }).transform((data) => ({ ...data })),
    expires: z.string().optional(),
    reminders: z.array(
      z.object({
        period: z.enum(['day', 'week']),
        offset: z.number().min(1)
      })
    ).optional()
  })
  .refine((data) => {
    return data.lower_amount && data.upper_amount
      ? data.lower_amount < data.upper_amount
      : true;
  })
  .refine(
    (data) => {
      const check1 = data.schedule.day === undefined;
      const check2 = data.schedule.week === undefined && data.schedule.week_day === undefined;
      const check3 = data.schedule.month === undefined && data.schedule.day === undefined;
      if (check1 && check2 && check3) return false;
      else return true;
    },
    { message: 'required', path: ['day'] }
  )

export const categorySchema = z.object({
  name: z.string().min(1, { message: 'required' }).toLowerCase(),
  emoji: z.string().optional().nullable(),
  limit_amount: z.number().min(1, { message: 'required' }),
  period: z.enum(['month', 'year']),
  alerts: z.array(z.object({ percent_amount: z.number() })).optional()
});
