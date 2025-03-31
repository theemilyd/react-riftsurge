
// Fetch a single page by its URI (slug path)
export const GET_PAGE_BY_URI = `
  query GetPageByUri($uri: ID!) {
    page(id: $uri, idType: URI) {
      id
      title
      content
      date
      seo { # Requires WPGraphQL Yoast SEO Addon or similar
        title
        metaDesc
      }
      # Add other fields like featuredImage, ACF fields, etc.
      # featuredImage {
      #   node {
      #     sourceUrl
      #     altText
      #   }
      # }
    }
  }
`;

// Fetch multiple posts (for blog archive)
export const GET_POSTS = `
  query GetPosts($first: Int = 10, $after: String) {
    posts(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        title
        slug
        date
        excerpt
        author {
          node {
            name
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        # Add estimated reading time if you have a plugin/field for it
      }
    }
  }
`;

// Fetch a single post by its slug
export const GET_POST_BY_SLUG = `
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      content
      date
      author {
        node {
          name
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      seo {
        title
        metaDesc
      }
      # Add other fields
    }
  }
`;

// Example: Fetch Portfolio Items (assuming a 'portfolio' custom post type)
export const GET_PORTFOLIO_ITEMS = `
  query GetPortfolioItems($first: Int = 9, $after: String, $category: String) {
    portfolioItems(first: $first, after: $after, where: { taxQuery: { taxonomy: PORTFOLIOCATEGORY, terms: [$category], field: SLUG } }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        title
        slug
        content # Or a custom field for description
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        portfolioCategories { # Assuming a taxonomy 'portfolioCategories'
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

// Example: Fetch a single Portfolio Item by slug
export const GET_PORTFOLIO_ITEM_BY_SLUG = `
  query GetPortfolioItemBySlug($slug: ID!) {
    portfolioItem(id: $slug, idType: SLUG) {
      id
      title
      content
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      portfolioCategories {
        nodes {
          name
          slug
        }
      }
      # Add other custom fields (ACF, etc.)
    }
  }
`;

// Example: Fetch Menu Items (requires WPGraphQL Menu support, e.g., plugin)
// Adjust 'MAIN_MENU' to your menu location or name
export const GET_MENU_ITEMS = `
  query GetMenuItems($location: MenuLocationEnum = PRIMARY) {
    menuItems(where: { location: $location }) {
      nodes {
        id
        label
        path # Usually the relative path like '/about/'
        url  # Full URL
        order
        parentId
        # childItems { nodes { ... } } # If you need nested menus
      }
    }
  }
`;

// Example: Fetch Site Settings/Identity (requires specific configuration or plugin)
export const GET_SITE_SETTINGS = `
 query GetSiteSettings {
  generalSettings {
    title
    description
  }
  # You might add custom options fields here (e.g., via ACF Options Page + WPGraphQL ACF)
  # themeOptions {
  #   footerText
  #   socialLinks { facebook, twitter }
  # }
 }
`;