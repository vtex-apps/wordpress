import React, { Fragment } from 'react';
import TagPosts from '../graphql/TagPosts.graphql';
import { compose, graphql, DataProps } from 'react-apollo';
import WordpressTeaser from './WordpressTeaser';
import withSettingsNoSSR from './withSettingsNoSSR';

import styles from './relatedpostsblock.css';

const WordpressRelatedPostsBlock: StorefrontFunctionComponent<DataPropsExtended> =
    ({ productQuery: { product }, appSettings, title, useTextOverlays, showCategories, showDates, showAuthors, showExcerpts,
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
                                <div key={index} className={`${styles.relatedPostsBlockFlexItem} mv3 w-33-l ph2 w-100-s`}>
                                    <WordpressTeaser
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
                                        settings={appSettings}
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
    withSettingsNoSSR,
    graphql(TagPosts, { options: (props: DataPropsExtended) => ({
        variables: {
            wp_per_page: props.numberOfPosts,
            tag: "prod-" + props.productQuery.product.productReference
        }, 
        errorPolicy: "all",
        ssr: false
    }) })
)(WordpressRelatedPostsBlock)

interface WPRelatedPostsBlockProps {
    title: string
    numberOfPosts: number
    useTextOverlays: boolean
    showCategories: boolean
    showDates: boolean
    showAuthors: boolean
    showExcerpts: boolean
    appSettings: AppSettings
    productQuery: ProductQuery
}

interface AppSettings {
	titleTag: string
	blogRoute: string
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
    numberOfPosts: 3,
    useTextOverlays: false,
    showCategories: true,
    showDates: true,
    showAuthors: false,
    showExcerpts: false
}

EnhancedWordpressRelatedPostsBlock.schema = {
    title: 'admin/editor.wordpressRelatedPosts.title',
    description: 'admin/editor.wordpressRelatedPosts.descriptions',
    type: 'object',
    properties: {
        title: {
            title: 'admin/editor.wordpressRelatedPostsTitle.title',
            description: 'admin/editor.wordpressRelatedPostsTitle.description',
            type: 'string',
            isLayout: false,
            default: ''
        },
        numberOfPosts: {
            title: 'admin/editor.wordpressNumberOfPosts.title',
            description: 'admin/editor.wordpressNumberOfPosts.description',
            type: 'number',
            isLayout: false,
            default: 3
        },
        useTextOverlays: {
            title: 'admin/editor.wordpressOverlays.title',
            description: 'admin/editor.wordpressOverlays.description',
            type: 'boolean',
            isLayout: false,
            default: false
        },
        showCategories: {
            title: 'admin/editor.wordpressCategories.title',
            description: 'admin/editor.wordpressCategories.description',
            type: 'boolean',
            isLayout: false,
            default: true
        },
        showDates: {
            title: 'admin/editor.wordpressDates.title',
            description: 'admin/editor.wordpressDates.description',
            type: 'boolean',
            isLayout: false,
            default: true
        },
        showAuthors: {
            title: 'admin/editor.wordpressAuthors.title',
            description: 'admin/editor.wordpressAuthors.description',
            type: 'boolean',
            isLayout: false,
            default: false
        },
        showExcerpts: {
            title: 'admin/editor.wordpressExcerpts.title',
            description: 'admin/editor.wordpressExcerpts.description',
            type: 'boolean',
            isLayout: false,
            default: false
        }
    }

}

export default EnhancedWordpressRelatedPostsBlock