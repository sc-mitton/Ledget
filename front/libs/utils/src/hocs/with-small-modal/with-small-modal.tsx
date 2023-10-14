import withModal from '../with-modal/with-modal'
import { IWithModal } from '../with-modal/with-modal'

const withSmallModal = (WrappedComponent: React.FC<any>) => {
  const ModalComponent = withModal(WrappedComponent)

  return (props: IWithModal) => {
    return <ModalComponent maxWidth="300px" {...props} />
  }
}

export default withSmallModal
