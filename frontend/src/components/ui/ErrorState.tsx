import { AlertCircle, Loader2 } from "lucide-react"
import { Button } from "./button"

interface ErrorStateProps {
  message: string
  onRetry?: () => void
  isRetrying?: boolean
}

const ErrorState = ({ message, onRetry, isRetrying }: ErrorStateProps) => {
  return (
    <div className='flex flex-col items-center justify-center p-6 text-center gap-4 min-h-200'>
      <AlertCircle size={48} className='text-destructive'/>
      
      <p className='text-xl font-medium text-foreground'>{message}</p>

      {onRetry && (
        <Button
        disabled={isRetrying}
        onClick={onRetry}
        className='gap-2 p-6'
        >
          {isRetrying ? (
            <>
              <Loader2 data-testid='loader' className='animate-spin h-4 w-4'/>
              <span className='text-base text-text-foreground'>Tentando Novamente...</span>
            </>
          ) : (
            <span className='text-base text-text-foreground'>Tentar Novamente</span>
          )}
        </Button>
      )}
    </div>
  )
}

export default ErrorState