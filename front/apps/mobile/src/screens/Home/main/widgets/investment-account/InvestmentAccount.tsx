import PickOption from './PickOption'
import Selector from './Selector'
import Filled from './Filled'
import { Props } from './types'

const InvestmentAccount = (props: Props) => {

  return props.id
    ? props.args
      ? <Filled {...props} shape={props.shape} />
      : <Selector {...props} />
    : <PickOption />
}

export default InvestmentAccount
