
import EnvelopeLight from './envelopelight.png'
import EnvelopeDark from './envelopedark.png'

const EnvelopeImage = ({ dark }: { dark: boolean }) => {
    return dark
        ? <img style={{ height: '3.75em' }} src={EnvelopeDark} alt="desert" />
        : <img style={{ height: '3.75em' }} src={EnvelopeLight} alt="desert" />
}

export default EnvelopeImage
