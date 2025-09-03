import { NextRequest } from 'next/server'
import { POST, GET } from '../route'
import { supabase } from '@/lib/supabaseClient'
import { getCurrentUser } from '@/lib/supabaseClient'

// Mock the Supabase client for integration testing
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: jest.fn()
  },
  getCurrentUser: jest.fn()
}))

const mockSupabase = supabase as jest.Mocked<typeof supabase>
const mockGetCurrentUser = getCurrentUser as jest.MockedFunction<typeof getCurrentUser>

describe('Polls API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Complete Poll Creation Flow', () => {
    it('should handle the complete poll creation workflow from request to database', async () => {
      // Arrange - Mock authenticated user
      const mockUser = {
        id: 'user-456',
        email: 'integration@test.com',
        created_at: '2023-01-01T00:00:00Z'
      }
      mockGetCurrentUser.mockResolvedValue(mockUser as any)

      // Mock the complete Supabase chain for poll creation
      const mockCreatedPoll = {
        id: 'poll-integration-123',
        title: 'Integration Test Poll',
        description: 'Testing the complete poll creation flow',
        options: ['Choice A', 'Choice B', 'Choice C'],
        created_by: 'user-456',
        created_at: '2023-01-01T12:00:00Z',
        updated_at: '2023-01-01T12:00:00Z'
      }

      const mockInsertChain = {
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: mockCreatedPoll,
            error: null
          })
        })
      }

      const mockFromChain = {
        insert: jest.fn().mockReturnValue(mockInsertChain)
      }

      mockSupabase.from.mockReturnValue(mockFromChain as any)

      // Create a realistic request
      const pollData = {
        title: 'Integration Test Poll',
        description: 'Testing the complete poll creation flow',
        options: ['Choice A', 'Choice B', 'Choice C']
      }

      const request = new NextRequest('http://localhost:3000/api/polls', {
        method: 'POST',
        body: JSON.stringify(pollData),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-jwt-token'
        }
      })

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert - Verify the complete flow
      expect(response.status).toBe(201)
      expect(responseData.poll).toEqual(mockCreatedPoll)
      expect(responseData.message).toBe('Poll created successfully')

      // Verify authentication was checked
      expect(mockGetCurrentUser).toHaveBeenCalledTimes(1)

      // Verify database operations
      expect(mockSupabase.from).toHaveBeenCalledWith('polls')
      expect(mockFromChain.insert).toHaveBeenCalledWith([{
        title: 'Integration Test Poll',
        description: 'Testing the complete poll creation flow',
        options: ['Choice A', 'Choice B', 'Choice C'],
        created_by: 'user-456'
      }])
      expect(mockInsertChain.select).toHaveBeenCalled()
      expect(mockInsertChain.select().single).toHaveBeenCalled()
    })

    it('should handle poll creation with minimal required data', async () => {
      // Arrange
      const mockUser = { id: 'user-minimal', email: 'minimal@test.com' }
      mockGetCurrentUser.mockResolvedValue(mockUser as any)

      const mockCreatedPoll = {
        id: 'poll-minimal-123',
        title: 'Minimal Poll',
        description: null,
        options: ['Yes', 'No'],
        created_by: 'user-minimal',
        created_at: '2023-01-01T12:00:00Z',
        updated_at: '2023-01-01T12:00:00Z'
      }

      const mockInsertChain = {
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: mockCreatedPoll,
            error: null
          })
        })
      }

      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue(mockInsertChain)
      } as any)

      // Minimal poll data (no description)
      const minimalPollData = {
        title: 'Minimal Poll',
        options: ['Yes', 'No']
      }

      const request = new NextRequest('http://localhost:3000/api/polls', {
        method: 'POST',
        body: JSON.stringify(minimalPollData),
        headers: { 'Content-Type': 'application/json' }
      })

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(201)
      expect(responseData.poll.title).toBe('Minimal Poll')
      expect(responseData.poll.description).toBeNull()
      expect(responseData.poll.options).toEqual(['Yes', 'No'])
      expect(responseData.poll.created_by).toBe('user-minimal')
    })

    it('should validate and sanitize poll data before database insertion', async () => {
      // Arrange
      const mockUser = { id: 'user-sanitize', email: 'sanitize@test.com' }
      mockGetCurrentUser.mockResolvedValue(mockUser as any)

      const mockCreatedPoll = {
        id: 'poll-sanitized-123',
        title: 'Sanitized Poll',
        description: 'Cleaned description',
        options: ['Clean Option 1', 'Clean Option 2'],
        created_by: 'user-sanitize',
        created_at: '2023-01-01T12:00:00Z',
        updated_at: '2023-01-01T12:00:00Z'
      }

      const mockInsertChain = {
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: mockCreatedPoll,
            error: null
          })
        })
      }

      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue(mockInsertChain)
      } as any)

      // Poll data with extra whitespace that should be trimmed
      const rawPollData = {
        title: '  Sanitized Poll  ',
        description: '  Cleaned description  ',
        options: ['  Clean Option 1  ', '  Clean Option 2  ', '  '] // Last option should be filtered out
      }

      const request = new NextRequest('http://localhost:3000/api/polls', {
        method: 'POST',
        body: JSON.stringify(rawPollData),
        headers: { 'Content-Type': 'application/json' }
      })

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert - Verify data was sanitized before database insertion
      expect(response.status).toBe(201)
      
      // Check that the insert was called with sanitized data
      const insertCall = mockSupabase.from().insert.mock.calls[0][0][0]
      expect(insertCall.title).toBe('Sanitized Poll') // Trimmed
      expect(insertCall.description).toBe('Cleaned description') // Trimmed
      expect(insertCall.options).toEqual(['Clean Option 1', 'Clean Option 2']) // Trimmed and filtered
      expect(insertCall.created_by).toBe('user-sanitize')
    })
  })

  describe('Error Handling Integration', () => {
    it('should handle authentication failure in the complete flow', async () => {
      // Arrange - Mock authentication failure
      mockGetCurrentUser.mockResolvedValue(null)

      const pollData = {
        title: 'Test Poll',
        options: ['A', 'B']
      }

      const request = new NextRequest('http://localhost:3000/api/polls', {
        method: 'POST',
        body: JSON.stringify(pollData),
        headers: { 'Content-Type': 'application/json' }
      })

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(401)
      expect(responseData.error).toBe('Authentication required')
      
      // Verify no database operations were attempted
      expect(mockSupabase.from).not.toHaveBeenCalled()
    })

    it('should handle database connection failure gracefully', async () => {
      // Arrange
      const mockUser = { id: 'user-db-error', email: 'dberror@test.com' }
      mockGetCurrentUser.mockResolvedValue(mockUser as any)

      // Mock database error
      const mockInsertChain = {
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { 
              message: 'Connection timeout',
              code: 'PGRST301',
              details: 'Database connection failed'
            }
          })
        })
      }

      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockReturnValue(mockInsertChain)
      } as any)

      const pollData = {
        title: 'Database Error Test',
        options: ['A', 'B']
      }

      const request = new NextRequest('http://localhost:3000/api/polls', {
        method: 'POST',
        body: JSON.stringify(pollData),
        headers: { 'Content-Type': 'application/json' }
      })

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(responseData.error).toBe('Failed to create poll')
      
      // Verify the complete database chain was attempted
      expect(mockSupabase.from).toHaveBeenCalledWith('polls')
      expect(mockSupabase.from().insert).toHaveBeenCalled()
      expect(mockInsertChain.select).toHaveBeenCalled()
      expect(mockInsertChain.select().single).toHaveBeenCalled()
    })
  })
})

