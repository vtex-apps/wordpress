import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import SinglePost from './graphql/SinglePost.graphql';
import withSettings from './components/withSettings'
import { compose, graphql, DataProps } from 'react-apollo';
import { Spinner } from 'vtex.styleguide';
import { Container } from 'vtex.store-components';
import SanitizedHTML from 'react-sanitized-html';

import { WPRelatedProductsContext } from './contexts/WordpressRelatedProducts'
import styles from './components/post.css';

interface otherProps {
	appSettings: appSettings
	params: any
}
interface appSettings {
	titleTag: string
}
type DataPropsWithParams = DataProps<any, any> & otherProps

const allowedTags = [
	'h3',
	'h4',
	'h5',
	'h6',
	'blockquote',
	'p',
	'a',
	'ul',
	'ol',
	'nl',
	'li',
	'b',
	'i',
	'strong',
	'em',
	'strike',
	'code',
	'hr',
	'br',
	'div',
	'table',
	'thead',
	'caption',
	'tbody',
	'tr',
	'th',
	'td',
	'pre',
	'img',
	'iframe',
	'figure'
];

const allowedAttrs = {
	a: [ 'href', 'name', 'target' ],
	img: [ 'src', 'alt' ],
	iframe: [ 'src', 'scrolling', 'frameborder', 'width', 'height', 'id' ]
};

class WordpressPost extends Component<DataPropsWithParams> {

	render() {
		const { appSettings: { titleTag }, data: { loading, error, wpPost } } = this.props;
		if (loading) {
			return (
				<div className="mv5 flex justify-center" style={{ minHeight: 800 }}>
					<Spinner />
				</div>
			);
		} else if (error) {
			return (
				<div className="ph5" style={{ minHeight: 800 }}>
					Error! {error.message}
				</div>
			);
		} else if (wpPost != null) {
			const { title, date, author, categories, content, featured_media, excerpt, tags } = wpPost;

			const dateObj = new Date(date);
			const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
			const formattedDate = dateObj.toLocaleDateString('en-US', dateOptions);
			
			const productIds = tags.filter((tag: WPTag) => (tag.name && tag.name.includes("prod-"))).map((tag: WPTag) => tag.name.replace("prod-",""))

			return (
					<Container className={`${styles.postFlex} pt6 pb8 ph3`}>
						<Helmet>
							<title>{titleTag != "" ? title.rendered + " | " + titleTag : title.rendered}</title>
							<meta name="description" content={excerpt.rendered} />
						</Helmet>
						<div className={`${styles.postContainer} ph3`}>
							<h1 className={`${styles.postTitle} t-heading-1`}>
								<SanitizedHTML html={title.rendered} />
							</h1>
							<p className={`${styles.postMeta} t-small mw9 c-muted-1`}>
								<span>Posted {formattedDate} in </span>
								{categories.map((cat: any, index: number) => (
									<span key={index}>
										<a
											className="link c-link hover-c-link active-c-link visited-c-link"
											href={'/blog/category/' + cat.id}
										>
											{cat.name}
										</a>
										{index + 1 === categories.length ? '' : ', '}
									</span>
								))}
								{author != null && <span> by {author.name}</span>}
							</p>
							{featured_media != null &&
							featured_media.media_type === 'image' && (
								<div className="mw9 pb8">
									<img
										className={`${styles.postFeaturedImage}`}
										src={featured_media.source_url}
										alt={featured_media.alt_text}
									/>
									{featured_media.caption != null && (
										<SanitizedHTML html={featured_media.caption.rendered} allowedTags={[]} />
									)}
								</div>
							)}
							<div className={`${styles.postBody}`}>
								<SanitizedHTML
									html={content.rendered}
									allowedTags={allowedTags}
									allowedAttributes={allowedAttrs}
								/>
							</div>
						</div>
					
					<WPRelatedProductsContext.Provider value={{ productIds: productIds }}>
						<div className={`${styles.postChildrenContainer}`}>
							{this.props.children}
						</div>
					</WPRelatedProductsContext.Provider>
				</Container>
			);
		} else {
			return null;
		}
	}
}

export default compose(
	withSettings,
	graphql(SinglePost, { options: (props: DataPropsWithParams) => ({ variables: { id: props.params.id } }) })
)(WordpressPost);
