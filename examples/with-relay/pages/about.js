import App from '../components/App'
import Header from '../components/Header'

export default (props) => (
  <App>
    <Header pathname={props.url.pathname} />
    <article>
      <h1>The Idea Behind This Example</h1>
      <p>
        TODO: briefly introduce Relay Modern.
      </p>
      <p>
        This example relies on <a href='http://graph.cool'>graph.cool</a> for its GraphQL backend.
      </p>
    </article>
  </App>
)
