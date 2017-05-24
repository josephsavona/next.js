[![Deploy to now](https://deploy.now.sh/static/button.svg)](https://deploy.now.sh/?repo=https://github.com/zeit/next.js/tree/master/examples/with-relay)
# Relay Modern Example

## Demo

https://next-with-relay.now.sh

## How to use

Download the example [or clone the repo](https://github.com/zeit/next.js):

```bash
curl https://codeload.github.com/zeit/next.js/tar.gz/master | tar -xz --strip=2 next.js-master/examples/with-relay
cd with-relay
```

Install it and run:

```bash
npm install
npm run dev
```

Deploy it to the cloud with [now](https://zeit.co/now) ([download](https://zeit.co/download)):

```bash
now
```

## The idea behind the example

Integrates next.js and Relay Modern, allowing pages to specify their data
dependencies as GraphQL queries that are fetched and cached by Relay. A HOC
implements `getInitialProps`, populating it with the query response.
