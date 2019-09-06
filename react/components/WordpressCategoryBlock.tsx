import React, { Fragment } from 'react';
import CategoryPosts from '../graphql/CategoryPosts.graphql';
import { compose, graphql, DataProps } from 'react-apollo';
import { Spinner, Button } from 'vtex.styleguide';
import WordpressTeaser from './WordpressTeaser';
import withSettings from './withSettings';

import styles from './categoryblock.css';

const WordpressCategoryBlock: StorefrontFunctionComponent<DataPropsExtended> =
    ({ appSettings, appSettings: { blogRoute }, category, title, description, useTextOverlays, showDates, showAuthors, showExcerpts,
        customLinkText, customLinkTarget, data: { loading, error, wpCategory } }) => {

        const route = (blogRoute && blogRoute !== "") ? blogRoute : 'blog'

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
                                        settings={appSettings}
                                    />
                                </div>
                            ))}
                        </div>
                        <a href={ customLinkTarget != "" ? customLinkTarget : route + "/category/" + category } className={`${styles.categoryBlockLink}`}>
                            <Button variation="secondary" block>
                                { customLinkText != "" ? customLinkText : `All ${wpCategory.name} Posts >`}
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
    withSettings,
    graphql(CategoryPosts, { options: ({ category, props }: { category: number, props: WPCategoryBlockProps }) => ({
        variables: {
            category,
            wp_per_page: props.numberOfPosts
        }, 
        errorPolicy: "all"
    })
}))(WordpressCategoryBlock)

interface WPCategoryBlockProps {
    category: number
    title: string
    description: string
    customLinkText: string
    customLinkTarget: string
    numberOfPosts: number
    useTextOverlays: boolean
    showDates: boolean
    showAuthors: boolean
    showExcerpts: boolean
    appSettings: AppSettings
}

interface AppSettings {
	titleTag: string
	blogRoute: string
}

type DataPropsExtended = WPCategoryBlockProps & DataProps<any, any>;

EnhancedWordpressCategoryBlock.defaultProps = {
    category: 1,
    title: '',
    description: '',
    customLinkText: '',
    customLinkTarget: '',
    numberOfPosts: 3,
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
        customLinkText: {
            title: 'admin/editor.wordpressCategoryBlockCustomLinkText.title',
            description: 'admin/editor.wordpressCategoryBlockCustomLinkText.description',
            type: 'string',
            isLayout: false,
            default: ''
        },
        customLinkTarget: {
            title: 'admin/editor.wordpressCategoryBlockCustomLinkTarget.title',
            description: 'admin/editor.wordpressCategoryBlockCustomLinkTarget.description',
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