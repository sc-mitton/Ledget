import { withModal } from '../with-modal/with-modal'
import { WithModalI } from '../with-modal/with-modal'

export const withSmallModal = (WrappedComponent: React.FC<any>) => {
  const ModalComponent = withModal(WrappedComponent)

  return (props: WithModalI) => {
    return <ModalComponent maxWidth="300px" {...props} />
  }
}
