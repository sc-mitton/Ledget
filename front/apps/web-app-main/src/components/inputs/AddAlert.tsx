import { useState, useRef, useEffect } from 'react';

import Big from 'big.js';
import { Control, useController } from 'react-hook-form';
import { Plus, CornerDownLeft, ChevronDown, Check } from '@geist-ui/icons';

import styles from './styles/dropdowns.module.scss';
import {
  FormInputButton2,
  MenuTextInput,
  DropdownDiv,
  DollarCents,
  DropdownItem,
  ComboSelect,
} from '@ledget/ui';

const baseAlertOptions = [
  { id: 1, value: { percent_amount: 25 }, disabled: false },
  { id: 2, value: { percent_amount: 50 }, disabled: false },
  { id: 3, value: { percent_amount: 75 }, disabled: false },
  { id: 4, value: { percent_amount: 100 }, disabled: false },
];

const AddAlert = (props: {
  limitAmount?: number;
  defaultValues?: (typeof baseAlertOptions)[0]['value'][];
  control: Control<any>;
}) => {
  const { limitAmount, defaultValues } = props;
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [selectedAlerts, setSelectedAlerts] = useState(defaultValues);
  const [alertOptions, setAlertOptions] = useState(baseAlertOptions);

  const CustomOption = () => {
    const ref = useRef<HTMLInputElement>(null);
    const [pct, setPct] = useState('');

    useEffect(() => {
      if (ref.current) {
        ref.current.selectionEnd = pct.indexOf('%');
        ref.current.selectionStart = pct.indexOf('%');
      }
    }, [pct]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
      setPct(`${newValue}%`);
    };

    const handleFocus = () => {
      if (!ref.current) return;
      ref.current.selectionEnd = pct.indexOf('%');
      ref.current.selectionStart = pct.indexOf('%');
    };

    const transformValue = () => ({
      id: alertOptions.length + 1,
      value: {
        percent_amount: parseInt(pct.replace(/[^0-9]/g, '') || '0', 10),
      },
      disabled: false,
    });

    return (
      <div className={styles.customInput}>
        <ComboSelect.Custom
          ref={ref}
          placeholder="Custom..."
          onChange={handleChange}
          transformValue={() => transformValue()}
          onFocus={() => handleFocus()}
          onBlur={() => {
            setPct('');
          }}
          value={pct}
          size={7}
        >
          {({ focused }) => (
            <>
              <DollarCents
                withCents={false}
                value={Big(limitAmount || 0)
                  .times(parseInt(pct.replace(/[^0-9]/g, '') || '0', 10))
                  .div(100)
                  .toNumber()}
                style={{
                  opacity: focused ? '.5' : '0',
                  marginRight: '.5em',
                }}
              />
              <div
                className={styles.returnBtn}
                data-focused={focused}
                role="button"
                aria-label="Add custom alert"
              >
                <CornerDownLeft size={'1em'} />
              </div>
            </>
          )}
        </ComboSelect.Custom>
      </div>
    );
  };

  const Options = () =>
    alertOptions
      .sort((a, b) => a.value.percent_amount - b.value.percent_amount)
      .map((option) => (
        <ComboSelect.Option
          option={option}
          disabled={option.disabled}
          key={option.id}
        >
          {({ active, selected }) => (
            <DropdownItem
              active={active}
              selected={selected}
              className={styles.selectItem}
            >
              <div>{option.value.percent_amount}%</div>
              <div>
                <DollarCents
                  withCents={false}
                  value={Big(limitAmount || 0)
                    .times(option.value.percent_amount)
                    .div(100)
                    .toNumber()}
                />
              </div>
              <div>{selected && <Check className="icon" />}</div>
            </DropdownItem>
          )}
        </ComboSelect.Option>
      ));

  const ButtonText = () => (
    <>
      {selectedAlerts && selectedAlerts?.length > 0 && (
        <div
          className={styles.addAlertBtn}
          data-selected={selectedAlerts?.length > 0}
        >
          <span className={styles.numberOfAlertsCircle}>
            {`${selectedAlerts.length}`}
          </span>
          {`${selectedAlerts.length == 1 ? 'Alert' : 'Alerts'}`}
        </div>
      )}
      {!selectedAlerts?.length && <span>Add Alert</span>}
      {selectedAlerts?.length ? (
        <ChevronDown className="icon" />
      ) : (
        <Plus className="icon" />
      )}
    </>
  );

  const { field } = useController({
    name: 'alerts',
    control: props.control,
    defaultValue: selectedAlerts,
  });

  // Update form value
  useEffect(() => {
    field.onChange(selectedAlerts);
  }, [selectedAlerts]);

  return (
    <ComboSelect
      name="alert"
      value={selectedAlerts}
      onChange={setSelectedAlerts}
      limit={7}
      multiple={true}
      syncOptions={setAlertOptions}
    >
      {({ open }) => (
        <>
          <ComboSelect.Button
            tabIndex={0}
            as={FormInputButton2}
            className={styles.addAlertBtn}
            data-selected={(selectedAlerts?.length || 0) > 0}
            ref={buttonRef}
          >
            <ButtonText />
          </ComboSelect.Button>
          <ComboSelect.Options className={styles.selectContainer} static>
            <DropdownDiv
              placement="left"
              visible={open}
              className={styles.dropdown}
              style={{
                minWidth: buttonRef.current?.offsetWidth,
              }}
            >
              <Options />
              <CustomOption />
            </DropdownDiv>
          </ComboSelect.Options>
        </>
      )}
    </ComboSelect>
  );
};

export default AddAlert;
