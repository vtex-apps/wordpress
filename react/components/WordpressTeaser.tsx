import React, { Component, Fragment } from 'react'
import { Card } from 'vtex.styleguide'
import SanitizedHTML from 'react-sanitized-html'
import styles from './teaser.css'

interface TeaserProps {
    title: string,
    author: string,
    excerpt: string,
    category?: string,
    categoryId?: number,
    date: string,
    id: number,
    image: string,
    altText: string,
    mediaType: string,
    showCategory: boolean,
    showAuthor: boolean,
    showDate: boolean,
    showExcerpt: boolean,
    useTextOverlay: boolean
}

export default class WordpressTeaser extends Component<TeaserProps> {

    render() {
        const { title, author, excerpt, category, categoryId, date, id, mediaType, image, altText,
            showCategory, showAuthor, showDate, showExcerpt, useTextOverlay } = this.props
        const dateObj = new Date(date)
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' }
        const formattedDate = dateObj.toLocaleDateString("en-US", dateOptions)
        return (
            <Card noPadding className={`${styles.teaserContainer}`}>
                {((showCategory || showDate || showAuthor) && (!useTextOverlay || mediaType != "image")) && (
                    <h5 className="mv1 ph6 pt6 pb4">
                        {(showCategory && category != undefined && categoryId != undefined) && (
                            <Fragment><a href={"/blog/category/" + categoryId}>{category}</a></Fragment>
                        )}
                        {((showCategory && showDate) || (showCategory && showAuthor)) && (
                            <Fragment> - </Fragment>
                        )}
                        {showDate && (
                            <Fragment>{formattedDate}</Fragment>
                        )}
                        {(showDate && showAuthor) && (
                            <Fragment> - </Fragment>
                        )}
                        {showAuthor && (
                            <Fragment>{author}</Fragment>
                        )}
                    </h5>
                )}
                {mediaType === "image" && (
                    <Fragment>
                        {useTextOverlay ? (
                            <a href={"/blog/post/" + id} className="tc-m db relative">
                                <img className={`${styles.teaserImage}`} src={image} alt={altText}></img>
                                <div className={`${styles.teaserGradientOverlay} absolute`}>
                                    <div className={`${styles.teaserTextOverlay} absolute`}>
                                        <div className={`${styles.teaserTextOverlayTitle}`}>{title}</div>
                                        {(showCategory || showDate || showAuthor) && (
                                            <div className={`${styles.teaserTextOverlayMeta}`}>
                                                {(showCategory && category != undefined && categoryId != undefined) && (
                                                    <Fragment><a href={"/blog/category/" + categoryId}>{category}</a></Fragment>
                                                )}
                                                {((showCategory && showDate) || (showCategory && showAuthor)) && (
                                                    <Fragment> - </Fragment>
                                                )}
                                                {showDate && (
                                                    <Fragment>{formattedDate}</Fragment>
                                                )}
                                                {(showDate && showAuthor) && (
                                                    <Fragment> - </Fragment>
                                                )}
                                                {showAuthor && (
                                                    <Fragment>{author}</Fragment>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </a>
                        ) : (
                                <Fragment>
                                    <a href={"/blog/post/" + id} className="tc-m db">
                                        <img className={`${styles.teaserImage}`} src={image} alt={altText}></img>
                                    </a>
                                    <h3 className={`${styles.teaserTitle} t-heading-3 mv0 pt4 pb6 ph6`}>
                                        <a href={"/blog/post/" + id}>
                                            <SanitizedHTML html={title} />
                                        </a>
                                    </h3>
                                </Fragment>
                            )}
                    </Fragment>
                )}

                {mediaType != "image" && (
                    <h3 className={`${styles.teaserTitle} t-heading-3 mv0 pt4 pb6 ph6`}>
                        <a href={"/blog/post/" + id}>
                            <SanitizedHTML html={title} />
                        </a>
                    </h3>
                )}

                {showExcerpt && (
                    <SanitizedHTML className="ph6 pb6" html={excerpt} />
                )}
            </Card>
        )
    }
}