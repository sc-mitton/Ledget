import PersonLight from './personlight.png'
import PersonDark from './persondark.png'

const Person = ({ dark }: { dark: boolean }) => {
    return dark
        ? <img style={{ height: '3em' }} src={PersonDark} alt="desert" />
        : <img style={{ height: '3em' }} src={PersonLight} alt="desert" />
}

export default Person
