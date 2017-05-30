import React from 'react';
import App from '../components/App';
import createEnvironment from '../lib/createEnvironment';
import createPage from '../lib/createPage';
import {graphql} from 'react-relay';

const view = props => (
  <App>
    <article>
      <h1>Test</h1>
      <p>
        {JSON.stringify(props.data, null, 2)}
      </p>
    </article>
  </App>
);

const testQuery = graphql`
  query testQuery {
    viewer {
      allPosts(first: 10) {
        count
      }
    }
  }
`;

export default createPage(
  createEnvironment,
  view,
  testQuery,
);

