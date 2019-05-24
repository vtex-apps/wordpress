import React, { Component } from 'react';
import AllPosts from '../graphql/AllPosts.graphql';
import { compose, graphql, DataProps } from 'react-apollo';
import { Spinner, Pagination } from 'vtex.styleguide';
import { Container } from 'vtex.store-components';
import WordpressTeaser from './WordpressTeaser';

class WordpressList extends Component<DataProps<any, any>> {
	state = {
		page: 1,
		per_page: 10
	};
	render() {
		const { data: { fetchMore, loading, error, wpPosts } } = this.props;
		return (
			<Container className="pt6 pb8 bg-muted-5" style={{ maxWidth: 900}}>
				<div className="ph3">
					<Pagination
						rowsOptions={[ 10, 20, 30, 40 ]}
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
									wp_per_page: perPage
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
										wp_per_page: this.state.per_page
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
									wp_per_page: this.state.per_page
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
                    <div className="mv4 flex flex-row flex-wrap">
                        {wpPosts.posts.map((post: PostData, index: number) => (
							<div className="mv3 w-50 ph2">
								<WordpressTeaser
									title={post.title.rendered}
									author={post.author.name}
									category={post.categories[0].name}
									categoryId={post.categories[0].id}
									excerpt={post.excerpt.rendered}
									date={post.date}
									id={post.id}
									image={post.featured_media != null ? post.featured_media.source_url : ""}
									altText={post.featured_media != null ? post.featured_media.alt_text : ""}
									mediaType={post.featured_media != null ? post.featured_media.media_type : ""}
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
		);
	}
}

export default compose(graphql(AllPosts, { options: { notifyOnNetworkStatusChange: true } }))(WordpressList);
