import React, { Component, Fragment } from 'react';
import CategorySimple from './graphql/CategorySimple.graphql';
import PostSimple from './graphql/PostSimple.graphql';
import withSettingsNoSSR from './components/withSettingsNoSSR'
import { compose, Query, DataProps } from 'react-apollo';
import { Link } from 'vtex.render-runtime';
import { Container } from 'vtex.store-components';
import SanitizedHTML from 'react-sanitized-html';
import styles from './components/breadcrumb.css';

interface otherProps {
	appSettings: AppSettings
	params: any
}
interface AppSettings {
	titleTag: string
	blogRoute: string
}
type DataPropsWithParams = DataProps<any, any> & otherProps

class WordpressBreadcrumb extends Component<DataPropsWithParams> {
	
	render() {
		const { appSettings: { blogRoute } } = this.props;
        
        const route = (blogRoute && blogRoute !== "") ? blogRoute : 'blog'

        // if we're on a category page
        if (this.props.params && this.props.params.categoryid) {
            return (
                <Query query={CategorySimple} variables={{
                    category: this.props.params.categoryid
                }}>
                    {({ loading, error, data }: { loading: boolean, error?: any, data: any}) => {
                        if (loading || error) return ( <Fragment></Fragment>)
                        if (data && data.wpCategory) return (
                            <Container className={`${styles.breadcrumbContainer} pt2 pb8`}>
                                <Link to={ "/" + route } className={`${styles.breadcrumbHomeLink}`}>
                                    Blog Home
                                </Link>
                                <span className={`${styles.breadcrumbSeparator}`}>&nbsp;/&nbsp;</span>
                                <span className={`${styles.breadcrumbCurrentPage}`}>{data.wpCategory.name}</span>
                            </Container>
                        )   
                    }}
                </Query>
            )
        }

        // if we're viewing a single blog post
        if (this.props.params && this.props.params.id) {
            return (
                <Query query={PostSimple} variables={{
                    id: this.props.params.id
                }}>
                    {({ loading, error, data }: { loading: boolean, error?: any, data: any}) => {
                        if (loading || error) return ( <Fragment></Fragment>)
                        if (data && data.wpPost) return (
                            <Container className={`${styles.breadcrumbContainer} pt2 pb8`}>
                                <Link to={ "/" + route } className={`${styles.breadcrumbHomeLink}`}>
                                    Blog Home
                                </Link>
                                <span className={`${styles.breadcrumbSeparator}`}>&nbsp;/&nbsp;</span>
                                <Link to={ "/" + route + "/category/" + data.wpPost.categories[0].id } className={`${styles.breadcrumbLink}`}>
                                    {data.wpPost.categories[0].name}
                                </Link>
                                <span className={`${styles.breadcrumbSeparator}`}>&nbsp;/&nbsp;</span>
                                <span className={`${styles.breadcrumbCurrentPage}`}>{data.wpPost.title.rendered}</span>
                            </Container>
                        )   
                    }}
                </Query>
            )
        }
        
        // else
        return (
			<Container className={`${styles.breadcrumbContainer} pt2 pb8`}>
                <Link to={ "/" + route } className={`${styles.breadcrumbHomeLink}`}>
                    Blog Home
                </Link>
            </Container>
        )
    }
}

export default compose(
	withSettingsNoSSR
)(WordpressBreadcrumb);