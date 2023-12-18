
import Desert from './desert.svg'

const DesertImage = () => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '70%',
                textAlign: 'center',
            }}
        >
            <img
                style={{
                    marginBottom: '-70px',
                    height: '23em',
                    width: '23em',
                }}
                src={Desert} alt="desert"
            />
        </div>
    )
}

export default DesertImage
