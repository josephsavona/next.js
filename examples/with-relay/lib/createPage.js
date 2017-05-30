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
        const variables = getVariables != null
          ? getVariables(ctx.query)
          : ctx.query;
        const operation = createOperationSelector(getOperation(query), variables);
        const environment = getOrCreateEnvironment(createEnvironment);

        environment.toJSON = () => null; // don't try to serialize it from server to client
        const onCompleted = () => {
          new Promise(resolveCompleted => {
            const data = process.browser
              ? null
              : environment.getStore().getSource().toJSON();
            resolveCompleted({relay: {data, environment, variables}});
          }).then(resolve, reject);
        };
        environment.sendQuery({
          onCompleted,
          onError: reject,
          operation,
          variables: operation.variables,
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
      environment = environment || getOrCreateEnvironment(createEnvironment, data);
      this.relay = {
        environment,
        variables,
      };
      const operation = createOperationSelector(getOperation(query), variables);
      const snapshot = environment.lookup(operation.fragment);
      this.retain = environment.retain(operation.query);
      this.subscription = environment.subscribe(snapshot, nextSnapshot => {
        this.setState({
          data: nextSnapshot.data,
        });
      });
      return {
        data: snapshot.data,
      };
    }

    _teardown() {
      if (this.retain) {
        this.retain.dispose();
        this.retain = null;
      }
      if (this.subscription) {
        this.subscription.dispose();
        this.subscription = null;
      }
    }

    getChildContext() {
      return {
        relay: this.relay,
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
