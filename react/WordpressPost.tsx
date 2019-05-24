import React, { Component } from 'react'
import SinglePost from './graphql/SinglePost.graphql'
import { compose, graphql, DataProps } from 'react-apollo'
import { Spinner } from 'vtex.styleguide'
import { Container } from 'vtex.store-components'
import SanitizedHTML from 'react-sanitized-html'

type Params = {
    params: any
}
type DataPropsWithParams = DataProps<any, any> & Params 

const allowedTags = [ 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'img', 'iframe' ]

class WordpressPost extends Component<DataPropsWithParams> {

    render() {
        const { data: { loading, error, wpPost }} = this.props
            if (loading) {
                return <div className="mv5 flex justify-center" style={{minHeight: 800}}><Spinner /></div>;
            } else if (error) {
                return <div className="ph5" style={{minHeight: 800}}>Error! {error.message}</div>;
            } else if (wpPost != null) {
                const { title, date, author, categories, content, featured_media } = wpPost
                const dateObj = new Date(date)
                const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' }
                const formattedDate = dateObj.toLocaleDateString("en-US", dateOptions)
                var captionNoLinks = ""
                if (featured_media != null && featured_media.caption != null) {
                    captionNoLinks = featured_media.caption.rendered.replace(/<p class="link-more"><a\b[^>]*>(.*?)<\/a><\/p>/g, "")
                }
                return (
                    <Container className="pt6 pb8 ph3">
                        <div className="ph3">
                            { featured_media != null && 
                            featured_media.media_type === "image" && (
                                <div>
                                    <img src={featured_media.source_url} alt={featured_media.alt_text}></img>
                                    { featured_media.caption != null && (
                                        <SanitizedHTML html={captionNoLinks} />
                                    )}
                                </div>
                            )}
                            <h1>{title.rendered}</h1>
                            <SanitizedHTML html={content.rendered} allowedTags={allowedTags} />
                            <h5>
                                Filed under:&nbsp; 
                                { categories.map((cat: any, index: number) => (
                                    <span>
                                        <a href={"/blog/category/" + cat.id}>{cat.name}</a>{(index + 1) === categories.length ? "" : ", "}
                                    </span>
                                ))}
                            </h5>
                            <h5>Date: {formattedDate}</h5>
                            { author != null && (
                                <h5>Author: {author.name}</h5>
                            )}  
                        </div>
                    </Container>
                )
            } else {
                return null
            }
        
    }
}

export default compose(
    graphql(SinglePost, { options: (props: DataPropsWithParams) => ({ variables: { id: props.params.id }})})
)(WordpressPost);