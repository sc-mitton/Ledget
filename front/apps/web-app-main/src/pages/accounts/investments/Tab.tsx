import styles from './styles.module.scss';
import Transactions from './transactions/Table';
import Chart from './chart/Chart';

const Tab = () => {
  return (
    <div className={styles.container}>
      <div>
        <Chart />
      </div>
      <Transactions />
    </div>
  );
};

export default Tab;
