import React, { Component } from 'react'
import { Card } from 'vtex.styleguide'
import SanitizedHTML from 'react-sanitized-html'

interface TeaserProps {
    title: string,
    author: string,
    excerpt: string,
    category: string,
    categoryId: number,
    date: string,
    id: number,
    image: string,
    altText: string,
    mediaType: string
}

export default class WordpressTeaser extends Component<TeaserProps> {

    render() {
        const { title, excerpt, category, categoryId, date, id, mediaType, image, altText } = this.props
        const dateObj = new Date(date)
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' }
        const formattedDate = dateObj.toLocaleDateString("en-US", dateOptions)
        const excerptNoLinks = excerpt.replace(/<p class="link-more"><a\b[^>]*>(.*?)<\/a><\/p>/g, "")
        return (
            <Card noPadding>
                <h5 className="mv1 ph6 pt6 pb4"><a href={"/blog/category/" + categoryId}>{category}</a> - {formattedDate}</h5>
                { mediaType === "image" && (
                    <a href={"/blog/post/" + id} className="tc-m db-ns"><img src={image} alt={altText}></img></a>
                )}
                <h2 className="mv4 ph6"><a href={"/blog/post/" + id}>{title}</a></h2>
                <SanitizedHTML className="ph6 pb6" html={excerptNoLinks} />
            </Card>
        )
    }
}