import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 m-4 rounded-xl bg-rose/10 border border-rose/20 text-center text-sm text-ink">
          <p>Something went wrong loading this section.</p>
        </div>
      )
    }
    return this.props.children
  }
}
