import { AlertCircle, Loader2 } from "lucide-react"
import { Button } from "radix-ui/toolbar"

interface ErrorStateProps {
  message: string
  onRetry?: () => void
  isRetrying?: boolean
}

const ErrorState = ({ message, onRetry, isRetrying }: ErrorStateProps) => {
  return (
    <div>
      <AlertCircle size={24} className='text-destructive'/>
      
      <p className='text-lg font-medium text-foreground'>{message}</p>

      {onRetry && (
        <Button
        disabled={isRetrying}
        onClick={onRetry}
        className='gap-2'
        >
          {isRetrying ? (
            <>
              <Loader2 className='animate-spin h-4 w-4'/>
              Tentando novamente...
            </>
          ) : (
            "Tentar novamente"
          )}
        </Button>
      )}
    </div>
  )
}

export default ErrorState