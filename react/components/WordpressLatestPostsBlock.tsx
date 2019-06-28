import React, { Fragment } from 'react';
import AllPosts from '../graphql/AllPosts.graphql';
import { compose, graphql, DataProps } from 'react-apollo';
import { Spinner, Button } from 'vtex.styleguide';
import WordpressTeaser from './WordpressTeaser';

import styles from './latestpostsblock.css';

const WordpressLatestPostsBlock: StorefrontFunctionComponent<DataPropsExtended> =
    ({ title, useTextOverlays, showCategories, showDates, showAuthors, showExcerpts,
        data: { loading, error, wpPosts } }) => {
        return (
            <div className={`${styles.latestPostsBlockContainer} pv4 pb9`}>
                {loading && (
                    <Spinner />
                )}
                {error && (
                    <span>Error: {error.message}</span>
                )}
                {(wpPosts != null) ? (
                    <Fragment>
                        <h2 className={`${styles.latestPostsBlockTitle} t-heading-2`}>{title}</h2>
                        <div className={`${styles.latestPostsBlockFlex} mv4 flex flex-row flex-wrap justify-between`}>
                            {wpPosts.posts.map((post: PostData, index: number) => (
                                <div className={`${styles.latestPostsBlockFlexItem} mv3 w-33-l ph2 w-100-s`}>
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
                    !loading && !error && (
                        <div>
                            <h3 className="t-heading-3">No posts found.</h3>
                        </div>
                    ))}
            </div>
        );

    }

const EnhancedWordpressLatestPostsBlock = compose(
    graphql(AllPosts, { options: () => ({
        variables: {
            wp_per_page: 3
        }, 
        errorPolicy: "all"
    }) })
)(WordpressLatestPostsBlock)

interface WPLatestPostsBlockProps {
    title: string
    useTextOverlays: boolean
    showCategories: boolean
    showDates: boolean
    showAuthors: boolean
    showExcerpts: boolean
}

type DataPropsExtended = WPLatestPostsBlockProps & DataProps<any, any>;

EnhancedWordpressLatestPostsBlock.defaultProps = {
    title: '',
    useTextOverlays: false,
    showCategories: true,
    showDates: true,
    showAuthors: false,
    showExcerpts: false
}

EnhancedWordpressLatestPostsBlock.schema = {
    title: 'Wordpress Latest Posts Block',
    description: 'Displays the most recent three posts from Wordpress',
    type: 'object',
    properties: {
        title: {
            title: 'Block Title',
            description: 'A title to be shown at top of latest posts block',
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

export default EnhancedWordpressLatestPostsBlock