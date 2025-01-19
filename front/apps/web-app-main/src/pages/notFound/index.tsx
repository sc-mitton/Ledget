import styles from './styles.module.scss';
import { useNavigate } from 'react-router-dom';
import { TextButtonBlue } from '@ledget/ui';
import { MainWindow } from '@ledget/ui';
import { ChevronRight } from '@geist-ui/icons';

const NotFound = ({ hasBackground = true }) => {
  const navigate = useNavigate();

  return (
    <MainWindow
      className={styles.window}
      style={{
        ...(!hasBackground
          ? { backgroundColor: 'none', boxShadow: 'none' }
          : {}),
      }}
    >
      <div>
        <h1>404 Not Found</h1>
        <TextButtonBlue
          aria-label="Return home"
          onClick={() => navigate('/budget')}
        >
          Return home
          <ChevronRight size={'1em'} strokeWidth={2} />
        </TextButtonBlue>
      </div>
    </MainWindow>
  );
};

export default NotFound;
