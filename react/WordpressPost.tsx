import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
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
'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'img', 'iframe', 'figure' ]

const allowedAttrs = {
    a: [ 'href', 'name', 'target' ],
    img: [ 'src', 'alt' ],
    iframe: [ 'src', 'scrolling', 'frameborder', 'width', 'height', 'id' ]
}

class WordpressPost extends Component<DataPropsWithParams> {

    render() {
        const { data: { loading, error, wpPost }} = this.props
        if (loading) {
            return <div className="mv5 flex justify-center" style={{minHeight: 800}}><Spinner /></div>;
        } else if (error) {
            return <div className="ph5" style={{minHeight: 800}}>Error! {error.message}</div>;
        } else if (wpPost != null) {
            const { title, date, author, categories, content, featured_media, excerpt } = wpPost
            
            const dateObj = new Date(date)
            const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' }
            const formattedDate = dateObj.toLocaleDateString("en-US", dateOptions)
            
            return (
                <Container className="pt6 pb8 ph3">
                    <Helmet>
                        <title>{title.rendered}</title>
                        <meta name="description" content={excerpt.rendered} />
                    </Helmet>
                    <div className="ph3">
                        <h1 className="t-heading-1">
                            <SanitizedHTML html={title.rendered}/>
                        </h1>
                        <p className="t-small mw9 c-muted-1">
                            <span>Posted {formattedDate} in </span>  
                            { categories.map((cat: any, index: number) => (
                                <span>
                                    <a className="link c-link hover-c-link active-c-link visited-c-link" href={"/blog/category/" + cat.id}>{cat.name}</a>{(index + 1) === categories.length ? "" : ", "}
                                </span>
                            ))}
                            { author != null && (
                                <span> by {author.name}</span>
                            )}
                        </p>                            
                        { featured_media != null && 
                        featured_media.media_type === "image" && (
                            <div className="mw9 pb8">
                                <img src={featured_media.source_url} alt={featured_media.alt_text}></img>
                                { featured_media.caption != null && (
                                    <SanitizedHTML html={featured_media.caption.rendered} allowedTags={[]} />
                                )}
                            </div>
                        )}
                        <SanitizedHTML html={content.rendered} allowedTags={allowedTags} allowedAttributes={allowedAttrs} />
                            
                    </div>
                </Container>
            )
        } else {
            return null
        }
        
    }
}

export default compose(
    graphql(SinglePost, { options: (props: DataPropsWithParams) => ({ variables: { id: props.params.id } })})
)(WordpressPost);