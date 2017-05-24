import App from '../components/App'
import Header from '../components/Header'
import Submit from '../components/Submit'
import PostList from '../components/PostList'

export default props => (
  <App>
    <Header pathname={props.url.pathname} />
    <Submit />
    <PostList />
  </App>
);
