import sharedStyles from '../styles/shared-styles';
import { Box, CarouselDots, Text } from '@ledget/native-ui';

const Header = ({ index }: { index: number }) => {
  return (
    <>
      <Box backgroundColor='mainBackground' style={sharedStyles.boxHeader}>
        <Text fontSize={15} color='tertiaryText'>Bills</Text>
      </Box>
      <Box variant='nestedContainer' style={sharedStyles.headerContainer}>
        <Box style={sharedStyles.carouselDots} backgroundColor='nestedContainer'>
          <CarouselDots length={2} currentIndex={index} />
        </Box>
      </Box>
    </>
  )
}
export default Header
