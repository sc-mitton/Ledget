import PickOption from './PickOption'
import { WidgetProps } from '@features/widgetsSlice'
import { useGetInvestmentsQuery } from '@ledget/shared-features'
import Selector from './Selector'
import Filled from './Filled'

const InvestmentAccount = (widget: WidgetProps<{ account: string }>) => {

  const { data: fetchedData } = useGetInvestmendsBalanceHistoryQuery({

  })

  return widget.id
    ? widget.args
      ? <Filled account={widget.args?.account} shape={widget.shape} />
      : <Selector />
    : <PickOption />
}

export default InvestmentAccount
