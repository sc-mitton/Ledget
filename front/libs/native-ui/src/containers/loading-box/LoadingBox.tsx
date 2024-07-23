
import styles from './styles';
import { Box, BoxProps } from "../../restyled/Box";
import { Spinner } from "../../animated/loading-indicators/Spinner";

export const LoadingBox = ({ loading, style, children, ...rest }: BoxProps & { loading?: boolean }) => {

  return (
    <Box {...rest} style={[styles.loadingBox, style]}>
      {loading &&
        <>
          <Spinner />
          <Box style={styles.overlay} backgroundColor='mainBackground' />
        </>}
      {children}
    </Box>
  );
};
