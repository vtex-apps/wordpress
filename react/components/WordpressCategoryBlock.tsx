import React, { Fragment } from 'react';
import CategoryPosts from '../graphql/CategoryPosts.graphql';
import { compose, graphql, DataProps } from 'react-apollo';
import { Spinner, Button } from 'vtex.styleguide';
import WordpressTeaser from './WordpressTeaser';

import styles from './categoryblock.css';

const WordpressCategoryBlock: StorefrontFunctionComponent<DataPropsExtended> =
    ({ category, description, useTextOverlays, showDates, showAuthors, showExcerpts,
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
                        <h2 className={`${styles.categoryBlockTitle} t-heading-2`}>{wpCategory.name}</h2>
                        { description != "" && (
                            <h4 className={`${styles.categoryBlockDescription} t-heading-4`}>
                                {description}
                            </h4>
                        )}
                        <div className={`${styles.categoryBlockFlex} mv4 flex flex-row`}>
                            {wpCategory.wpPosts.posts.map((post: PostData, index: number) => (
                                <div className={`${styles.categoryBlockFlexItem} mv3 w-33 ph2`}>
                                    <WordpressTeaser
                                        key={index}
                                        title={post.title.rendered}
                                        date={post.date}
                                        id={post.id}
                                        author={post.author.name}
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
                        <div>
                            <h3 className="t-heading-3">No posts found.</h3>
                        </div>
                    )}
            </div>
        );

    }

const options = {
    options: ({
        category
    }: {
        category: number
    }) => ({
        variables: {
            category,
            wp_per_page: 3
        }
    })
}

const EnhancedWordpressCategoryBlock = compose(
    graphql(CategoryPosts, options),
)(WordpressCategoryBlock)

interface WPCategoryBlockProps {
    category: number
    description: string
    useTextOverlays: boolean
    showDates: boolean
    showAuthors: boolean
    showExcerpts: boolean
}

type DataPropsExtended = WPCategoryBlockProps & DataProps<any, any>;

EnhancedWordpressCategoryBlock.defaultProps = {
    category: 1,
    description: '',
    useTextOverlays: false,
    showDates: true,
    showAuthors: false,
    showExcerpts: false
}

EnhancedWordpressCategoryBlock.schema = {
    title: 'Wordpress Category Block',
    description: 'Displays the most recent three posts from a given WP category',
    type: 'object',
    properties: {
        category: {
            title: 'Wordpress Category ID',
            description: 'Numeric ID of desired Wordpress category',
            type: 'number',
            isLayout: false,
            default: 1
        },
        description: {
            title: 'Wordpress Category Description',
            description: 'A short description to be shown at top of category block',
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

export default EnhancedWordpressCategoryBlock