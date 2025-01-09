import { z } from 'zod';
import { baseBillingSchema } from '@ledget/ui';

export const schema = baseBillingSchema
  .extend({
    name: z.string().min(1, { message: 'required' }),
    price: z.string().min(1, { message: 'required' }),
  })
  .refine((data) => data.name.split(' ').length > 1, {
    message: 'Please enter your full name',
  });
