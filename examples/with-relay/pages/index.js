import App from '../components/App'
import Header from '../components/Header'
import Submit from '../components/Submit'
import PostList from '../components/PostList'
import createEnvironment from '../lib/createEnvironment';
import createPage from '../lib/createPage';
import {graphql} from 'react-relay';

const view = props => (
  <App>
    <Header pathname={props.url.pathname} />
    <Submit data={props.data.viewer} />
    <PostList data={props.data.viewer} />
  </App>
);

const pagesQuery = graphql`
  query pagesQuery {
    viewer {
      ...Submit
      ...PostList
    }
  }
`;

export default createPage(
  createEnvironment,
  view,
  pagesQuery,
);

