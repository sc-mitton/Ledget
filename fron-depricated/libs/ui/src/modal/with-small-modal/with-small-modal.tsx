import { withModal } from '../with-modal/with-modal'
import { WithModalI } from '../with-modal/with-modal'

export function withSmallModal<P>(WrappedComponent: React.FC<P & { closeModal: () => void }>) {
  const ModalComponent = withModal<P>(WrappedComponent)

  return (props: WithModalI & P) => {
    return <ModalComponent maxWidth="300px" {...props} />
  }
}
