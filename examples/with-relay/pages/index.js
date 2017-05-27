import App from '../components/App'
import Header from '../components/Header'
import Submit from '../components/Submit'
import PostList from '../components/PostList'
import environment from '../lib/environment';
import createPage from '../lib/createPage';
import {graphql} from 'react-relay';

const view = props => (
  <App>
    <Header pathname={props.url.pathname} />
    <Submit data={props.data.viewer} />
    <PostList data={props.data.viewer} />
  </App>
);

export default createPage(
  environment,
  view,
  graphql`
    query pagesQuery {
      viewer {
        ...Submit
        ...PostList
      }
    }
  `,
);

