import { View } from 'react-native'

import styles from './styles/widget';
import { useGetCategoriesQuery } from '@ledget/shared-features'
import { useAppDispatch } from '@/hooks'
import Shadow from './Shadow'

const Selector = () => {
  const dispatch = useAppDispatch()

  return (
    <View>

    </View>
  )
}

const Filled = (props: { categories?: string[] }) => {
  const { data: categories } = useGetCategoriesQuery()

  return (
    <View>

    </View>
  )
}

const CategoriesProgress = (props: { categories?: string[] }) => {
  return props.categories
    ? <Filled categories={props.categories} />
    : <Shadow />
}

export default CategoriesProgress
