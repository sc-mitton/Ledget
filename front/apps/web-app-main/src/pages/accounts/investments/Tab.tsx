import styles from './styles.module.scss';
import Transactions from './transactions/Table';
import Holdings from './holdings/Holdings';
import Chart from './chart/Chart';

const Tab = () => {
  return (
    <div className={styles.container}>
      <div>
        <Chart />
        <Holdings />
      </div>
      <Transactions />
    </div>
  );
};

export default Tab;
