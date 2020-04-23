/* eslint-disable @typescript-eslint/camelcase */
import React, { FunctionComponent } from 'react'
import { Helmet } from 'react-helmet'
import { useQuery } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'
import { Spinner } from 'vtex.styleguide'
import { Container } from 'vtex.store-components'
import insane from 'insane'
import { useCssHandles } from 'vtex.css-handles'

import SinglePageBySlug from '../graphql/SinglePageBySlug.graphql'
import Settings from '../graphql/Settings.graphql'

const sanitizerConfig = {
  allowedTags: [
    'h1',
    'h2',
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
    'section',
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
    'figure',
  ],
  allowedAttributes: {
    a: ['href', 'name', 'target'],
    img: ['src', 'alt'],
    iframe: ['src', 'scrolling', 'frameborder', 'width', 'height', 'id'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
}

const sanitizerConfigStripAll = {
  allowedAttributes: false,
  allowedTags: false,
  allowedSchemes: [],
}

const CSS_HANDLES = [
  'postFlex',
  'postContainer',
  'postTitle',
  'postMeta',
  'postFeaturedImage',
  'postBody',
  'postChildrenContainer',
] as const

const WordpressPage: FunctionComponent = _props => {
  const handles = useCssHandles(CSS_HANDLES)
  const {
    route: { params },
  } = useRuntime()
  const { loading: loadingS, data: dataS } = useQuery(Settings)
  const { loading, error, data } = useQuery(SinglePageBySlug, {
    variables: { slug: params.slug },
  })

  if (loading || loadingS) {
    return (
      <div className="mv5 flex justify-center" style={{ minHeight: 800 }}>
        <Spinner />
      </div>
    )
  }
   if (error) {
    return (
      <div className="ph5" style={{ minHeight: 800 }}>
        Error! {error.message}
      </div>
    )
  }
  if(!data?.wpPages?.pages)
  {
    return (
      <div>
        <h2>No page found.</h2>
      </div>
    )
  }
  else {
    const {
      date,
      title,
      content,
      author,
      excerpt,
      featured_media
    } = data.wpPages.pages[0]

    const dateObj = new Date(date)
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    const formattedDate = dateObj.toLocaleDateString('en-US', dateOptions)

    let route = dataS?.appSettings?.blogRoute
    if (!route || route == '') route = 'blog'

    const titleHtml = insane(title.rendered, sanitizerConfig)
    const captionHtml =
      featured_media?.caption?.rendered ??
      insane(featured_media.caption.rendered, sanitizerConfigStripAll)
    const bodyHtml = insane(content.rendered, sanitizerConfig)

    return (
      <Container className={`${handles.postFlex} pt6 pb8 ph3`}>
        <Helmet>
          <title>
            {dataS?.appSettings?.titleTag && dataS.appSettings.titleTag != ''
              ? title.rendered + ' | ' + dataS.appSettings.titleTag
              : title.rendered}
          </title>
          {featured_media?.media_type == "image" && featured_media?.source_url ? 
              <meta property="og:image" content={featured_media?.source_url}/> : 
              ""
          }
          <meta name="description" content={excerpt?.rendered?.replace(/<p>/gi,"").replace(/<\/p>/gi,"").trim()} />
        </Helmet>
        <div className={`${handles.postContainer} ph3`}>
          <h1
            className={`${handles.postTitle} t-heading-1`}
            dangerouslySetInnerHTML={{ __html: titleHtml }}
          />
          <p className={`${handles.postMeta} t-small mw9 c-muted-1`}>
            <span>Posted {formattedDate} in </span>
            {author && <span> by {author.name}</span>}
          </p>
          {featured_media && featured_media.media_type === 'image' && (
            <div className="mw9 pb8">
              <img
                className={`${handles.postFeaturedImage}`}
                src={featured_media.source_url}
                alt={featured_media.alt_text}
              />
              {featured_media.caption && (
                <span dangerouslySetInnerHTML={{ __html: captionHtml }} />
              )}
            </div>
          )}
          <div
            className={`${handles.postBody}`}
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        </div>
      </Container>
    )
  }
}

export default WordpressPage
