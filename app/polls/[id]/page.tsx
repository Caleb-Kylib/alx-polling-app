'use client'

import { useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { CheckCircle, BarChart3 } from 'lucide-react'

// Mock poll data - in a real app, this would come from Supabase
const mockPolls = {
  '1': {
    id: '1',
    title: 'What is your favorite programming language?',
    description: 'Help us understand the developer community preferences.',
    options: [
      { id: '1', text: 'JavaScript/TypeScript', votes: 45 },
      { id: '2', text: 'Python', votes: 32 },
      { id: '3', text: 'Java', votes: 28 },
      { id: '4', text: 'C#', votes: 15 },
      { id: '5', text: 'Go', votes: 12 }
    ],
    totalVotes: 132,
    created_at: '2024-01-15T10:30:00Z',
    expires_at: '2024-02-15T23:59:59Z'
  },
  '2': {
    id: '2',
    title: 'Which framework do you prefer for building web apps?',
    description: 'Share your experience with modern web frameworks.',
    options: [
      { id: '1', text: 'Next.js', votes: 38 },
      { id: '2', text: 'React', votes: 35 },
      { id: '3', text: 'Vue.js', votes: 20 },
      { id: '4', text: 'Angular', votes: 15 },
      { id: '5', text: 'Svelte', votes: 8 }
    ],
    totalVotes: 116,
    created_at: '2024-01-10T14:20:00Z',
    expires_at: '2024-02-10T23:59:59Z'
  }
}

type Poll = typeof mockPolls['1']

export default function PollDetailPage() {
  const params = useParams()
  const pollId = params.id as string
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [hasVoted, setHasVoted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get poll data - in a real app, this would be fetched from Supabase
  const poll: Poll | undefined = mockPolls[pollId as keyof typeof mockPolls]

  if (!poll) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Poll not found
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleVote = async () => {
    if (!selectedOption) return

    setIsSubmitting(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In a real app, this would submit to Supabase
    console.log('Voting for option:', selectedOption, 'in poll:', pollId)
    
    setHasVoted(true)
    setIsSubmitting(false)
  }

  const handleViewResults = () => {
    setShowResults(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculatePercentage = (votes: number) => {
    return poll.totalVotes > 0 ? Math.round((votes / poll.totalVotes) * 100) : 0
  }

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

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{poll.title}</CardTitle>
            {poll.description && (
              <p className="text-muted-foreground">{poll.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Created: {formatDate(poll.created_at)}</span>
              <span>•</span>
              <span>Expires: {formatDate(poll.expires_at)}</span>
              <span>•</span>
              <span>{poll.totalVotes} votes</span>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {!hasVoted && !showResults && (
              <>
                <div className="space-y-4">
                  <Label className="text-base font-medium">
                    Select your answer:
                  </Label>
                  <RadioGroup
                    value={selectedOption}
                    onValueChange={setSelectedOption}
                    className="space-y-3"
                  >
                    {poll.options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label 
                          htmlFor={option.id} 
                          className="flex-1 cursor-pointer text-base"
                        >
                          {option.text}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <Button 
                  onClick={handleVote}
                  disabled={!selectedOption || isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Vote'}
                </Button>
              </>
            )}

            {hasVoted && !showResults && (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-600 mb-2">
                    Thank you for voting!
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Your vote has been recorded successfully.
                  </p>
                  <Button 
                    onClick={handleViewResults}
                    variant="outline"
                    className="w-full"
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Results
                  </Button>
                </div>
              </div>
            )}

            {showResults && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Poll Results</h3>
                </div>
                
                <div className="space-y-3">
                  {sortedOptionsWithPercentages.map((option) => (
                    <ResultOption key={option.id} option={option} />
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <p className="text-center text-sm text-muted-foreground">
                    Total votes: {poll.totalVotes}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
