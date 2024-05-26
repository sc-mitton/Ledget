import { useState, Fragment, createContext, useContext } from 'react'

import { useNavigate, useLocation } from 'react-router-dom'

import './styles/SpendingCategories.scss'
import { useAppSelector, useAppDispatch } from '@hooks/store'
import { selectBudgetMonthYear } from '@features/budgetItemMetaDataSlice'
import { useGetCategoriesQuery } from '@features/categorySlice'
import { Category } from '@features/categorySlice'
import {
    ColoredShimmer,
    CircleIconButton,
    Tooltip,
    BillCatEmojiLabel,
    DollarCents,
    Window
} from '@ledget/ui'
import { setCategoryModal } from '@features/modalSlice'
import { selectBudgetItemsSort } from '@features/uiSlice'
import { EditBudgetCategories } from '@modals/index'
import { Plus, Edit2 } from '@geist-ui/icons'

const ModalContext = createContext<{ modal: boolean, setModal: (modal: boolean) => void } | undefined>(undefined)
const useModalContext = () => {
    const context = useContext(ModalContext)
    if (context === undefined) {
        throw new Error('useModalContext must be used within a ModalProvider')
    }
    return context
}
const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [modal, setModal] = useState(false)
    return (
        <ModalContext.Provider value={{ modal, setModal }}>
            {children}
        </ModalContext.Provider>
    )
}

// Budget Page

// Add total spent somewhere in the category ui component

// Add total progress bar to category windows

// Add note for when yearly categories reload

// Add little note in categories header showing number of categories

// Header underline for bills window

// Filters for bills and categories


// SECURITY

// Add privacy and terms links at bottom of side nav (make it look more complete)


const SkeletonCategories = ({ length, period }: { length: number, period: 'month' | 'year' }) => (
    <>
        {Array.from({ length: length }).map((_, i) => (
            <ColoredShimmer className='category-shimmer' shimmering={true} color={period === 'month' ? 'blue' : 'green'} />
        ))}
    </>
)

const CategoriesList = ({ period }: { period: Category['period'] }) => {
    const { month, year } = useAppSelector(selectBudgetMonthYear)
    const { data: categories, isLoading } = useGetCategoriesQuery({ month, year }, { skip: !month || !year })
    const sort = useAppSelector(selectBudgetItemsSort)
    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { setModal } = useModalContext()

    return (
        <div className='categories'>
            <div>
                <h4>{`${period.charAt(0).toUpperCase()}${period.slice(1)}ly`}</h4>
                <div>
                    <Tooltip msg={`Edit Categories`} >
                        <CircleIconButton onClick={() => { setModal(true) }} aria-label='Edit Categories'>
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
            <hr />
            {isLoading
                ? <><SkeletonCategories length={5} period={period} /><div></div></>
                : <div>
                    {categories?.filter(c => c.period === period)
                        .sort((a, b) => {
                            if (sort === 'amount-des') {
                                return b.amount_spent - a.amount_spent
                            } else if (sort === 'amount-asc') {
                                return a.amount_spent - b.amount_spent
                            } else if (sort === 'alpha-des') {
                                return a.name.localeCompare(b.name)
                            } else if (sort === 'alpha-asc') {
                                return b.name.localeCompare(a.name)
                            } else {
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

const ColumnView = () => (
    <div id='spending-categories--columns'>
        <Window>
            <CategoriesList period='month' />
        </Window>
        <Window>
            <CategoriesList period='year' />
        </Window>
    </div>
)

const SpendingCategories = () => {
    const { modal, setModal } = useModalContext()

    return (
        <>
            <div id='spending-categories'>
                <h2>Categories</h2>
                <ColumnView />
            </div>
            {modal && <EditBudgetCategories onClose={() => setModal(false)} />}
        </>
    )
}

export default function () {
    return (
        <ModalProvider>
            <SpendingCategories />
        </ModalProvider>
    )
}
