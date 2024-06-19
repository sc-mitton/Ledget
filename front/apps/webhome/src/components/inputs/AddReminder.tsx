import React, { useState, Dispatch, SetStateAction, useEffect } from 'react';

import { Plus, Check } from '@geist-ui/icons';

import styles from './styles/dropdowns.module.scss';
import { Listbox } from '@headlessui/react';
import { FormInputButton2, DropdownDiv, DropdownItem } from '@ledget/ui';
import { useGetRemindersQuery, Reminder } from '@ledget/shared-features';

const AddReminder = ({
  value,
  onChange,
  defaultSelected
}: {
  value?: Reminder[];
  defaultSelected?: string[];
  onChange?: Dispatch<SetStateAction<Reminder[] | undefined>>;
}) => {
  const [localSelectedReminders, localSetReminders] = useState<Reminder[]>([]);
  const [reminderOptions, setReminderOptions] = useState<Reminder[]>([]);
  const { data: reminders, isSuccess } = useGetRemindersQuery();

  useEffect(() => {
    isSuccess && setReminderOptions(reminders);
  }, [isSuccess]);

  const selectedReminders = value || localSelectedReminders;
  const setSelectedReminders = onChange || localSetReminders;

  const Option = ({
    value,
    active,
    selected
  }: {
    value: Reminder;
    active: boolean;
    selected: boolean;
  }) => {
    const opIndex = reminderOptions.findIndex((op) => op === value);
    const nextOp = reminderOptions[opIndex + 1];

    return (
      <>
        <DropdownItem
          active={active}
          selected={selected}
          style={{ justifyContent: 'space-between' }}
        >
          <div>
            {value.offset}
            {value.offset > 1 ? ` ${value.period}s` : ` ${value.period}`}
            <span
              style={{
                opacity: active ? '.5' : '0',
                padding: '0 .5em',
                fontWeight: '400'
              }}
            >
              before
            </span>
          </div>
          {!selected ? <Plus size={'1em'} /> : <Check size={'1em'} />}
        </DropdownItem>
        <div style={{ padding: '0 .5em' }}>
          {nextOp && nextOp.period !== value.period && <hr />}
        </div>
      </>
    );
  };

  const Options = () => {
    return reminderOptions.map((option) => (
      <Listbox.Option value={option} disabled={!option.active} key={option.id}>
        {({ active, selected }) => (
          <Option value={option} active={active} selected={selected} />
        )}
      </Listbox.Option>
    ));
  };

  return (
    <div>
      <Listbox
        name="reminders"
        value={selectedReminders}
        onChange={
          setSelectedReminders as React.Dispatch<
            React.SetStateAction<Reminder[]>
          >
        }
        multiple
      >
        {({ open }) => (
          <>
            <Listbox.Button
              as={FormInputButton2}
              className={styles.addReminderBtn}
              style={{ fontWeight: '400' }}
            >
              <span>Reminder</span>
              {selectedReminders.length > 0 ? (
                <Check size={'1em'} />
              ) : (
                <Plus size={'1em'} />
              )}
            </Listbox.Button>
            <Listbox.Options className={styles.selectContainer} static>
              <DropdownDiv placement="left" visible={open}>
                <Options />
              </DropdownDiv>
            </Listbox.Options>
          </>
        )}
      </Listbox>
    </div>
  );
};

export default AddReminder;
