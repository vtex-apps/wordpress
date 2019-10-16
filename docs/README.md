
# Wordpress Integration
## Description
This app provides a way to bring in blog data from the Wordpress API and create a blog "homepage", category pages, and blog post pages on your VTEX IO store, using your existing store header, footer, and styling.
## Usage
### Setup
After installing this app in your account, navigate to the app's settings in your admin dashboard under **Apps** > **Wordpress Integration**.

 *Wordpress URL* is required for the integration to function. This should be the domain where the Wordpress API endpoint is hosted and Wordpress is administered. Note that an outbound-access rule for the URL must also be present in this app's [manifest](/manifest.json) for the app to be able to access the data.
*Title tag for blog homepage* will determine the title tag for the Wordpress portions of your store.
*URL path for blog homepage* will determine the route for the Wordpress portions of your store. This will need to match the blog routes in your `store-theme` app (more on that below).

All other configuration of Wordpress is done within your store's `store-theme`.

### Store Theme: Routes
The Wordpress integration is designed to work with these store pages:

`store.blog-home`: The "homepage" of your blog. This can also be extended (i.e. `store.blog-home#custom`) to create additional custom blog pages, if needed.  

`store.blog-category`: A listing of blog posts belonging to a particular category, derived from a category ID in the page route.

`store.blog-post`: A detail view of a single blog post, derived from a post ID in the page route.

`store.blog-search-result`: A listing of blog posts matching a search query, derived from search terms in the page route.

Each of the above pages needs a route declared in your `store-theme`'s `store/routes.json`. These are the recommended routes to use:

```json
"store.blog-home": {
	"path": "/blog"
},
"store.blog-category": {
	"path": "/blog/category/:categoryid"
},
"store.blog-post": {
	"path": "/blog/post/:id"
},
"store.blog-search-result": {
	"path": "/blog/search/:term"
},
```
You may change "blog" in each route to another string of your choosing, but the rest must stay the same. If you do decide to use a string other than "blog", make sure to enter it in the Wordpress Integration app settings under *URL path for blog homepage*. 
 
 ### Store Theme: Blocks
 Once the routes are set up, you may populate each blog page with blocks. The Wordpress Integration app provides the following blocks for your use:

`blog-all-posts.wordpress-all-posts`: A paginated list of all blog posts, starting with the most recent. Recommended to be placed on `store.blog-home`. 

`blog-category-list.wordpress-category-list`: A paginated list of blog posts from a specific category. This must be placed on the `store.blog-category` page, as the category ID is provided by the parameter in the page route.

`blog-post-details.wordpress-post-details`: Details for a single blog post. This must be placed on the `store.blog-post` page, as the post ID is provided by the parameter in the page route.

`blog-latest-posts-preview.wordpress-latest-posts-preview`: A small block showing teasers for the most recent 3-5 posts (default is 3). The following props can be used: 
 - `title`: String. A title to be displayed above the block. Defaults to an empty string.
 - `numberOfPosts`:  Integer. The number of posts to be displayed. Default is 3.
 - `useTextOverlays`: Boolean. If true, the information (title, category, etc) for each blog post will be overlaid on the post's featured image. If false, posted date and category are shown above the image, title and excerpt are shown below. Default is false.
 - `showCategories`:  Boolean. If false, the category of each post will not be shown. Default is true.
 - `showDates`: Boolean. If false, the posted date of each post will not be shown. Default is true.
 - `showAuthors`: Boolean. If false, the author of each post will not be shown. Default is false.
 - `showExcerpts`: Boolean. If false, the excerpt of each post will not be shown. Default is false.

`blog-category-preview.wordpress-category-preview`: A small block showing teasers for the most recent 3-5 posts from a specific category (default is 3). The category ID must be provided as a prop. The following props can be used: 
- `category`: Integer. The numeric ID of the category in the Wordpress system. Defaults to 0.
 - `title`: String. A title to be displayed above the block. Defaults to an empty string.
 - `description`: String. A "subheader" for the block, to be displayed below the title. Defaults to an empty string.
 - `customLinkText`: String. The category block includes a link to the `store.blog-category` page for that category. By default the text for the link is "All [category] Posts >", but you may enter custom link text here.
 - `customLinkTarget`: String. If you would like the aforementioned link to direct the user somewhere other than the `store.blog-category` page, you may enter a different target here. 
 - `numberOfPosts`: Integer. The number of posts to be displayed. Default is 3.
 - `useTextOverlays`: Boolean. If true, the information (title, category, etc) for each blog post will be overlaid on the post's featured image. If false, posted date and category are shown above the image, title and excerpt are shown below. Default is false.
 - `showDates`: Boolean. If false, the posted date of each post will not be shown. Default is true.
 - `showAuthors`: Boolean. If false, the author of each post will not be shown. Default is false.
 - `showExcerpts`: Boolean. If false, the excerpt of each post will not be shown. Default is false.

`blog-search.wordpress-search`: A search box that shoppers can use to search blog articles. When submitted, the shopper is redirected to the `store.blog-search-list` page. The following prop may be used:
- `placeholder`: By default the search block will use "Search articles..." as the input placeholder, but you may enter a different string here.

`blog-search-list.wordpress-search-list`: A paginated list of blog post search results. This must be placed on the `store.blog-search` page, as the search terms are provided by the parameter in the page route. 

`search-blog-articles-preview.wordpress`: A small block showing 3-5 blog post search results with a link to `store.blog-search-list` for full blog post search results. This can only be placed on the main `store.search-result` page and uses the same search query as the product search component on that page. The following props can be used: 
 - `numberOfPosts`: Integer. The number of posts to be displayed. Default is 3.
 - `useTextOverlays`: Boolean. If true, the information (title, category, etc) for each blog post will be overlaid on the post's featured image. If false, posted date and category are shown above the image, title and excerpt are shown below. Default is false.
 - `showCategories`:  Boolean. If false, the category of each post will not be shown. Default is true.
 - `showDates`: Boolean. If false, the posted date of each post will not be shown. Default is true.
 - `showAuthors`: Boolean. If false, the author of each post will not be shown. Default is false.
 - `showExcerpts`: Boolean. If false, the excerpt of each post will not be shown. Default is false.

`search-blog-articles-list.wordpress`: An alternative to the previous block. This block shows a complete paginated list of blog post search results, similar to `blog-search-list.wordpress-search-list`, but designed to be placed on the `store.search-result` product search page. It automatically uses the same search query as the product search component on that page.

`blog-related-products.wordpress-related-products`: A specialized wrapper for a product shelf that can be placed on the `store.blog-post` page. This allows you to tag Wordpress posts with product reference codes, and the products in question will then be displayed in the shelf. The tags must be in the format **prod-[reference code]**. For example, if your product had a reference code of "VTEX01", the tag should be "prod-VTEX01". This block must have `product-summary.shelf` as a child. 

`blog-related-posts.wordpress-related-posts`: Similar to the above, but the reverse: this is a block intended to be placed as a child of `store.product` which will show teasers for 3-5 blog posts (3 by default) that are tagged with the reference code of the product being viewed. The following props can be used: 
 - `title`: String. A title to be displayed above the block. Defaults to an empty string.
 - `numberOfPosts`: Integer. The number of posts to be displayed. Default is 3.
 - `useTextOverlays`: Boolean. If true, the information (title, category, etc) for each blog post will be overlaid on the post's featured image. If false, posted date and category are shown above the image, title and excerpt are shown below. Default is false.
 - `showCategories`:  Boolean. If false, the category of each post will not be shown. Default is true.
 - `showDates`: Boolean. If false, the posted date of each post will not be shown. Default is true.
 - `showAuthors`: Boolean. If false, the author of each post will not be shown. Default is false.
 - `showExcerpts`: Boolean. If false, the excerpt of each post will not be shown. Default is false.

`blog-breadcrumb.wordpress-breadcrumb`: A breadcrumb component intended to be placed at the top of each blog page.

### Store Theme: Styles API

This app provides some CSS classes as an API for style customization.

To use this CSS API, you must add the `styles` builder to your `store-theme` and create an app styling CSS file.

1. Add the `styles` builder to your `manifest.json`:

```json
  "builders": {
    "styles": "1.x"
  }
```

2. Create a file called `vtex.wordpress-integration.css` inside the `styles/css` folder. Add your custom styles:

```css
.listContainer {
  margin-top: 10px;
}
```
You can see what CSS namespaces are available, and any default styles, by viewing the following files:
- **Paginated lists** (`wordpress-all-posts`, `wordpress-category-list`): [list.css](/react/components/list.css)
- **Search list** (`wordpress-search-list`): [searchlist.css](/react/components/searchlist.css)
- **Latest Posts Block** (`wordpress-latest-posts-preview`): [latestpostsblock.css](/react/components/latestpostsblock.css)
- **Category Preview Block** (`wordpress-category-preview`): [categoryblock.css](/react/components/categoryblock.css)
- **Related Posts Block** (`wordpress-related-posts`): [relatedpostsblock.css](/react/components/relatedpostsblock.css)
- **Teasers** (shown in above lists and blocks): [teaser.css](/react/components/teaser.css)
- **Posts** (`wordpress-post-details`): [post.css](/react/components/post.css)
- **Related Products Block** (`wordpress-related-products`): [shelf.css](/react/components/shelf.css)
- **Search Block** (`wordpress-search`): [search.css](/react/components/search.css)
- **Breadcrumb** (`wordpress-breadcrumb`): [breadcrumb.css](/react/components/breadcrumb.css)

## Troubleshooting

You can check if others are passing through similar issues [here](https://github.com/vtex-apps/wordpress-integration/issues). Also feel free to [open issues](https://github.com/vtex-apps/wordpress-integration/issues/new) or contribute with pull requests.

## Contributing

Check it out [how to contribute](https://github.com/vtex-apps/awesome-io#contributing) with this project.
