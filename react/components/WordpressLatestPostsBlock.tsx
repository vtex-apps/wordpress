import React, { Fragment } from 'react';
import AllPosts from '../graphql/AllPosts.graphql';
import { compose, graphql, DataProps } from 'react-apollo';
import { Spinner } from 'vtex.styleguide';
import WordpressTeaser from './WordpressTeaser';
import withSettings from './withSettings';

import styles from './latestpostsblock.css';

const WordpressLatestPostsBlock: StorefrontFunctionComponent<DataPropsExtended> =
    ({ appSettings, title, useTextOverlays, showCategories, showDates, showAuthors, showExcerpts,
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
                                        settings={appSettings}
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
    withSettings,
    graphql(AllPosts, { options: (props: WPLatestPostsBlockProps) => ({
        variables: {
            wp_per_page: props.numberOfPosts
        }, 
        errorPolicy: "all",
        ssr: false
    }) })
)(WordpressLatestPostsBlock)

interface WPLatestPostsBlockProps {
    title: string
    numberOfPosts: number
    useTextOverlays: boolean
    showCategories: boolean
    showDates: boolean
    showAuthors: boolean
    showExcerpts: boolean
    appSettings: AppSettings
}

interface AppSettings {
	titleTag: string
	blogRoute: string
}

type DataPropsExtended = WPLatestPostsBlockProps & DataProps<any, any>;

EnhancedWordpressLatestPostsBlock.defaultProps = {
    title: '',
    numberOfPosts: 3,
    useTextOverlays: false,
    showCategories: true,
    showDates: true,
    showAuthors: false,
    showExcerpts: false
}

EnhancedWordpressLatestPostsBlock.schema = {
    title: 'admin/editor.wordpressLatestPosts.title',
    description: 'admin/editor.wordpressLatestPosts.description',
    type: 'object',
    properties: {
        title: {
            title: 'admin/editor.wordpressLatestPostsTitle.title',
            description: 'admin/editor.wordpressLatestPostsTitle.description',
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

export default EnhancedWordpressLatestPostsBlock