import { Component } from 'react';

/**
 * ErrorBoundary: if one page fails to draw, show a short message in its
 * place instead of a blank screen. The navigation and footer keep working,
 * so the visitor can carry on to any other page.
 *
 * App.jsx gives it a `key` that changes with the address, so moving to
 * another page clears the error.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error('This page could not be displayed.', error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <section className="page notfound">
        <div className="container">
          <div className="label label--gold">Something went wrong</div>
          <h1 className="page__title">This page could not be drawn.</h1>
          <p className="page__summary">The rest of the site is unaffected. Please try another page, or come back to this one later.</p>
          <a href={import.meta.env.BASE_URL} className="btn btn--solid">
            Back to the start
          </a>
        </div>
      </section>
    );
  }
}
