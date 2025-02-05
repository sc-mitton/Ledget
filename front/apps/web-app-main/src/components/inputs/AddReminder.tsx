import { Control } from 'react-hook-form';
import { Check, Plus } from '@geist-ui/icons';

import styles from './styles/dropdowns.module.scss';
import { BakedListBox, FormInputButton2 } from '@ledget/ui';
import { useGetRemindersQuery, Reminder } from '@ledget/shared-features';

interface ReminderOption {
  value: {
    offset: Reminder['offset'];
    period: Reminder['period'];
  };
  id: string;
  label: string;
}

interface Props {
  control: Control<any>;
  name: string;
}

const AddReminder = (props: Props) => {
  const { data: reminders } = useGetRemindersQuery();

  return (
    <div>
      <BakedListBox
        placement="left"
        placeholder="Add"
        name={props.name}
        indicatorIcon="plus"
        renderLabel={(label, _, selected) => (
          <div className={styles.dropdownItemLabel}>
            <span>{label}</span>
            {selected ? (
              <Check className="icon small" />
            ) : (
              <Plus className="icon small" />
            )}
          </div>
        )}
        renderSelected={(val) => (
          <div className={styles.addReminderBtn}>
            <div>
              <span>{val.length}</span>
              <span>Reminder{val.length > 1 ? 's' : ''}</span>
            </div>
            <Check className="icon" />
          </div>
        )}
        as={FormInputButton2}
        control={props.control}
        options={
          reminders?.map((r) => ({
            value: {
              offset: r.offset,
              period: r.period,
            },
            label: `${r.offset} ${r.period}${r.offset > 1 ? 's' : ''}`,
            id: r.id,
          })) || ([] as ReminderOption[])
        }
        multiple
      />
    </div>
  );
};

export default AddReminder;
