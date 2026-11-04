import Skeleton from "../ui/Skeleton"


const CardSkeleton = () => {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton data-testid="skeleton" className="aspect-3/4 w-full rounded-lg" />
      <Skeleton data-testid="skeleton" className="h-4 w-3/4" />
      <Skeleton data-testid="skeleton" className="h-3 w-1/2" />
    </div>
  )
}

export default CardSkeleton