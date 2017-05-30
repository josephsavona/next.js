import fetch from 'isomorphic-fetch'
import {
  Environment,
  RecordSource,
  Network,
  Store,
} from 'relay-runtime';
import RelayQueryResponseCache from 'relay-runtime/lib/RelayQueryResponseCache';

import GRAPHQL_ENDPOINT from '../config';

export default function createEnvironment(initialData) {
  const cache = new RelayQueryResponseCache({
    size: 50,
    ttl: 5 * 60 * 1000, // 5min
  });

  function fetchQuery(
    operation,
    variables,
    cacheConfig,
    uploadables,
  ) {
    const force = cacheConfig != null && cacheConfig.force;
    if (!force && operation.query.operation === 'query') {
      // try to read query data from cache unless force:true
      const payload = cache.get(operation.text, variables);
      if (payload != null) {
        return Promise.resolve(payload);
      }
    }
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
    }).then(payload => {
      if (operation.query.operation === 'query') {
        cache.set(operation.text, variables, payload);
      } else {
        // clear cache on mutations payloads since they may invalidate cached
        // query results
        cache.clear();
      }
      return payload;
    });
  }

  const source = new RecordSource(initialData);
  const store = new Store(source);
  const network = Network.create(fetchQuery);
  return new Environment({
    network,
    store,
  });
}
