const SHOPIFY_STORE_DOMAIN = import.meta.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = import.meta.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

const STOREFRONT_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-10/graphql.json`;

interface ShopifyResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(STOREFRONT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json: ShopifyResponse<T> = await response.json();

  if (json.errors) {
    throw new Error(json.errors.map((e) => e.message).join(', '));
  }

  return json.data;
}

// Types
export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: ShopifyMoney;
  selectedOptions: Array<{ name: string; value: string }>;
  image: ShopifyImage | null;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  featuredImage: ShopifyImage | null;
  images: { edges: Array<{ node: ShopifyImage }> };
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  variants: { edges: Array<{ node: ShopifyVariant }> };
  options: Array<{ name: string; values: string[] }>;
  seo: { title: string | null; description: string | null };
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  image: ShopifyImage | null;
  seo: { title: string | null; description: string | null };
  products?: { edges: Array<{ node: ShopifyProduct }> };
}

// Queries
const COLLECTION_FRAGMENT = `
  fragment CollectionFields on Collection {
    id
    handle
    title
    description
    descriptionHtml
    image {
      url
      altText
      width
      height
    }
    seo {
      title
      description
    }
  }
`;

const PRODUCT_CARD_FRAGMENT = `
  fragment ProductCardFields on Product {
    id
    handle
    title
    featuredImage {
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
  }
`;

const PRODUCT_FULL_FRAGMENT = `
  fragment ProductFullFields on Product {
    id
    handle
    title
    description
    descriptionHtml
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 20) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
    options {
      name
      values
    }
    seo {
      title
      description
    }
  }
`;

export async function getCollections(): Promise<ShopifyCollection[]> {
  const query = `
    ${COLLECTION_FRAGMENT}
    query GetCollections {
      collections(first: 50) {
        edges {
          node {
            ...CollectionFields
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{ collections: { edges: Array<{ node: ShopifyCollection }> } }>(query);
  return data.collections.edges.map((edge) => edge.node);
}

export async function getCollectionByHandle(handle: string): Promise<ShopifyCollection | null> {
  const query = `
    ${COLLECTION_FRAGMENT}
    ${PRODUCT_CARD_FRAGMENT}
    query GetCollection($handle: String!) {
      collection(handle: $handle) {
        ...CollectionFields
        products(first: 50) {
          edges {
            node {
              ...ProductCardFields
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{ collection: ShopifyCollection | null }>(query, { handle });
  return data.collection;
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const query = `
    ${PRODUCT_FULL_FRAGMENT}
    query GetProduct($handle: String!) {
      product(handle: $handle) {
        ...ProductFullFields
      }
    }
  `;

  const data = await shopifyFetch<{ product: ShopifyProduct | null }>(query, { handle });
  return data.product;
}

export async function getAllProducts(): Promise<ShopifyProduct[]> {
  const query = `
    ${PRODUCT_CARD_FRAGMENT}
    query GetAllProducts($cursor: String) {
      products(first: 50, after: $cursor) {
        edges {
          node {
            ...ProductCardFields
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  const allProducts: ShopifyProduct[] = [];
  let cursor: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const data = await shopifyFetch<{
      products: {
        edges: Array<{ node: ShopifyProduct }>;
        pageInfo: { hasNextPage: boolean; endCursor: string };
      };
    }>(query, { cursor });

    allProducts.push(...data.products.edges.map((edge) => edge.node));
    hasNextPage = data.products.pageInfo.hasNextPage;
    cursor = data.products.pageInfo.endCursor;
  }

  return allProducts;
}

// Cart mutations (used client-side)
export const CART_CREATE_MUTATION = `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  image {
                    url
                    altText
                  }
                  product {
                    title
                    handle
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
        totalQuantity
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_ADD_MUTATION = `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  image {
                    url
                    altText
                  }
                  product {
                    title
                    handle
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
        totalQuantity
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_UPDATE_MUTATION = `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  image {
                    url
                    altText
                  }
                  product {
                    title
                    handle
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
        totalQuantity
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_REMOVE_MUTATION = `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        checkoutUrl
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  image {
                    url
                    altText
                  }
                  product {
                    title
                    handle
                  }
                }
              }
            }
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
        totalQuantity
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Helper to format price
export function formatPrice(money: ShopifyMoney): string {
  const amount = parseFloat(money.amount);
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: money.currencyCode,
  }).format(amount);
}
