import React, { Fragment } from 'react';
import TagPosts from '../graphql/TagPosts.graphql';
import { compose, graphql, DataProps } from 'react-apollo';
import WordpressTeaser from './WordpressTeaser';

import styles from './relatedpostsblock.css';

const WordpressRelatedPostsBlock: StorefrontFunctionComponent<DataPropsExtended> =
    ({ productQuery: { product }, title, useTextOverlays, showCategories, showDates, showAuthors, showExcerpts,
        data: { loading, error, wpTags } }) => {
        return (
            <div className={`${styles.relatedPostsBlockContainer} pv4 pb9`}>
                {loading && (
                    <Fragment />
                )}
                {error && (
                    <Fragment />
                )}
                {(wpTags != null && wpTags.tags[0] != null && wpTags.tags[0].wpPosts != null
                && "prod-" + product.productReference == wpTags.tags[0].name) ? (
                    <Fragment>
                        <h2 className={`${styles.relatedPostsBlockTitle} t-heading-2`}>{title}</h2>
                        <div className={`${styles.relatedPostsBlockFlex} mv4 flex flex-row flex-wrap justify-between`}>
                            {wpTags.tags[0].wpPosts.posts.map((post: PostData, index: number) => (
                                <div className={`${styles.relatedPostsBlockFlexItem} mv3 w-33-l ph2 w-100-s`}>
                                    <WordpressTeaser
                                        key={index}
                                        title={post.title.rendered}
                                        date={post.date}
                                        id={post.id}
                                        author={post.author != null ? post.author.name : ""}
                                        excerpt={post.excerpt.rendered}
                                        category={post.categories[0] != null ? post.categories[0].name : ""}
                                        categoryId={post.categories[0] != null ? post.categories[0].id : undefined}
                                        image={post.featured_media != null ? post.featured_media.source_url : ""}
                                        altText={post.featured_media != null ? post.featured_media.alt_text : ""}
                                        mediaType={post.featured_media != null ? post.featured_media.media_type : ""}
                                        showCategory={showCategories}
                                        showDate={showDates}
                                        showAuthor={showAuthors}
                                        showExcerpt={showExcerpts}
                                        useTextOverlay={useTextOverlays}
                                    />
                                </div>
                            ))}
                        </div>
                    </Fragment>
                ) : ( 
                    <Fragment />
                )}
            </div>
        );

    }

const EnhancedWordpressRelatedPostsBlock = compose(
    graphql(TagPosts, { options: (props: DataPropsExtended) => ({
        variables: {
            wp_per_page: 3,
            tag: "prod-" + props.productQuery.product.productReference
        }, 
        errorPolicy: "all"
    }) })
)(WordpressRelatedPostsBlock)

interface WPRelatedPostsBlockProps {
    title: string
    useTextOverlays: boolean
    showCategories: boolean
    showDates: boolean
    showAuthors: boolean
    showExcerpts: boolean
    productQuery: ProductQuery
}

interface ProductProperties {
    name: string
    values: [string]
}

interface ProductImage {
    imageId: string
    imageLabel: string
    imageTag: string
    imageUrl: string
    imageText: string
}

interface ProductOffer {
    Installments: [ProductInstallment]
    Price: number
    ListPrice: number
    AvailableQuantity: number
}

interface ProductInstallment {
    Value: number
    InterestRate: number
    TotalValuePlusInterestRate: number
    NumberOfInstallments: number
    Name: string
}

interface ProductSeller {
    sellerId: string
    commertialOffer: ProductOffer
}

interface ProductItem {
    itemId: string
    name: string
    images: [ProductImage]
    sellers: [ProductSeller]
}

interface ProductShape {
    productId: string
    productName: string
    description: string
    properties: [ProductProperties]
    productReference: string
    brand: string
    items: [ProductItem]
    sellers: [ProductSeller]
}

interface ProductQuery {
    product: ProductShape
    loading: boolean
}

type DataPropsExtended = WPRelatedPostsBlockProps & DataProps<any, any>;

EnhancedWordpressRelatedPostsBlock.defaultProps = {
    title: 'Related Articles',
    useTextOverlays: false,
    showCategories: true,
    showDates: true,
    showAuthors: false,
    showExcerpts: false
}

EnhancedWordpressRelatedPostsBlock.schema = {
    title: 'Wordpress Related Posts Block',
    description: 'Displays the most recent three posts from Wordpress tagged with a given product reference code',
    type: 'object',
    properties: {
        title: {
            title: 'Block Title',
            description: 'A title to be shown at top of related posts block',
            type: 'string',
            isLayout: false,
            default: ''
        },
        useTextOverlays: {
            title: 'Use Text Overlays',
            description: 'Overlay post title and meta info on top of post image',
            type: 'boolean',
            isLayout: false,
            default: false
        },
        showCategories: {
            title: 'Show Categories',
            description: 'Show first category of each post',
            type: 'boolean',
            isLayout: false,
            default: true
        },
        showDates: {
            title: 'Show Dates',
            description: 'Show date that each post was posted',
            type: 'boolean',
            isLayout: false,
            default: true
        },
        showAuthors: {
            title: 'Show Authors',
            description: 'Show author of each post',
            type: 'boolean',
            isLayout: false,
            default: false
        },
        showExcerpts: {
            title: 'Show Excerpts',
            description: 'Show excerpt for each post',
            type: 'boolean',
            isLayout: false,
            default: false
        }
    }

}

export default EnhancedWordpressRelatedPostsBlock