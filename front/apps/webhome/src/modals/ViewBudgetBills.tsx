import { Fragment, useState } from 'react'

import { Tab } from '@headlessui/react'
import { useSearchParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { AnimatePresence } from 'framer-motion'

import './styles/EditBudgetItems.scss'
import { useGetBillsQuery } from '@features/billSlice'
import { BillModalContent } from '@modals/index'
import {
  withModal,
  TabNavList,
  BillCatLabel,
  getDaySuffix,
  DollarCents,
  SlideMotionDiv,
  BackButton
} from '@ledget/ui'


const getScheduleDescription = (day?: number, week?: number, weekDay?: number, month?: number, year?: number) => {
  if (day && month && year) {
    return dayjs().date(day).month(month - 1).year(year).format('MMMM Do, YYYY')
  } else if (day && month) {
    return dayjs().date(day).month(month - 1).format('MMMM Do')
  } else if (day) {
    return `${day}${getDaySuffix(day)} of the month`
  } else if (week && weekDay) {
    return `Every ${week}${getDaySuffix(week)} ${dayjs().day(weekDay).format('dddd')}`
  }
}

const Bills = ({ period, onBillClick }: {
  period: 'month' | 'year',
  onBillClick: (id: string) => void
}) => {
  const [searchParams] = useSearchParams()
  const { data: bills } = useGetBillsQuery({
    month: searchParams.get('month') || undefined,
    year: searchParams.get('year') || undefined
  })

  return (
    <div className="view-all-bills" key="all-bills">
      {bills?.filter(b => b.period === period)?.length === 0
        ? <div style={{ opacity: .5 }}>No {period}ly bills to display</div>
        :
        <div className="bills-grid">
          {bills?.filter(b => b.period === period).map((bill) => (
            <>
              <div>
                <BillCatLabel
                  key={bill.id}
                  labelName={bill.name}
                  emoji={bill.emoji}
                  color={bill.period === 'month' ? 'blue' : 'green'}
                  onClick={() => onBillClick(bill.id)}
                  tint={true}
                />
              </div>
              <div>
                <div>
                  {bill.lower_amount ? <div><DollarCents value={bill.lower_amount} /> - </div> : <div></div>}
                  {bill.upper_amount ? <div><DollarCents value={bill.upper_amount} /></div> : <div></div>}
                </div>
                {<div>{getScheduleDescription(bill.day, bill.week, bill.week_day, bill.month, bill.year)}</div>}
              </div>
            </>
          ))}
        </div>}
    </div>
  )
}

const EditBills = withModal((props) => {
  const [inspectedBill, setInspectedBill] = useState<string | null>(null)

  return (
    <AnimatePresence mode='wait'>
      {!inspectedBill
        ?
        <SlideMotionDiv key="view-all-bills" position='first'>
          <h2>Bills</h2>
          <Tab.Group as='div' id="view-all-bills--container" className="modal-inner-window">
            {({ selectedIndex }) => (
              <>
                <div>
                  <TabNavList selectedIndex={selectedIndex} labels={['Month', 'Year']} />
                </div>
                <Tab.Panels as={Fragment}>
                  <Tab.Panel as={Fragment}>
                    <Bills period={'month'} onBillClick={setInspectedBill} />
                  </Tab.Panel>
                  <Tab.Panel as={Fragment}>
                    <Bills period={'year'} onBillClick={setInspectedBill} />
                  </Tab.Panel>
                </Tab.Panels>
              </>
            )}
          </Tab.Group>
        </SlideMotionDiv>
        :
        <SlideMotionDiv className="inspected-bill--container" key={inspectedBill} position='last'>
          <BackButton onClick={() => setInspectedBill(null)} />
          <BillModalContent billId={inspectedBill} onClose={() => setInspectedBill(null)} />
        </SlideMotionDiv>}
    </AnimatePresence>
  )
})

const EditBudgetCategoriesModal = ({ onClose }: { onClose: () => void }) => {
  const props = { maxWidth: "25em", onClose }
  return <EditBills {...props} />
}

export default EditBudgetCategoriesModal
