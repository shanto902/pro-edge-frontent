import axios from "axios";

const GRAPHQL_URL = `${import.meta.env.VITE_SERVER_URL}/graphql`;

const GET_PAGE_BLOCKS_QUERY = `
  query GetPageBlocks($permalink: String!) {
    page(filter: { permalink: { _eq: $permalink } }) {
      id
      title
      permalink
      blocks {
        id
        sort
        collection
        item {
          __typename
          ... on slider {
            id
            sort
            title
            subtitle
            image { id }
            button_text
            button_url
            type
          }
          ... on breadcramb {
            id
            sort
            title
            image { id }
            type
          }
          ... on page_text {
            id
            sort
            text
            type
          }
          ... on banner {
            id
            sort
            title
            subtitle
            image { id }
            button_text
            button_url
            type
          }
          ... on features {
            id
            sort
            icon { id }
            title
            subtitle
            type
          }
          ... on feature_highlights {
            id
            icon { id }
            title
            link
            type
          }
          ... on page_title {
            id
            page_title
            type
          }
        }
      }
    }
  }
`;
export const fetchPageBlocks = async (permalink) => {
  const response = await axios.post(
    GRAPHQL_URL,
    {
      query: GET_PAGE_BLOCKS_QUERY,
      variables: { permalink },
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  const pages = response.data?.data?.page || [];
  return pages[0]?.blocks || [];
};
