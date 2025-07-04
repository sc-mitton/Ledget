import React, { FC, useRef, useEffect, useState, HTMLProps } from 'react';

import { useController, Control } from 'react-hook-form';
import { ChevronUp, ChevronDown } from '@geist-ui/icons';

import styles from './styles/text.module.scss';
import Emoji from './Emoji';
import { EmojiProps, emoji } from './Emoji';
import { formatCurrency, makeIntCurrencyFromStr } from '@ledget/helpers';
import {
  FadedIconButton,
  TextInputWrapper,
  FormErrorTip,
  FormError,
} from '@ledget/ui';

export const EmojiPicker = (props: EmojiProps) => {
  const { emoji: propsEmoji, setEmoji: propsSetEmoji } = props;

  const [em, setEm] = useState<emoji>();
  const emoji = propsEmoji || em;
  const setEmoji = propsSetEmoji || setEm;

  return (
    <div className={styles.emojiPickerContainer}>
      <Emoji emoji={emoji} setEmoji={setEmoji}>
        {({ emoji }) => (
          <>
            <div className={styles.emojiPickerLedgetButtonContainer}>
              <Emoji.Button emoji={emoji} />
            </div>
            <Emoji.Picker />
            <input
              type="hidden"
              name="emoji"
              value={typeof emoji === 'string' ? emoji : emoji?.native}
            />
          </>
        )}
      </Emoji>
    </div>
  );
};

interface IncrementDecrement {
  val: string;
  setVal: React.Dispatch<React.SetStateAction<string>>;
  field?: { onChange: (newVal: number) => void };
  withCents?: boolean;
}

type IncrementFunction = (args: IncrementDecrement) => void;

const increment: IncrementFunction = ({ val, setVal, field, withCents }) => {
  let newVal: number;
  if (!val || val === '' || val === '$0' || val === '$0.00') {
    newVal = 100;
  } else {
    newVal = makeIntCurrencyFromStr(val);
    newVal += Math.pow(10, Math.floor(Math.log10(newVal)));
  }

  field?.onChange(newVal);
  setVal(formatCurrency(newVal, withCents));
};

const decrement: IncrementFunction = ({ val, setVal, field, withCents }) => {
  let newVal;
  if (!val) {
    newVal = 0;
  } else {
    newVal = makeIntCurrencyFromStr(val);
  }

  newVal -= Math.pow(10, Math.floor(Math.log10(newVal)));
  if (newVal < 0) {
    newVal = 0;
  }
  field?.onChange(newVal);
  setVal(formatCurrency(newVal, withCents));
};

const IncrementDecrementButton = ({
  val,
  setVal,
  field,
  withCents = true,
}: IncrementDecrement) => (
  <div className={styles.incrementArrowsContainer}>
    <FadedIconButton
      type="button"
      onClick={() => increment({ val, setVal, field, withCents })}
      aria-label="increment"
      tabIndex={-1}
    >
      <ChevronUp size={'1.25em'} />
    </FadedIconButton>
    <FadedIconButton
      type="button"
      onClick={() => decrement({ val, setVal, field, withCents })}
      aria-label="decrement"
      tabIndex={-1}
    >
      <ChevronDown size={'1.25em'} />
    </FadedIconButton>
  </div>
);

export const LimitAmountInput: FC<
  HTMLProps<HTMLInputElement> & {
    control?: Control<any>;
    defaultValue?: number;
    hasLabel?: boolean;
    withCents?: boolean;
    slim?: boolean;
  }
> = ({
  control,
  defaultValue,
  children,
  hasLabel = true,
  withCents = true,
  required = true,
  slim = false,
  onChange,
  value,
  ...rest
}) => {
  const [val, setVal] = useState<string>('');

  const { field } = useController({
    control,
    name: rest.name || 'limit_amount',
    rules: { required },
  });

  // set field value to default if present
  useEffect(() => {
    if (defaultValue) {
      field.onChange(formatCurrency(defaultValue, withCents));
      setVal(formatCurrency(defaultValue, withCents));
    }
  }, [defaultValue]);

  // Update controller value
  useEffect(() => {
    if (val) {
      field.onChange(parseFloat(val.replace(/[^0-9.]/g, '')));
    }
  }, [val]);

  return (
    <>
      {hasLabel && <label htmlFor="limit">Limit</label>}

      <TextInputWrapper
        slim={slim}
        className={styles.limitAmountContainer}
        data-valid={val ? 'true' : 'false'}
        onBlur={() => {
          (val === '$0' || val === '$0.00') && setVal('');
        }}
      >
        <input
          type="text"
          name="limit_amount"
          id="limit_amount"
          placeholder={withCents ? '$0.00' : '$0'}
          value={val}
          ref={field.ref}
          onKeyDown={(e) => {
            if (e.key === 'Right' || e.key === 'ArrowRight') {
              e.preventDefault();
              increment({ val, setVal, field });
            } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
              e.preventDefault();
              decrement({ val, setVal, field });
            }
          }}
          onChange={(e) => {
            const newVal = formatCurrency(e.target.value, withCents);
            setVal(newVal);
            onChange?.(e);
          }}
          onFocus={(e) => {
            if (e.target.value.length <= 1 || val === '$0') {
              withCents ? setVal('$0.00') : setVal('$0');
            }
          }}
          onBlur={(e) => {
            e.target.value.length <= 1 && setVal('');
          }}
          size={14}
          {...rest}
        />
        <IncrementDecrementButton
          val={val}
          setVal={setVal}
          field={field}
          withCents={withCents}
        />
        {children}
      </TextInputWrapper>
    </>
  );
};

export const DollarRangeInput = ({
  control,
  defaultLowerValue,
  defaultUpperValue,
  errors,
  hasLabel = true,
  rangeMode = false,
  onLowerChange,
  onUpperChange,
}: {
  control?: Control<any>;
  errors?: any;
  defaultLowerValue?: number;
  defaultUpperValue?: number;
  hasLabel?: boolean;
  rangeMode?: boolean;
  onLowerChange?: (val: string) => void;
  onUpperChange?: (val: string) => void;
}) => {
  return (
    <>
      {hasLabel && <label htmlFor="upper_amount">Amount</label>}
      <div
        className={styles.dollarRangeInputContainer}
        data-mode={rangeMode ? 'range' : 'single'}
      >
        {rangeMode && (
          <LimitAmountInput
            hasLabel={false}
            defaultValue={defaultLowerValue}
            control={control}
            name={'lower_amount'}
            onChange={(e: any) => {
              const target = parseInt(e.target.value.replace(/[^0-9]/g, ''));
              const newVal = formatCurrency(target, true);
              onLowerChange?.(newVal);
            }}
          >
            <FormErrorTip error={errors.lower_amount && errors.lower_amount} />
          </LimitAmountInput>
        )}
        <LimitAmountInput
          hasLabel={false}
          defaultValue={defaultUpperValue}
          control={control}
          name={'upper_amount'}
          onChange={(e: any) => {
            const target = parseInt(e.target.value.replace(/[^0-9]/g, ''));
            const newVal = formatCurrency(target, true);
            onUpperChange?.(newVal);
          }}
        >
          <FormErrorTip error={errors.upper_amount && errors.upper_amount} />
        </LimitAmountInput>
      </div>
      {errors.lower_amount?.type !== 'required' &&
        errors.lower_amount?.message.toLowerCase() !== 'required' && (
          <FormError msg={errors.lower_amount?.message} />
        )}
    </>
  );
};
