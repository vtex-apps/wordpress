import React, { Component, Fragment } from 'react'
import SearchPosts from './graphql/SearchPosts.graphql'
import withSettingsNoSSR from './components/withSettingsNoSSR'
import withSearchContext from './components/withSearchContext'
import { compose, graphql, DataProps } from 'react-apollo'
import { Spinner, Pagination } from 'vtex.styleguide'
import { Container } from 'vtex.store-components'
import WordpressTeaser from './components/WordpressTeaser'
import listStyles from './components/list.css'
import searchStyles from './components/searchlist.css'

interface otherProps {
	appSettings: AppSettings
	searchQuery: any
}
interface AppSettings {
	titleTag: string
	blogRoute: string
}
type DataPropsExtended = DataProps<any, any> & otherProps

class WordpressSearchResult extends Component<DataPropsExtended> {
	state = {
		page: 1,
		per_page: 10
	};
	render() {
        const { appSettings, searchQuery, data: { fetchMore, loading, error, wpPosts } } = this.props;
		
		if (searchQuery == null && searchQuery.productSearch == null) return null
		
		return (
			<Fragment>
               
                <h2 className={`${listStyles.listTitle} ${searchStyles.searchListTitle} t-heading-2 tc`}>Article search results for "{searchQuery.productSearch.titleTag}"</h2>
					
				<Container className={`${listStyles.listContainer} ${searchStyles.searchListContainer} pt2 pb8`}>
					<div className="ph3">
						<Pagination
							rowsOptions={[10, 20, 30, 40]}
							currentItemFrom={this.state.page * this.state.per_page - this.state.per_page + 1}
							currentItemTo={this.state.page * this.state.per_page}
							textOf="of"
							textShowRows="posts per page"
							totalItems={wpPosts != null ? wpPosts.total_count : 0}
							onRowsChange={(event: any) => {
								const firstPage = 1;
								const perPage = event.target.value;
								this.setState({ per_page: event.target.value, page: 1 });
								fetchMore({
									variables: {
										wp_page: firstPage,
										wp_per_page: perPage,
										terms: searchQuery.productSearch.titleTag
									},
									updateQuery: (prev, { fetchMoreResult }) => {
										if (!fetchMoreResult) return prev;
										return fetchMoreResult;
									}
								});
							}}
							onPrevClick={() => {
								if (this.state.page > 1) {
									const prevPage = this.state.page - 1;
									this.setState({ page: this.state.page - 1 });
									fetchMore({
										variables: {
											wp_page: prevPage,
											wp_per_page: this.state.per_page,
										    terms: searchQuery.productSearch.titleTag
										},
										updateQuery: (prev, { fetchMoreResult }) => {
											if (!fetchMoreResult) return prev;
											return fetchMoreResult;
										}
									});
								}
							}}
							onNextClick={() => {
								const nextPage = this.state.page + 1;
								this.setState({ page: this.state.page + 1 });
								fetchMore({
									variables: {
										wp_page: nextPage,
										wp_per_page: this.state.per_page,
										terms: searchQuery.productSearch.titleTag
									},
									updateQuery: (prev, { fetchMoreResult }) => {
										if (!fetchMoreResult) return prev;
										return fetchMoreResult;
									}
								});
							}}
						/>
					</div>
					{loading && (
						<div className="mv5 flex justify-center" style={{ minHeight: 800 }}>
							<Spinner />
						</div>
					)}
					{error && (
						<div className="ph5" style={{ minHeight: 800 }}>
							Error: {error.message}
						</div>
					)}
					{wpPosts ? (
						<div className={`${listStyles.listFlex} ${searchStyles.searchListFlex} mv4 flex flex-row flex-wrap`}>
							{wpPosts.posts.map((post: PostData, index: number) => (
								<div key={index} className={`${listStyles.listFlexItem} ${searchStyles.searchListFlexItem} mv3 w-100-s w-50-l ph4`}>
									<WordpressTeaser
										title={post.title.rendered}
										author={post.author.name}
										category={post.categories[0] != null ? post.categories[0].name: ""}
										categoryId={post.categories[0] != null ? post.categories[0].id : undefined}
										excerpt={post.excerpt.rendered}
										date={post.date}
										id={post.id}
										image={post.featured_media != null ? post.featured_media.source_url : ""}
										altText={post.featured_media != null ? post.featured_media.alt_text : ""}
										mediaType={post.featured_media != null ? post.featured_media.media_type : ""}
										showAuthor={false}
										showCategory={true}
										showDate={true}
										showExcerpt={true}
										useTextOverlay={false}
										settings={appSettings}
									/>
								</div>
							))}
						</div>
					) : (
							<div>
								<h2>No posts found.</h2>
							</div>
						)}
				</Container>
			</Fragment>
		);
	}
}

export default compose(
	withSearchContext,
	withSettingsNoSSR,
	graphql(SearchPosts,
		{
			options: (props: DataPropsExtended) => (
				{
					variables: { terms: (props.searchQuery && props.searchQuery.productSearch) ? props.searchQuery.productSearch.titleTag : null },
					notifyOnNetworkStatusChange: true,
					ssr: false
				})
		})
)(WordpressSearchResult);