import React, { FunctionComponent } from 'react'
import { Helmet } from 'react-helmet'

interface WordpressHeaderProps {
  postData: PostData
  dataS: any
}

const buildMetaTag = ({ name, property, content }: MetaTags) => {
  if (name) return <meta name={name} content={content} />

  return <meta property={property} content={content} />
}

const WordpressHeader: FunctionComponent<WordpressHeaderProps> = props => {
  const { postData, dataS } = props
  const {
    type,
    title,
    featured_media: featuredMedia,
    excerpt,
    headerTags,
  } = postData

  const headerTitle = dataS?.appSettings?.titleTag
    ? `${title.rendered} | ${dataS?.appSettings?.titleTag}`
    : title.rendered

  if (headerTags) {
    return (
      <Helmet>
        <title>{headerTitle}</title>
        {headerTags.metaTags.map(tag => buildMetaTag(tag))}
        <script type="application/ld+json">{headerTags.ldJson}</script>
      </Helmet>
    )
  }

  const description =
    type === 'page'
      ? excerpt?.rendered
          ?.replace(/<p>/gi, '')
          .replace(/<\/p>/gi, '')
          .trim()
      : excerpt?.rendered?.replace(/(<([^>]+)>)/gi, '').trim()

  return (
    <Helmet>
      <title>{headerTitle}</title>
      {featuredMedia?.media_type === 'image' && featuredMedia?.source_url ? (
        <meta property="og:image" content={featuredMedia?.source_url} />
      ) : (
        ''
      )}
      <meta name="description" content={description} />
    </Helmet>
  )
}

export default WordpressHeader
