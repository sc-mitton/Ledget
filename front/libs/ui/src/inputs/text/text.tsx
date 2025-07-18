import React, { forwardRef, useRef, useState } from 'react';
import { FC } from 'react';
import LottieView from 'react-lottie';

import { CardElement } from '@stripe/react-stripe-js';
import { z } from 'zod';
import { FieldError, Control } from 'react-hook-form';

import textStyles from './text.module.scss';
import passwordStyles from './password-input.module.scss';
import { FormErrorTip, FormError } from '../../pieces/form-errors/form-errors';
import { SelectProvence } from '../select-provence/SelectProvence';
import { InputPulseDiv } from '../../pieces/loading-boxes/loading-boxes';
import { useStripeCardTheme } from '../../themes/themes';
import { useColorScheme } from '../../themes/hooks/use-color-scheme/use-color-scheme';
import { visibilityV2Dark } from '@ledget/media/lotties';

export interface TextInputWrapperProps extends React.HTMLProps<HTMLDivElement> {
  slim?: boolean;
  focused?: boolean;
}

export const TextInputWrapper = forwardRef<
  HTMLDivElement,
  TextInputWrapperProps
>((props, ref) => {
  const { className, children, focused, slim, ...rest } = props;

  return (
    <div
      className={[textStyles.inputContainer, className].join(' ')}
      data-slim={slim}
      data-focused={focused}
      ref={ref}
      {...rest}
    >
      {children}
    </div>
  );
});

interface PlainTextInputProps extends React.HTMLProps<HTMLInputElement> {
  loading?: boolean;
  name: string;
  error?: FieldError;
}

export const PlainTextInput = forwardRef<HTMLInputElement, PlainTextInputProps>(
  (props, ref) => {
    const { error, loading, name, ...rest } = props;

    return (
      <>
        {loading ? (
          <InputPulseDiv />
        ) : (
          <TextInputWrapper>
            <input type="text" name={name} ref={ref} {...rest} />
            {error && <FormErrorTip error={error} />}
          </TextInputWrapper>
        )}
      </>
    );
  }
);

export const MenuTextInput: FC<React.HTMLProps<HTMLDivElement>> = (props) => {
  const { className, onClick, children, ...rest } = props;
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // focus input element inside the container
    if (!ref.current) {
      return;
    }
    const element = ref.current.querySelector('input');

    if (element) {
      element.focus();
    }

    onClick && onClick(event);
  };

  return (
    <div
      className={[textStyles.menuTextInputContainer, className].join(' ')}
      onClick={handleClick}
      ref={ref}
      {...rest}
    >
      <div>{children}</div>
    </div>
  );
};

interface CardProps {
  requiredError: boolean;
  onComplete: () => void;
  clearError: () => void;
  loading?: boolean;
}

export const CardInput = ({
  requiredError,
  onComplete,
  clearError,
  loading,
}: CardProps) => {
  let [cardFocus, setCardFocus] = useState(false);
  const { isDark } = useColorScheme();
  const stripeCardTheme = useStripeCardTheme({ isDark, focus: cardFocus });

  return (
    <>
      {loading ? (
        <InputPulseDiv />
      ) : (
        <div className={textStyles.cardContainer} data-focused={cardFocus}>
          <CardElement
            id="card-element"
            onBlur={() => setCardFocus(false)}
            onFocus={() => setCardFocus(true)}
            onChange={(e) => {
              if (!e.complete) {
                return;
              }
              clearError();
              onComplete();
            }}
            options={stripeCardTheme}
          />
          {requiredError && <FormErrorTip error={{ type: 'required' }} />}
        </div>
      )}
    </>
  );
};

interface ZodValidatedInputProps extends React.HTMLProps<HTMLInputElement> {
  errors: any;
}

export const CityInput = forwardRef<HTMLInputElement, ZodValidatedInputProps>(
  (props, ref) => {
    const { errors, ...rest } = props;

    return (
      <TextInputWrapper>
        <input
          type="text"
          id="city"
          name="city"
          placeholder="City"
          ref={ref}
          {...rest}
        />
        <FormErrorTip error={errors.city} />
      </TextInputWrapper>
    );
  }
);

export const NameOnCardInput = forwardRef<
  HTMLInputElement,
  ZodValidatedInputProps
>((props, ref) => {
  const { errors, ...rest } = props;

  return (
    <>
      <TextInputWrapper>
        <input
          type="text"
          id="name-on-card"
          name="name"
          placeholder="Name on card"
          ref={ref}
          {...rest}
        />
        <FormErrorTip error={errors.name} />
      </TextInputWrapper>
      <div id="name-on-card-error">
        {errors.name?.type !== 'required' && (
          <FormError msg={errors.name?.message} />
        )}
      </div>
    </>
  );
});

export const ZipInput = forwardRef<HTMLInputElement, ZodValidatedInputProps>(
  (props, ref) => {
    const { errors, ...rest } = props;

    return (
      <TextInputWrapper>
        <input
          type="text"
          id="zip"
          name="zip"
          placeholder="Zip"
          ref={ref}
          {...rest}
        />
        <FormErrorTip error={errors.zip} />
      </TextInputWrapper>
    );
  }
);

export const baseBillingSchema = z.object({
  city: z.string().min(1, 'required').max(50, 'City is too long'),
  state: z.string().min(1, 'required'),
  zip: z
    .string()
    .min(1, 'required')
    .regex(/^\d{5}(?:[-\s]\d{4})?$/, 'Invalid zip'),
});

interface CityStateZipInputsProps {
  errors: any;
  register: (name: string, options?: any) => any;
  control: Control<any>;
  loading: boolean;
}

export const CityStateZipInputs = ({
  errors,
  register,
  control,
  loading,
}: CityStateZipInputsProps) => {
  const hasErrorMsg = (field: string) => {
    return (
      errors[field]?.message && !errors[field]?.message.includes('required')
    );
  };

  return (
    <>
      <div className={textStyles.locationInputsContainer}>
        <div className={textStyles.cityContainer}>
          {loading ? (
            <InputPulseDiv />
          ) : (
            <CityInput {...register('city')} errors={errors} />
          )}
        </div>
        <div className={textStyles.stateContainer}>
          {loading ? (
            <InputPulseDiv />
          ) : (
            <SelectProvence control={control} errors={errors} />
          )}
        </div>
        <div className={textStyles.zipContainer}>
          {loading ? (
            <InputPulseDiv />
          ) : (
            <ZipInput {...register('zip')} errors={errors} />
          )}
        </div>
      </div>
      {(hasErrorMsg('city') || hasErrorMsg('state') || hasErrorMsg('zip')) && (
        <div className={textStyles.locationInputErrors}>
          <div className={textStyles.cityError}>
            <FormError msg={errors.city?.message} />
          </div>
          <div className={textStyles.stateError}></div>
          <div className={textStyles.zipError}>
            <FormError msg={errors.zip?.message} />
          </div>
        </div>
      )}
    </>
  );
};

interface PasswordProps extends React.HTMLProps<HTMLInputElement> {
  name?: string;
  inputType?: 'password' | 'confirm-password';
  placeholder?: string;
  loading?: boolean;
  visible?: boolean;
  setVisible?: (visible: boolean) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: any;
  dark?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordProps>(
  (props, ref) => {
    const {
      name = 'password',
      inputType = 'password',
      placeholder = 'Password',
      loading = false,
      visible: propsVisible,
      setVisible: propsSetVisible,
      onChange,
      error,
      ...rest
    } = props;

    const [pwdInput, setPwdInput] = useState(false);
    let [localVis, setLocalVis] = useState(propsVisible || false);
    const localRef = useRef(null);
    const r = ref || localRef;

    const visible = propsVisible || localVis;
    const setVisible = propsSetVisible || setLocalVis;

    const animationOptions = {
      loop: false,
      autoplay: false,
      animationData: visibilityV2Dark,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    };

    return (
      <>
        {props.loading ? (
          <InputPulseDiv />
        ) : (
          <TextInputWrapper className={passwordStyles.passwordInputContainer}>
            <input
              name={name}
              type={visible ? 'text' : 'password'}
              placeholder={placeholder}
              ref={r}
              onChange={(e) => {
                e.target.value.length > 0
                  ? setPwdInput(true)
                  : setPwdInput(false);
                onChange && onChange(e);
              }}
              {...rest}
            />
            {pwdInput && inputType != 'confirm-password' && (
              <div
                onClick={(e) => {
                  setVisible(!visible);
                }}
                className={passwordStyles.passwordVisibilityIcon}
                tabIndex={0}
              >
                <LottieView
                  direction={visible ? 1 : -1}
                  speed={2}
                  style={{
                    width: 32,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  options={animationOptions}
                />
              </div>
            )}
            {error &&
              (error.type === 'required' ||
                error.msg?.includes('required')) && (
                <FormErrorTip error={{ type: 'required' }} />
              )}
          </TextInputWrapper>
        )}
      </>
    );
  }
);

export const PhoneInput = forwardRef<
  HTMLInputElement,
  React.HTMLProps<HTMLInputElement>
>((props, ref) => {
  const [value, setValue] = useState('');
  const { onChange, ...rest } = props;

  const handleAutoFormat = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Auto format like (000) 000-0000 and only except numbers
    let formatted = value.replace(/[^0-9]/g, '');
    formatted = formatted.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

    setValue(formatted);
  };

  return (
    <TextInputWrapper>
      <input
        name="phone"
        type="tel"
        placeholder="(000) 000-0000"
        autoComplete="tel"
        value={value}
        onChange={(e) => {
          handleAutoFormat(e);
          if (onChange) {
            onChange(e);
          }
        }}
        ref={ref}
        {...rest}
        autoFocus
        required
      />
    </TextInputWrapper>
  );
});
