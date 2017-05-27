import React from 'react';
import App from '../components/App';
import environment from '../lib/environment';
import createPage from '../lib/createPage';
import {graphql} from 'react-relay';

class Test extends React.Component {
  render() {
    return (
      <App>
        <article>
          <h1>Test</h1>
          <p>
            {JSON.stringify(this.props.data, null, 2)}
          </p>
        </article>
      </App>
    );
  }
}

export default createPage(
  environment,
  Test,
  graphql`
    query testQuery {
      viewer {
        allPosts(first: 10) {
          count
        }
      }
    }
  `,
);

