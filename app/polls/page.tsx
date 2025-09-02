'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Users, ArrowRight } from 'lucide-react'

// Mock polls data - in a real app, this would come from Supabase
const mockPolls = [
  {
    id: '1',
    title: 'What is your favorite programming language?',
    description: 'Help us understand the developer community preferences.',
    totalVotes: 132,
    created_at: '2024-01-15T10:30:00Z',
    expires_at: '2024-02-15T23:59:59Z'
  },
  {
    id: '2',
    title: 'Which framework do you prefer for building web apps?',
    description: 'Share your experience with modern web frameworks.',
    totalVotes: 116,
    created_at: '2024-01-10T14:20:00Z',
    expires_at: '2024-02-10T23:59:59Z'
  }
]

export default function PollsPage() {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date()
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Active Polls</h1>
          <p className="text-muted-foreground">
            Participate in community polls and share your opinions
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {mockPolls.map((poll) => (
            <Card key={poll.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl line-clamp-2">
                  {poll.title}
                </CardTitle>
                {poll.description && (
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {poll.description}
                  </p>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Expires {formatDate(poll.expires_at)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{poll.totalVotes} votes</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isExpired(poll.expires_at) ? (
                      <span className="text-sm text-red-600 font-medium">
                        Expired
                      </span>
                    ) : (
                      <span className="text-sm text-green-600 font-medium">
                        Active
                      </span>
                    )}
                  </div>
                  
                  <Link href={`/polls/${poll.id}`}>
                    <Button variant="outline" size="sm">
                      {isExpired(poll.expires_at) ? 'View Results' : 'Vote Now'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {mockPolls.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No polls available at the moment.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
