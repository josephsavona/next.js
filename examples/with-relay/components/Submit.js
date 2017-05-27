import React from 'react'
import { ConnectionHandler } from 'relay-runtime';
import { commitMutation, createFragmentContainer, graphql} from 'react-relay'

const SubmitCreatePostMutation = graphql`
  mutation SubmitCreatePostMutation($input: CreatePostInput!) {
    createPost(input: $input) {
      edge {
        node {
          id
          title
          votes
          url
          createdAt
        }
      }
    }
  }
`;

class Submit extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      title: '',
      url: '',
    };
  }

  createPost(title, url) {
    commitMutation(this.props.relay.environment, {
      mutation: SubmitCreatePostMutation,
      variables: {
        input: {
          clientMutationId: '0',
          title,
          url,
          votes: 0,
        },
      },
      optimisticResponse: () => ({
        createPost: {
          edge: {
            node: {
              createdAt: null,
              id: null,
              title,
              url,
              votes: 0,
            },
          },
        },
      }),
      updater: store => {
        const createPost = store.getRootField('createPost');
        const edge = createPost && createPost.getLinkedRecord('edge');
        const post = edge && edge.getLinkedRecord('node');
        const viewer = store.getRoot().getLinkedRecord('__viewer_viewer');
        const posts = viewer && ConnectionHandler.getConnection(
          viewer,
          'PostList_allPosts',
          {orderBy: 'createdAt_DESC'},
        );
        if (posts && post) {
          ConnectionHandler.insertEdgeBefore(posts, post);
        }
      },
    });
  }

  handleInput = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = e => {
    e.preventDefault()

    let {title, url} = this.state;

    if (title === '' || url === '') {
      window.alert('Both fields are required.')
      return false
    }

    // prepend http if missing from url
    if (!url.match(/^[a-zA-Z]+:\/\//)) {
      url = `http://${url}`
    }

    this.createPost(title, url)
    this.setState({
      title: '',
      url: '',
    });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h1>Submit</h1>
        <input placeholder='title' name='title' value={this.state.title} onChange={this.handleInput} />
        <input placeholder='url' name='url' value={this.state.url} onChange={this.handleInput} />
        <button type='submit'>Submit</button>
        <style jsx>{`
          form {
            border-bottom: 1px solid #ececec;
            padding-bottom: 20px;
            margin-bottom: 20px;
          }
          h1 {
            font-size: 20px;
          }
          input {
            display: block;
            margin-bottom: 10px;
          }
        `}</style>
      </form>
    );
  }
}

export default createFragmentContainer(Submit, graphql`
  fragment Submit on Viewer {
    # dummy field
    user {
      id
    }
  }
`);
