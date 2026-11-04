import { cn } from "cn"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number
  height?: string | number
}

const Skeleton = ({ className, width, height, ...props }: SkeletonProps) => {
  return (
    <div
    data-testid="skeleton"
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className
      )}
      style={{ width, height }}
      {...props}
    />
  )
}

export default Skeleton