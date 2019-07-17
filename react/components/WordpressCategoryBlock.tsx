import React, { Fragment } from 'react';
import CategoryPosts from '../graphql/CategoryPosts.graphql';
import { compose, graphql, DataProps } from 'react-apollo';
import { Spinner, Button } from 'vtex.styleguide';
import WordpressTeaser from './WordpressTeaser';

import styles from './categoryblock.css';

const WordpressCategoryBlock: StorefrontFunctionComponent<DataPropsExtended> =
    ({ category, title, description, useTextOverlays, showDates, showAuthors, showExcerpts,
        data: { loading, error, wpCategory } }) => {
        return (
            <div className={`${styles.categoryBlockContainer} pv4 pb9`}>
                {loading && (
                    <Spinner />
                )}
                {error && (
                    <span>Error: {error.message}</span>
                )}
                {(wpCategory != null && wpCategory.wpPosts != null) ? (
                    <Fragment>
                        <h2 className={`${styles.categoryBlockTitle} t-heading-2`}>{title != "" ? title : wpCategory.name}</h2>
                        { description != "" && (
                            <h4 className={`${styles.categoryBlockDescription} t-heading-4`}>
                                {description}
                            </h4>
                        )}
                        <div className={`${styles.categoryBlockFlex} mv4 flex flex-row flex-wrap justify-between`}>
                            {wpCategory.wpPosts.posts.map((post: PostData, index: number) => (
                                <div className={`${styles.categoryBlockFlexItem} mv3 w-33-l ph2 w-100-s`}>
                                    <WordpressTeaser
                                        key={index}
                                        title={post.title.rendered}
                                        date={post.date}
                                        id={post.id}
                                        author={post.author != null ? post.author.name : ""}
                                        excerpt={post.excerpt.rendered}
                                        image={post.featured_media != null ? post.featured_media.source_url : ""}
                                        altText={post.featured_media != null ? post.featured_media.alt_text : ""}
                                        mediaType={post.featured_media != null ? post.featured_media.media_type : ""}
                                        showCategory={false}
                                        showDate={showDates}
                                        showAuthor={showAuthors}
                                        showExcerpt={showExcerpts}
                                        useTextOverlay={useTextOverlays}
                                    />
                                </div>
                            ))}
                        </div>
                        <a href={ "/blog/category/" + category } className={`${styles.categoryBlockLink}`}>
                            <Button variation="secondary" block>
                                All { wpCategory.name } Posts >    
                            </Button>
                        </a>
                    </Fragment>
                ) : (
                    !loading && !error && (
                        <div>
                            <h3 className="t-heading-3">No posts found.</h3>
                        </div>
                    ))}
            </div>
        );

    }

const EnhancedWordpressCategoryBlock = compose(
    graphql(CategoryPosts, { options: ({ category }: { category: number }) => ({
        variables: {
            category,
            wp_per_page: 3
        }, 
        errorPolicy: "all"
    })
}))(WordpressCategoryBlock)

interface WPCategoryBlockProps {
    category: number
    title: string
    description: string
    useTextOverlays: boolean
    showDates: boolean
    showAuthors: boolean
    showExcerpts: boolean
}

type DataPropsExtended = WPCategoryBlockProps & DataProps<any, any>;

EnhancedWordpressCategoryBlock.defaultProps = {
    category: 1,
    title: '',
    description: '',
    useTextOverlays: false,
    showDates: true,
    showAuthors: false,
    showExcerpts: false
}

EnhancedWordpressCategoryBlock.schema = {
    title: 'admin/editor.wordpressCategoryBlock.title',
    description: 'admin/editor.wordpressCategoryBlock.description',
    type: 'object',
    properties: {
        category: {
            title: 'admin/editor.wordpressCategoryBlockCategory.title',
            description: 'admin/editor.wordpressCategoryBlockCategory.description',
            type: 'number',
            isLayout: false,
            default: 1
        },
        title: {
            title: 'admin/editor.wordpressCategoryBlockTitle.title',
            description: 'admin/editor.wordpressCategoryBlockTitle.description',
            type: 'string',
            isLayout: false,
            default: ''
        },
        description: {
            title: 'admin/editor.wordpressCategoryBlockDescription.title',
            description: 'admin/editor.wordpressCategoryBlockDescription.description',
            type: 'string',
            isLayout: false,
            default: ''
        },
        useTextOverlays: {
            title: 'admin/editor.wordpressOverlays.title',
            description: 'admin/editor.wordpressOverlays.description',
            type: 'boolean',
            isLayout: false,
            default: false
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

export default EnhancedWordpressCategoryBlock