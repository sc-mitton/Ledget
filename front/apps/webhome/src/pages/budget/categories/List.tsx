import { Fragment, useMemo } from 'react'

import { useNavigate, useLocation } from 'react-router-dom'
import Big from 'big.js'
import dayjs from 'dayjs'

import styles from './styles.module.scss'
import { useAppSelector, useAppDispatch } from '@hooks/store'
import { selectBudgetMonthYear } from '@features/budgetItemMetaDataSlice'
import { useGetCategoriesQuery } from '@features/categorySlice'
import { Category } from '@features/categorySlice'
import {
    CircleIconButton,
    Tooltip,
    BillCatEmojiLabel,
    DollarCents,
    ProgressBar
} from '@ledget/ui'
import { useGetMeQuery } from '@features/userSlice'
import { setCategoryModal, setModal } from '@features/modalSlice'
import { Plus, Edit2 } from '@geist-ui/icons'
import SkeletonCategories from './Skeleton'
import { useSortContext } from '../context'

const CategoriesList = ({ period }: { period: Category['period'] }) => {
    const { month, year } = useAppSelector(selectBudgetMonthYear)
    const { data: user } = useGetMeQuery()
    const { data: categories, isLoading } = useGetCategoriesQuery({ month, year }, { skip: !month || !year })
    const { categoriesSort: sort } = useSortContext()
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const totalSpent = useMemo(() => {
        if (categories) {
            return categories?.filter(c => c.period === period).reduce((acc, c) => acc + c.amount_spent, 0)
        } else {
            return 0
        }
    }, [categories, period])

    const totalLimit = useMemo(() => {
        if (categories) {
            return categories?.filter(c => c.period === period).reduce((acc, c) => acc + c.limit_amount, 0)
        } else {
            return 0
        }
    }, [categories, period])

    return (
        <div className={styles.categories}>
            <div>
                {period === 'year'
                    ?
                    <Tooltip delay={.2} msg={
                        user?.yearly_anchor
                            ? `Yearly categories reload on ${dayjs(user?.yearly_anchor).format('MMM D')}`
                            : 'No yearly categories set yet'}>
                        <h4>{`${period.charAt(0).toUpperCase()}${period.slice(1)}ly`}</h4>
                    </Tooltip>
                    :
                    <h4>{`${period.charAt(0).toUpperCase()}${period.slice(1)}ly`}</h4>
                }
                <div>
                    <Tooltip msg={`Edit Categories`} >
                        <CircleIconButton
                            onClick={() => { dispatch(setModal('editCategories')) }}
                            aria-label='Edit Categories'
                        >
                            <Edit2 size='.875em' />
                        </CircleIconButton>
                    </Tooltip>
                    <Tooltip msg={`Add ${period}ly category`} >
                        <CircleIconButton
                            onClick={() => { navigate(`${location.pathname}/new-category/${location.search}`, { state: { period: period } }) }}
                            aria-label='Add new category'
                        >
                            <Plus size='1em' />
                        </CircleIconButton>
                    </Tooltip>
                </div>
            </div>
            <div className={styles[period]}>
                <h4><DollarCents value={totalSpent} withCents={false} /></h4>
                <span>spent of</span>
                <h4><DollarCents value={totalLimit} withCents={false} /></h4>
            </div>
            <div className={`${period}`}>
                <ProgressBar progress={Big(totalSpent).div(Big(totalLimit || 1)).times(100).toNumber()} />
            </div>
            {isLoading
                ? <div>
                    <SkeletonCategories length={5} period={period} />
                </div>
                : <div className={styles.grid}>
                    {categories?.filter(c => c.period === period)
                        .sort((a, b) => {
                            switch (sort) {
                                case 'alpha-asc':
                                    return a.name.localeCompare(b.name)
                                case 'alpha-des':
                                    return b.name.localeCompare(a.name)
                                case 'limit-asc':
                                    return a.limit_amount - b.limit_amount
                                case 'limit-des':
                                    return b.limit_amount - a.limit_amount
                                case 'amount-asc':
                                    return a.amount_spent - b.amount_spent
                                case 'amount-des':
                                    return b.amount_spent - a.amount_spent
                                default:
                                    return 0
                            }
                        }).map((category, i) => (
                            <Fragment key={category.id}>
                                <div>
                                    <BillCatEmojiLabel
                                        size='medium'
                                        as='button'
                                        emoji={category.emoji}
                                        color={period === 'month' ? 'blue' : 'green'}
                                        key={category.id}
                                        onClick={() => { dispatch(setCategoryModal({ category: category })) }}
                                        progress={Math.round(((category.amount_spent * 100) / category.limit_amount) * 100) / 100}
                                    />
                                    {`${category.name.charAt(0).toUpperCase()}${category.name.slice(1)}`}
                                </div>
                                <div>
                                    <DollarCents value={category.amount_spent} withCents={false} />
                                </div>
                                <div>/</div>
                                <div>
                                    {category.limit_amount !== null
                                        ? <DollarCents value={category.limit_amount} withCents={false} />
                                        : <span className='no-limit'> &#8212; </span>}
                                </div>
                            </Fragment>
                        ))}
                </div>}
        </div>
    )
}

export default CategoriesList;
