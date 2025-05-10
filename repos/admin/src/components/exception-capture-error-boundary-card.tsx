import * as Sentry from "@sentry/react"
import { Component, type ErrorInfo } from "react"

interface ExceptionCaptureErrorBoundaryCardProps {
  children?: React.ReactNode
  fallback?: React.ReactNode // Fallback UI to display when an error occurs
}

interface ExceptionCaptureErrorBoundaryCardState {
  hasError: boolean
  error: Error | null
}

export default class ExceptionCaptureErrorBoundaryCard extends Component<
  ExceptionCaptureErrorBoundaryCardProps,
  ExceptionCaptureErrorBoundaryCardState
> {
  state: ExceptionCaptureErrorBoundaryCardState = {
    hasError: false,
    error: null,
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to Sentry
    Sentry.captureException(error)
    console.error("Error caught in boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI when an error occurs
      return (
        <div className="bg-red-100 border border-red-500 p-4 rounded-md">
          <h2 className="text-red-600">یه مشکلی پیش آمده!</h2>
          {this.props.fallback || <p>این خطا برای ما ارسال شده، و روی آن کار خواهیم کرد</p>}
        </div>
      )
    }

    return <>{this.props.children}</>
  }
}
