import React, { FunctionComponent } from 'react'
import { Helmet } from 'react-helmet'

interface WordpressPostHeaderProps {
  postData: PostData
  dataS: any
}

const buildMetaTag = ({ name, property, content }: MetaTags) => {
  if (name) return <meta name={name} content={content} />

  return <meta property={property} content={content} />
}

const WordpressPostHeader: FunctionComponent<WordpressPostHeaderProps> = props => {
  const { postData, dataS } = props

  const { title, featured_media: featuredMedia, excerpt, headerTags } = postData
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

  return (
    <Helmet>
      <title>{headerTitle}</title>
      {featuredMedia?.media_type === 'image' && featuredMedia?.source_url ? (
        <meta property="og:image" content={featuredMedia?.source_url} />
      ) : (
        ''
      )}
      <meta
        name="description"
        content={excerpt?.rendered?.replace(/(<([^>]+)>)/gi, '').trim()}
      />
    </Helmet>
  )
}

export default WordpressPostHeader
