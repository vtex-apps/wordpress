import React, { Fragment } from 'react'
import AllPosts from '../graphql/AllPosts.graphql'
import { compose, graphql, DataProps } from 'react-apollo'
import { defineMessages } from 'react-intl'
import { Spinner } from 'vtex.styleguide'
import WordpressTeaser from './WordpressTeaser'
import withSettingsNoSSR from './withSettings'

import styles from './latestpostsblock.css'

const WordpressLatestPostsBlock: StorefrontFunctionComponent<DataPropsExtended> =
    ({ appSettings, title, twoColumns, useTextOverlays, showCategories, showDates, showAuthors, showExcerpts,
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
                            {(twoColumns) ? (
                                <Fragment>
                                    <div key={0} className={`${styles.latestPostsBlockFlexFirstColumnItem} mv3 ph2 w-100-s`}>
                                        <WordpressTeaser
                                            title={wpPosts.posts[0].title.rendered}
                                            date={wpPosts.posts[0].date}
                                            id={wpPosts.posts[0].id}
                                            author={wpPosts.posts[0].author != null ? wpPosts.posts[0].author.name : ""}
                                            excerpt={wpPosts.posts[0].excerpt.rendered}
                                            category={wpPosts.posts[0].categories[0] != null ? wpPosts.posts[0].categories[0].name : ""}
                                            categoryId={wpPosts.posts[0].categories[0] != null ? wpPosts.posts[0].categories[0].id : undefined}
                                            image={wpPosts.posts[0].featured_media != null ? wpPosts.posts[0].featured_media.source_url : ""}
                                            altText={wpPosts.posts[0].featured_media != null ? wpPosts.posts[0].featured_media.alt_text : ""}
                                            mediaType={wpPosts.posts[0].featured_media != null ? wpPosts.posts[0].featured_media.media_type : ""}
                                            showCategory={showCategories}
                                            showDate={showDates}
                                            showAuthor={showAuthors}
                                            showExcerpt={showExcerpts}
                                            useTextOverlay={useTextOverlays}
                                            settings={appSettings}
                                        />
                                    </div>
                                    <div className={`${styles.latestPostsBlockFlexSecondColumn} mv3 ph2 w-100-s`}>
                                        { wpPosts.posts.slice(1).map((post: PostData, index: number) => (
                                            <div key={index} className={`${styles.latestPostsBlockFlexSecondColumnItem} mv1 w-100-l w-100-s`}>
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
                                wpPosts.posts.map((post: PostData, index: number) => (
                                    <div key={index} className={`${styles.latestPostsBlockFlexItem} mv3 w-33-l ph2 w-100-s`}>
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
                                )
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
    withSettingsNoSSR,
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
    twoColumns: boolean
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
    twoColumns: false,
    numberOfPosts: 3,
    useTextOverlays: false,
    showCategories: true,
    showDates: true,
    showAuthors: false,
    showExcerpts: false
}

const messages = defineMessages({
    title: {
      defaultMessage: '',
      id: 'admin/editor.wordpressLatestPosts.title',
    },
    description: {
      defaultMessage: '',
      id: 'admin/editor.wordpressLatestPosts.description',
    },
    titleTitle: {
        defaultMessage: '',
        id: 'admin/editor.wordpressLatestPostsTitle.title'
    },
    titleDescription: {
        defaultMessage: '',
        id: 'admin/editor.wordpressLatestPostsTitle.description'
    },
    twoColumnsTitle: {
        defaultMessage: '',
        id: 'admin/editor.wordpressTwoColumns.title'
    },
    twoColumnsDescription: {
        defaultMessage: '',
        id: 'admin/editor.wordpressTwoColumns.description'
    },
    numberOfPostsTitle: {
        defaultMessage: '',
        id: 'admin/editor.wordpressNumberOfPosts.title'
    },
    numberOfPostsDescription: {
        defaultMessage: '',
        id: 'admin/editor.wordpressNumberOfPosts.description'
    },
    useTextOverlaysTitle: {
        defaultMessage: '',
        id: 'admin/editor.wordpressOverlays.title'
    },
    useTextOverlaysDescription: {
        defaultMessage: '',
        id: 'admin/editor.wordpressOverlays.description'
    },
    showCategoriesTitle: {
        defaultMessage: '',
        id: 'admin/editor.wordpressCategories.title'
    },
    showCategoriesDescription: {
        defaultMessage: '',
        id: 'admin/editor.wordpressCategories.description'
    },
    showDatesTitle: {
        defaultMessage: '',
        id: 'admin/editor.wordpressDates.title'
    },
    showDatesDescription: {
        defaultMessage: '',
        id: 'admin/editor.wordpressDates.description'
    },  
    showAuthorsTitle: {
        defaultMessage: '',
        id: 'admin/editor.wordpressAuthors.title'
    },
    showAuthorsDescription: {
        defaultMessage: '',
        id: 'admin/editor.wordpressAuthors.description'
    },
    showExcerptsTitle: {
        defaultMessage: '',
        id: 'admin/editor.wordpressExcerpts.title'
    },
    showExcerptsDescription: {
        defaultMessage: '',
        id: 'admin/editor.wordpressExcerpts.description'
    }
  })

EnhancedWordpressLatestPostsBlock.schema = {
    title: messages.title.id,
    description: messages.description.id,
    type: 'object',
    properties: {
        title: {
            title: messages.titleTitle.id,
            description: messages.titleDescription.id,
            type: 'string',
            isLayout: false,
            default: ''
        },
        twoColumns: {
            title: messages.twoColumnsTitle.id,
            description: messages.twoColumnsDescription.id,
            type: 'boolean',
            isLayout: false,
            default: false
        },
        numberOfPosts: {
            title: messages.numberOfPostsTitle.id,    
            description: messages.numberOfPostsDescription.id,
            type: 'number',
            isLayout: false,
            default: 3
        },
        useTextOverlays: {
            title: messages.useTextOverlaysTitle.id,
            description: messages.useTextOverlaysDescription.id,
            type: 'boolean',
            isLayout: false,
            default: false
        },
        showCategories: {
            title: messages.showCategoriesTitle.id,
            description: messages.showCategoriesDescription.id,
            type: 'boolean',
            isLayout: false,
            default: true
        },
        showDates: {
            title: messages.showDatesTitle.id,
            description: messages.showDatesDescription.id,
            type: 'boolean',
            isLayout: false,
            default: true
        },
        showAuthors: {
            title: messages.showAuthorsTitle.id,
            description: messages.showAuthorsDescription.id,
            type: 'boolean',
            isLayout: false,
            default: false
        },
        showExcerpts: {
            title: messages.showExcerptsTitle.id,
            description: messages.showExcerptsDescription.id,
            type: 'boolean',
            isLayout: false,
            default: false
        }
    }

}

export default EnhancedWordpressLatestPostsBlock