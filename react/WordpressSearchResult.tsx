import React, { Component, Fragment } from 'react';
import SearchPosts from './graphql/SearchPosts.graphql';
import { compose, graphql, DataProps } from 'react-apollo';
import { Spinner, Pagination } from 'vtex.styleguide';
import { Container } from 'vtex.store-components';
import WordpressTeaser from './components/WordpressTeaser';
import Helmet from 'react-helmet';
import styles from './components/list.css'

type Params = {
	params: any
}
type DataPropsWithParams = DataProps<any, any> & Params

class WordpressSearchResult extends Component<DataPropsWithParams> {
	state = {
		page: 1,
		per_page: 10
	};
	render() {
        const { params, data: { fetchMore, loading, error, wpPosts } } = this.props;
        if (!params || !params.terms) return null
		return (
			<Fragment>
				
                <Helmet>
                    <title>Article search results for "{decodeURIComponent(params.terms)}"</title>
                </Helmet>
                <h2 className={`${styles.listTitle} t-heading-2 tc`}>Article search results for "{decodeURIComponent(params.terms)}"</h2>
					
				<Container className={`${styles.listContainer} pt2 pb8`}>
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
										terms: params.terms
									},
									updateQuery: (prev, { fetchMoreResult }) => {
										if (!fetchMoreResult) return prev;
										return fetchMoreResult;
									}
								});
							}}
							onPrevClick={(event: any) => {
								if (this.state.page > 1) {
									const prevPage = this.state.page - 1;
									this.setState({ page: this.state.page - 1 });
									fetchMore({
										variables: {
											wp_page: prevPage,
											wp_per_page: this.state.per_page,
										    terms: params.terms
										},
										updateQuery: (prev, { fetchMoreResult }) => {
											if (!fetchMoreResult) return prev;
											return fetchMoreResult;
										}
									});
								}
							}}
							onNextClick={(event: any) => {
								const nextPage = this.state.page + 1;
								this.setState({ page: this.state.page + 1 });
								fetchMore({
									variables: {
										wp_page: nextPage,
										wp_per_page: this.state.per_page,
										terms: params.terms
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
					{wpPosts != null ? (
						<div className={`${styles.listFlex} mv4 flex flex-row flex-wrap`}>
							{wpPosts.posts.map((post: PostData, index: number) => (
								<div className={`${styles.listFlexItem} mv3 w-100-s w-50-l ph4`}>
									<WordpressTeaser
										key={index}
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
	graphql(SearchPosts,
		{
			options: (props: DataPropsWithParams) => (
				{
					variables: { terms: props.params.terms },
					notifyOnNetworkStatusChange: true
				})
		})
)(WordpressSearchResult);