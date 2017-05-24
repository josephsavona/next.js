import React from 'react'
import {commitMutation, createFragmentContainer, graphql} from 'react-relay'

const PostUpvoterMutation = graphql`
  mutation PostUpvoterMutation($input: UpdatePostInput!) {
    updatePost(input: $input) {
      post {
        id
        votes
      }
    }
  }
`;

class PostUpvoter extends React.Component {
  upvote = () => {
    const {id, votes} = this.props.data;
    const nextVotes = votes + 1;
    commitMutation(this.props.relay.environment, {
      mutation: PostUpvoterMutation,
      onError: error => console.error(error),
      optimisticUpdater: store => {
        const post = store.get(id);
        if (post) {
          post.setValue(nextVotes, 'votes');
        }
      },
      variables: {
        // the single input argument restriction is lifted in Relay Modern, but
        // graph.cool still generates schemas this way
        input: {
          clientMutationId: '0', // not needed by Relay Modern, graph.cool still makes this non-nullable though
          id,
          votes: nextVotes,
        },
      },
    });
  };

  render() {
    const {votes} = this.props.data;
    return (
      <button onClick={() => this.upvote()}>
        {votes}
        <style jsx>{`
          button {
            background-color: transparent;
            border: 1px solid #e4e4e4;
            color: #000;
          }
          button:active {
            background-color: transparent;
          }
          button:before {
            align-self: center;
            border-color: transparent transparent #000000 transparent;
            border-style: solid;
            border-width: 0 4px 6px 4px;
            content: "";
            height: 0;
            margin-right: 5px;
            width: 0;
          }
        `}</style>
      </button>
    );
  }
}

export default createFragmentContainer(PostUpvoter, graphql`
  fragment PostUpvoter on Post {
    id
    votes
  }
`);

