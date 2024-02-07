
import Desert from './desert.svg'

const DesertImage = () => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
            }}
        >
            <img
                style={{
                    height: '10em',
                }}
                src={Desert} alt="desert"
            />
        </div>
    )
}

export default DesertImage
