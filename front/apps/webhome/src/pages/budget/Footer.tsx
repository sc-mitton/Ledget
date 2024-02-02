import { useState, useRef, useEffect } from 'react'

import { ArrowDown, ArrowUp } from '@geist-ui/icons'

import './styles/Footer.scss'
import { useAppDispatch, useAppSelector } from '@hooks/store'
import {
    sortCategoriesAlpha,
    sortCategoriesAmountAsc,
    sortCategoriesAmountDesc,
    sortCategoriesDefault,
    selectCategoriesSorting
} from '@features/categorySlice'
import {
    sortBillsByAlpha,
    sortBillsByDate,
    sortBillsByAmountAsc,
    sortBillsByAmountDesc,
    selectBillsSorting
} from '@features/billSlice'
import { EditBudgetCategories, EditBudgetBills } from '@modals/index'
import { PillOptionButton, FadedTextButton, IconButton3, Tooltip } from '@ledget/ui'
import { FilterLines } from '@ledget/media'

const Footer = () => {
    const dispatch = useAppDispatch()
    const categorySorting = useAppSelector(selectCategoriesSorting)
    const billSorting = useAppSelector(selectBillsSorting)
    const [modal, setModal] = useState<'categories' | 'bills' | ''>('')
    const filterButtonsContainer = useRef<HTMLDivElement>(null)
    const [showFilterButtons, setShowFilterButtons] = useState(false)

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (filterButtonsContainer.current && !filterButtonsContainer.current.contains(e.target as Node)) {
                setShowFilterButtons(false)
            }
        }
        document.addEventListener('click', handleClick)
        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, [filterButtonsContainer])

    return (
        <>
            {modal === 'categories' && <EditBudgetCategories onClose={() => { setModal('') }} />}
            {modal === 'bills' && <EditBudgetBills onClose={() => { setModal('') }} />}
            <div id="budget-footer">
                <div>
                    <span>View All</span>
                    <div>
                        <FadedTextButton onClick={() => setModal('categories')}>
                            Categories
                        </FadedTextButton>
                        <FadedTextButton onClick={() => setModal('bills')}>
                            Bills
                        </FadedTextButton>
                    </div>
                </div>
                <div ref={filterButtonsContainer}>
                    <div id='filter-buttons' className={`${showFilterButtons ? 'show' : ''}`}>
                        <PillOptionButton
                            isSelected={['amount-desc', 'amount-asc'].includes(billSorting)
                                || ['amount-desc', 'amount-asc'].includes(categorySorting)}
                            onClick={() => {
                                if (!['amount-desc', 'amount-asc'].includes(billSorting)
                                    || !['amount-desc', 'amount-asc'].includes(categorySorting)) {
                                    dispatch(sortBillsByAmountDesc())
                                    dispatch(sortCategoriesAmountDesc())
                                } else if (billSorting === 'amount-desc' || categorySorting === 'amount-desc') {
                                    dispatch(sortBillsByAmountAsc())
                                    dispatch(sortCategoriesAmountAsc())
                                } else {
                                    dispatch(sortBillsByDate())
                                    dispatch(sortCategoriesDefault())
                                }
                            }}
                        >
                            <span>$</span>
                            {billSorting === 'amount-desc'
                                ? <ArrowDown size={'1em'} strokeWidth={1.5} />
                                : <ArrowUp size={'1em'} strokeWidth={1.5} />}
                        </PillOptionButton>
                        <PillOptionButton
                            aria-label="Sort bills by amount"
                            isSelected={billSorting === 'alpha' || categorySorting === 'alpha'}
                            onClick={() => {
                                if (billSorting === 'alpha' || categorySorting === 'alpha') {
                                    dispatch(sortBillsByDate())
                                    dispatch(sortCategoriesDefault())
                                } else {
                                    dispatch(sortBillsByAlpha())
                                    dispatch(sortCategoriesAlpha())
                                }
                            }}
                        >
                            a-z
                        </PillOptionButton>
                    </div>
                    <Tooltip msg="Filter" ariaLabel="Filter">
                        <IconButton3
                            onClick={() => { setShowFilterButtons(!showFilterButtons) }}>
                            <FilterLines stroke={(billSorting !== 'date' || categorySorting !== 'default') ? 'var(--blue-medium)' : 'currentColor'} />
                        </IconButton3>
                    </Tooltip>
                </div>
            </div>
        </>
    )
}

export default Footer
