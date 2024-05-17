
import keylight from './keylight.png'
import keydark from './keydark.png'

const Key = ({ dark }: { dark: boolean }) => {
    return dark
        ? <img style={{ height: '3em' }} src={keydark} alt="desert" />
        : <img style={{ height: '3em' }} src={keylight} alt="desert" />
}

export default Key
