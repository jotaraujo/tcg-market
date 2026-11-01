import { Loader2 } from "lucide-react"

interface LoadingStateProps {
  message: string
}

const LoadingState = ({ message }: LoadingStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center gap-4 min-h-200">
      <Loader2 className="animate-spin h-8 w-8 text-primary" />
      <p className="text-lg font-medium text-foreground">{message}</p>
    </div>
  )
}

export default LoadingState