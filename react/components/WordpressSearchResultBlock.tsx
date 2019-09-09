import React, { Fragment, useContext } from 'react';
import SearchPosts from '../graphql/SearchPosts.graphql';
import { compose, graphql, DataProps } from 'react-apollo';
import { Spinner, Button } from 'vtex.styleguide';
import { QueryContext } from 'vtex.search-result';
import { Link } from 'vtex.render-runtime';
import WordpressTeaser from './WordpressTeaser';
import withSettings from './withSettings';

import styles from './searchresultblock.css';

const WordpressSearchResultBlock: StorefrontFunctionComponent<DataPropsExtended> =
    ({ appSettings, appSettings: { blogRoute }, title, useTextOverlays, showCategories, showDates, showAuthors, showExcerpts,
        data: { loading, error, wpPosts } }) => {

        const { query } = useContext(QueryContext)

        const route = (blogRoute && blogRoute !== "") ? blogRoute : 'blog'

        return (
            <div className={`${styles.searchResultBlockContainer} pv4 pb9`}>
                {(query == null || typeof query == undefined || query == "" ) && (
                    <div>Hello</div>
                )}
                {loading && (
                    <Spinner />
                )}
                {error && (
                    <span>Error: {error.message}</span>
                )}
                {(wpPosts != null) ? (
                    <Fragment>
                        <h2 className={`${styles.searchResultBlockTitle} t-heading-2`}>{title}</h2>
                        <div className={`${styles.searchResultBlockFlex} mv4 flex flex-row flex-wrap justify-between`}>
                            {wpPosts.posts.map((post: PostData, index: number) => (
                                <div className={`${styles.searchResultBlockFlexItem} mv3 w-33-l ph2 w-100-s`}>
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
                        <Link to={ route + "/search/" + query } className={`${styles.searchResultBlockLink}`}>
                            <Button variation="secondary" block>
                                More article results for "{ query }" >    
                            </Button>
                        </Link>
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



const EnhancedWordpressSearchResultBlock = compose(
    withSettings,
    graphql(SearchPosts, { options: (props: WPSearchResultBlockProps) => ({
        variables: {
            wp_per_page: props.numberOfPosts,
            terms: props.searchQuery.query
        }, 
        errorPolicy: "all",
        ssr: false
    }) })
)(WordpressSearchResultBlock)

interface WPSearchResultBlockProps {
    title: string
    numberOfPosts: number
    useTextOverlays: boolean
    showCategories: boolean
    showDates: boolean
    showAuthors: boolean
    showExcerpts: boolean
    searchQuery: SearchQuery
    appSettings: AppSettings
}

interface AppSettings {
	titleTag: string
	blogRoute: string
}

type SearchQuery = {
    map: string
    maxItemsPerPage: number
    orderBy: string
    query: string
    treePath: string
}

type DataPropsExtended = WPSearchResultBlockProps & DataProps<any, any>;

EnhancedWordpressSearchResultBlock.defaultProps = {
    title: '',
    numberOfPosts: 3,
    useTextOverlays: false,
    showCategories: true,
    showDates: true,
    showAuthors: false,
    showExcerpts: false
}

EnhancedWordpressSearchResultBlock.schema = {
    title: 'admin/editor.wordpressSearchResultBlock.title',
    description: 'admin/editor.wordpressSearchResultBlock.description',
    type: 'object',
    properties: {
        title: {
            title: 'admin/editor.wordpressSearchResultBlockTitle.title',
            description: 'admin/editor.wordpressSearchResultBlockTitle.description',
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

export default EnhancedWordpressSearchResultBlock