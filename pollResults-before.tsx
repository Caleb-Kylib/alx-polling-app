// BEFORE: Original poll results rendering logic
{poll.options
  .sort((a, b) => b.votes - a.votes)
  .map((option) => {
    const percentage = calculatePercentage(option.votes)
    return (
      <div key={option.id} className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium">{option.text}</span>
          <span className="text-sm text-muted-foreground">
            {option.votes} votes ({percentage}%)
          </span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  })}
