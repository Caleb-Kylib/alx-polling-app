'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { AlertCircle } from 'lucide-react'

interface PollOption {
  id: string
  text: string
}

interface PollFormProps {
  question: string
  options: PollOption[]
  onSubmit: (selectedOption: string) => void
  isLoading?: boolean
}

export default function PollForm({ question, options, onSubmit, isLoading = false }: PollFormProps) {
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [showError, setShowError] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedOption) {
      setShowError(true)
      return
    }
    
    setShowError(false)
    onSubmit(selectedOption)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">{question}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base font-medium">
              Select your answer:
            </Label>
            <RadioGroup
              value={selectedOption}
              onValueChange={(value) => {
                setSelectedOption(value)
                if (showError) setShowError(false)
              }}
              className="space-y-3"
            >
              {options.map((option) => (
                <div key={option.id} className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label 
                    htmlFor={option.id} 
                    className="flex-1 cursor-pointer text-base font-normal"
                  >
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {showError && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
              <AlertCircle className="h-4 w-4" />
              <span>Please select an option before submitting your vote.</span>
            </div>
          )}

          <Button 
            type="submit"
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? 'Submitting...' : 'Submit Vote'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
