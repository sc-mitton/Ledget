import { withModal, SlideMotionDiv, WithModalI } from '@ledget/ui';
import { Category as CategoryT } from '@ledget/shared-features';
import Context from './Context';
import Details from './Details';
import { AnimatePresence } from 'framer-motion';

import { EditCategory } from '../EditCategory';
import { DeleteCategory } from '../DeleteCategoryModal';
import Menu from './Menu';
import { useLoaded } from '@ledget/helpers';
import { useCategoryModalContext } from './Context';

const Category = (props: WithModalI & { category: CategoryT }) => {
  const loaded = useLoaded(1000);
  const { view, setView } = useCategoryModalContext();

  return (
    <>
      {view === 'detail' && <Menu />}
      <AnimatePresence mode="wait">
        {view === 'detail' && (
          <SlideMotionDiv
            key="category-detail"
            position={loaded ? 'first' : 'fixed'}
          >
            <Details />
          </SlideMotionDiv>
        )}
        {view === 'edit' && (
          <SlideMotionDiv key="edit-category" position="last">
            <EditCategory
              category={props.category}
              onClose={() => setView('detail')}
            />
          </SlideMotionDiv>
        )}
        {view === 'delete' && (
          <SlideMotionDiv key="delete-category" position="last">
            <DeleteCategory
              category={props.category}
              onClose={() => setView('detail')}
            />
          </SlideMotionDiv>
        )}
      </AnimatePresence>
    </>
  );
};

export default withModal<{ category: CategoryT }>(function (props) {
  return (
    <Context category={props.category}>
      <Category {...props} />
    </Context>
  );
});
