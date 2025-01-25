import { Fragment, useMemo } from 'react';

import dayjs from 'dayjs';

import styles from './styles.module.scss';
import { useAppSelector, useAppDispatch } from '@hooks/store';
import {
  Tooltip,
  BillCatEmojiLabel,
  DollarCents,
  ProgressBar,
} from '@ledget/ui';
import {
  useGetMeQuery,
  selectBudgetMonthYear,
  useGetCategoriesQuery,
  Category,
  selectCategoryOrder,
} from '@ledget/shared-features';
import { setModal } from '@features/modalSlice';
import SkeletonCategories from './Skeleton';

const CategoriesList = ({ period }: { period: Category['period'] }) => {
  const { month, year } = useAppSelector(selectBudgetMonthYear);
  const { data: user } = useGetMeQuery();
  const { data: categories, isLoading } = useGetCategoriesQuery(
    { month, year },
    { skip: !month || !year }
  );
  const order = useAppSelector(selectCategoryOrder);
  const dispatch = useAppDispatch();

  const totalSpent = useMemo(() => {
    if (categories) {
      return categories
        ?.filter((c) => c.period === period)
        .reduce((acc, c) => acc + c.amount_spent, 0);
    } else {
      return 0;
    }
  }, [categories, period]);

  const totalLimit = useMemo(() => {
    if (categories) {
      return categories
        ?.filter((c) => c.period === period)
        .reduce((acc, c) => acc + c.limit_amount, 0);
    } else {
      return 0;
    }
  }, [categories, period]);

  return (
    <div className={styles.categories}>
      <div>
        {period === 'year' ? (
          <Tooltip
            delay={0.2}
            msg={
              user?.yearly_anchor
                ? `Yearly categories reload on ${dayjs(
                    user?.yearly_anchor
                  ).format('MMM D')}`
                : 'No yearly categories set yet'
            }
          >
            <h3>{`${period.charAt(0).toUpperCase()}${period.slice(
              1
            )}ly Spending`}</h3>
          </Tooltip>
        ) : (
          <h3>{`${period.charAt(0).toUpperCase()}${period.slice(
            1
          )}ly Spending`}</h3>
        )}
      </div>
      <div className={period === 'month' ? styles.month : styles.year}>
        <h4>
          <DollarCents value={totalSpent} withCents={false} />
        </h4>
        &nbsp;&nbsp;<span>spent of</span>&nbsp;&nbsp;
        <h4>
          <DollarCents value={totalLimit} withCents={false} />
        </h4>
      </div>
      <div className={period === 'month' ? styles.month : styles.year}>
        <ProgressBar
          progress={Math.round(((totalSpent * 100) / totalLimit) * 100) / 100}
          // progress={50}
        />
      </div>
      {isLoading ? (
        <div>
          <SkeletonCategories length={5} period={period} />
        </div>
      ) : (
        <div className={styles.grid}>
          {categories
            ?.filter((c) => c.period === period)
            .sort((a, b) => {
              switch (order) {
                case 'nameAsc':
                  return a.name.localeCompare(b.name);
                case 'nameDesc':
                  return b.name.localeCompare(a.name);
                case 'amountAsc':
                  return a.limit_amount - b.limit_amount;
                case 'amountDesc':
                  return b.limit_amount - a.limit_amount;
                default:
                  return 0;
              }
            })
            .map((category, i) => (
              <Fragment key={category.id}>
                <button
                  onClick={() => {
                    dispatch(
                      setModal({
                        name: 'category',
                        args: { category: category },
                      })
                    );
                  }}
                >
                  <BillCatEmojiLabel
                    size="medium"
                    as="button"
                    emoji={category.emoji}
                    color={period === 'month' ? 'blue' : 'green'}
                    key={category.id}
                    progress={
                      Math.round(
                        ((category.amount_spent * 100) /
                          category.limit_amount) *
                          100
                      ) / 100
                    }
                  />
                  {`${category.name
                    .charAt(0)
                    .toUpperCase()}${category.name.slice(1)}`}
                </button>
                <div>
                  <DollarCents
                    value={category.amount_spent}
                    withCents={false}
                  />
                </div>
                <div>/</div>
                <div>
                  {category.limit_amount !== null ? (
                    <DollarCents
                      value={category.limit_amount}
                      withCents={false}
                    />
                  ) : (
                    <span className="no-limit"> &#8212; </span>
                  )}
                </div>
              </Fragment>
            ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesList;
