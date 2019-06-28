import React from 'react'
import { Query, DataProps } from 'react-apollo'

import ProductsByReference from './graphql/ProductsByReference.graphql'
import { WPRelatedProductsContext } from './contexts/WordpressRelatedProducts'

import { ProductList } from 'vtex.shelf'
import styles from './components/shelf.css'

const WordpressRelatedProducts: StorefrontFunctionComponent<DataPropsExtended> = ({ productList }) => {

  return (
    <WPRelatedProductsContext.Consumer>
      {({ productIds }) => (
      <Query<any> query={ProductsByReference} variables={{ ids: productIds }} partialRefetch ssr={false} >
        {({data, loading}) => {
          if (!data) {
            return null
          }
          const { productsByIdentifier } = data
          const productListProps = {
            products: productsByIdentifier || [],
            loading,
            ...productList,
          }
          return (
            <div className={styles.wordpressRelatedProducts}>
              <ProductList {...productListProps} />
            </div>
          )
        }}
      </Query>
      )}
    </WPRelatedProductsContext.Consumer>
  )
}

interface productListSchema {
  /** Maximum number of items in the shelf. */
  maxItems: number
  /** Maximum number of items in a page. */
  itemsPerPage: number
  /** Scroll options. */
  scroll: string
  /** If the arrows are showable or not. */
  arrows: boolean
  /** Show value of the title. */
  showTitle: boolean
  /** Text value of the title. */
  titleText: string
  /** Product Summary schema props */
  summary: any
}

interface WordpressRelatedProductsProps {
  /** Array of product reference codes from blog article tags to have related products queried */
  productIds: [string?]
  /** ProductList schema configuration */
  productList: productListSchema
}

type DataPropsExtended = WordpressRelatedProductsProps & DataProps<any, any>

ProductList.defaultProps = {
  maxItems: 10,
  itemsPerPage: 5,
  scroll: 'BY_PAGE',
  gap: 'ph3',
  arrows: true,
  showTitle: true,
  titleText: null,
  isMobile: false,
}

WordpressRelatedProducts.defaultProps = {
  productIds: [],
  productList: {
    ...ProductList.defaultProps,
    titleText: 'Related Products',
  },
}

WordpressRelatedProducts.getSchema = props => {
  const productListSchema = ProductList.getSchema(props)

  return {
    title: 'admin/editor.wordpressRelatedProducts.title',
    description: 'admin/editor.wordpressRelatedProducts.description',
    type: 'object',
    properties: {
      productList: productListSchema,
    },
  }
}

export default WordpressRelatedProducts
