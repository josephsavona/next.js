import {Environment, RecordSource, Store, getOperation, createOperationSelector} from 'relay-runtime';
import RelayPropTypes from 'react-relay/lib/RelayPropTypes';

let browserEnvironment = null;

function getOrCreateEnvironment(createEnvironment, data) {
  if (process.browser) {
    if (browserEnvironment === null) {
      browserEnvironment = createEnvironment(data);
    }
    return browserEnvironment;
  } else {
    return createEnvironment(data);
  }
}

export default function createPage(createEnvironment, Component, query, getVariables) {
  class PageContainer extends React.Component {
    static async getInitialProps(ctx) {
      return new Promise((resolve, reject) => {
        const inputVariables = getVariables != null
          ? getVariables(ctx.query)
          : ctx.query;
        const operation = createOperationSelector(getOperation(query), inputVariables);
        const variables = operation.variables;
        const environment = getOrCreateEnvironment(createEnvironment);

        // If getInitialProps() and render() run in the same process (both
        // server or both client), then use the same `environment` to avoid
        // rehydrating from the record source. When transferring initial data
        // from server -> client, skip the environment.
        environment.toJSON = () => null;

        const onCompleted = () => {
          resolve({
            relay: {
              data : process.browser ? null : environment.getStore().getSource().toJSON(),
              environment,
              variables,
            },
          });
        };
        environment.sendQuery({
          onCompleted,
          onError: reject,
          operation,
        });
      });
    }

    constructor(props, context) {
      super(props, context);
      this.state = this._setup(props.relay);
    }

    componentWillReceiveProps(nextProps) {
      this._teardown();
      this.setState(this._setup(nextProps.relay));
    }

    componentWillUnmount() {
      this._teardown();
    }

    _setup({data, environment, variables}) {
      // When reviving server getInitialProps() on the client the environment
      // will be null, per the note above.
      environment = environment || getOrCreateEnvironment(createEnvironment, data);
      const operation = createOperationSelector(getOperation(query), variables);
      const snapshot = environment.lookup(operation.fragment);
      this._relay = {
        environment,
        variables: operation.variables,
      };
      this._retain = environment.retain(operation.query);
      this._subscription = environment.subscribe(snapshot, nextSnapshot => {
        this.setState({
          data: nextSnapshot.data,
        });
      });
      return {
        data: snapshot.data,
      };
    }

    _teardown() {
      if (this._retain) {
        this._retain.dispose();
        this._retain = null;
      }
      if (this._subscription) {
        this._subscription.dispose();
        this._subscription = null;
      }
    }

    getChildContext() {
      return {
        relay: this._relay,
      };
    }

    render() {
      return <Component {...this.props} data={this.state.data} />;
    }
  }

  PageContainer.childContextTypes = {
    relay: RelayPropTypes.Relay
  };

  return PageContainer;
}
