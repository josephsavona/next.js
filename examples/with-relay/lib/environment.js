import fetch from 'isomorphic-fetch'
import {
  Environment,
  RecordSource,
  Network,
  Store,
} from 'relay-runtime';

import GRAPHQL_ENDPOINT from '../config';

function fetchQuery(
  operation,
  variables,
  cacheConfig,
  uploadables,
) {
  console.log('fetch on ' + (process.browser ? 'browser' : 'server'));
  return fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      // Add authentication and other headers here
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      query: operation.text, // GraphQL text from input
      variables,
    }),
  }).then(response => {
    return response.json();
  });
}

const source = new RecordSource();
const store = new Store(source);
const network = Network.create(fetchQuery);
const environment = new Environment({
  network,
  store,
});

export default {
  network,
  store,
};
