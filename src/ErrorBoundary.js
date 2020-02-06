import React from 'react'

class ErrorBoundary extends React.Component {
  state = {
    hasError: false
  }

  componentDidCatch(error, info) {
    console.log({ error, info })
    this.setState({
      hasError: true
    });
  }

  render() {
    if (this.state.hasError) {
      return <div style={{color:'red'}}>Something went wrong.</div>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary
