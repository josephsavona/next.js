import {createPaginationContainer, graphql} from 'react-relay'
import PostUpvoter from './PostUpvoter'

const POSTS_PER_PAGE = 10

class PostList extends React.Component {
  loadMore() {
    if (!this.props.relay.isLoading() && this.props.relay.hasMore()) {
      this.props.relay.loadMore(POSTS_PER_PAGE);
    }
  }

  render() {
    const {allPosts} = this.props.data;
    const hasMorePosts = this.props.relay.hasMore();
    const isLoading = this.props.relay.isLoading();
    const loadMore = hasMorePosts
      ? <button onClick={this.loadMore}>{isLoading ? 'Loading...' : 'Show More'}</button>
      : null;
    return (
      <section>
        <ul>
          {allPosts.edges.map((edge, index) =>
            <li key={edge.node.id}>
              <div>
                <span>{index + 1}. </span>
                <a href={edge.node.url}>{edge.node.title}</a>
                <PostUpvoter data={edge.node} />
              </div>
            </li>
          )}
        </ul>
        {loadMore}
        <style jsx>{`
          section {
            padding-bottom: 20px;
          }
          li {
            display: block;
            margin-bottom: 10px;
          }
          div {
            align-items: center;
            display: flex;
          }
          a {
            font-size: 14px;
            margin-right: 10px;
            text-decoration: none;
            padding-bottom: 0;
            border: 0;
          }
          span {
            font-size: 14px;
            margin-right: 5px;
          }
          ul {
            margin: 0;
            padding: 0;
          }
          button:before {
            align-self: center;
            border-style: solid;
            border-width: 6px 4px 0 4px;
            border-color: #ffffff transparent transparent transparent;
            content: "";
            height: 0;
            margin-right: 5px;
            width: 0;
          }
        `}</style>
      </section>
    );
  }
}

export default createPaginationContainer(
  PostList,
  graphql.experimental`
    fragment PostList on Viewer @argumentDefinitions(
      count: {type: "Int", defaultValue: 10}
      cursor: {type: "String"}
    ) {
      allPosts(orderBy: createdAt_DESC, after: $cursor, first: $count)
      @connection(key: "PostList_allPosts") {
        count
        edges {
          node {
            id
            title
            url
            createdAt
            ...PostUpvoter
          }
        }
      }
    }
  `,
  {
    direction: 'forward',
    query: graphql.experimental`
      query PostListPaginationQuery(
        $count: Int
        $cursor: String
      ) {
        viewer {
          ...PostList @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
);
