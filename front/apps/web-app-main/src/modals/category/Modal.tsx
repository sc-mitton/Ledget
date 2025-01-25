import { withModal } from '@ledget/ui';
import { Category as CategoryT } from '@ledget/shared-features';
import Context from './Context';
import { AnimatePresence } from 'framer-motion';

import Menu from './Menu';

const Category = withModal<{ category: CategoryT }>((props) => {
  return (
    <Context category={props.category}>
      <Menu />
      <AnimatePresence mode="wait"></AnimatePresence>
    </Context>
  );
});

export default Category;
