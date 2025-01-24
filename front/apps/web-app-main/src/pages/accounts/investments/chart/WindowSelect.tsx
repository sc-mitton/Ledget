import { Check } from '@geist-ui/icons';

import styles from './styles/window-select.module.scss';
import {
  selectWindow,
  setInvestmentsScreenWindow,
} from '@features/investmentsTabSlice';
import { useAppDispatch, useAppSelector } from '@hooks/store';
import { StyledMenu, BlueFadedSquareRadio } from '@ledget/ui';
import { useEffect } from 'react';

const options = ['3M', '6M', '1Y', 'MAX'] as const;

const WindowSelect = () => {
  const dispatch = useAppDispatch();
  const window = useAppSelector(selectWindow);

  useEffect(() => {
    if (!window) {
      dispatch(
        setInvestmentsScreenWindow({
          amount: 3,
          period: 'month',
        })
      );
    }
  }, []);

  return (
    <StyledMenu>
      <StyledMenu.Button as={BlueFadedSquareRadio}>
        {window?.period === 'year' && window?.amount === 10
          ? 'MAX'
          : `${window?.amount}${window?.period[0].toUpperCase()}`}
      </StyledMenu.Button>
      <StyledMenu.Items>
        {options.map((o) => (
          <StyledMenu.Item
            className={styles.item}
            data-selected={
              o === `${window?.amount}${window?.period.toUpperCase()[0]}` ||
              (o === 'MAX' && window?.amount === 10 && window.period === 'year')
            }
            renderRight={() => <Check />}
            renderLeft={() => <span>{o}</span>}
            onClick={() => {
              dispatch(
                setInvestmentsScreenWindow({
                  amount: o === 'MAX' ? 10 : parseInt(o[0]),
                  period:
                    o === 'MAX'
                      ? 'year'
                      : o.charAt(o.length - 1).toLowerCase() === 'y'
                      ? 'year'
                      : 'month',
                })
              );
            }}
          />
        ))}
      </StyledMenu.Items>
    </StyledMenu>
  );
};

export default WindowSelect;
