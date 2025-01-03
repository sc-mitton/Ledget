import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import styles from './styles/styles.module.scss';
import { PlainTextInput, MainButton } from '@ledget/ui';
import { useEmailContext } from './context';
import { SubHeader } from '@components/index';

const traitsSchema = z.object({
  first: z
    .string()
    .min(1, { message: 'required' })
    .transform((value) => value.trim()),
  last: z
    .string()
    .min(1, { message: 'required' })
    .transform((value) => value.trim()),
});

const AddTraitsForm = ({
  submit,
  csrf_token,
}: {
  submit: (data: any) => void;
  csrf_token?: string;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof traitsSchema>>({
    resolver: zodResolver(traitsSchema),
  });
  const { email } = useEmailContext();

  const onSubmit = (data: any) => {
    submit({
      traits: { name: { ...data }, email },
      method: 'profile',
      csrf_token,
    });
  };

  return (
    <>
      <div className={styles.step}>
        <span>Step 3 of 4</span>
        <SubHeader>Enter your Name</SubHeader>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <PlainTextInput
          label="First Name"
          placeholder="First name"
          error={errors?.first}
          {...register('first')}
        />
        <PlainTextInput
          label="Last Name"
          placeholder="Last name"
          error={errors?.last}
          {...register('last')}
        />
        <MainButton type="submit">Next</MainButton>
      </form>
    </>
  );
};

export default AddTraitsForm;
