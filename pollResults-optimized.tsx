// AFTER: Optimized poll results rendering logic

// Memoized sorted options with pre-calculated percentages
const sortedOptionsWithPercentages = useMemo(() => {
  return poll.options
    .map(option => ({
      ...option,
      percentage: calculatePercentage(option.votes)
    }))
    .sort((a, b) => b.votes - a.votes)
}, [poll.options, poll.totalVotes])

// Memoized result option component
const ResultOption = ({ option }: { option: typeof sortedOptionsWithPercentages[0] }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <span className="font-medium">{option.text}</span>
      <span className="text-sm text-muted-foreground">
        {option.votes} votes ({option.percentage}%)
      </span>
    </div>
    <div className="w-full bg-secondary rounded-full h-2">
      <div 
        className="bg-primary h-2 rounded-full transition-all duration-500"
        style={{ width: `${option.percentage}%` }}
      />
    </div>
  </div>
)

// Clean, simple rendering
<div className="space-y-3">
  {sortedOptionsWithPercentages.map((option) => (
    <ResultOption key={option.id} option={option} />
  ))}
</div>
