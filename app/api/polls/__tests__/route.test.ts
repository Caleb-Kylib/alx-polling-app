import { NextRequest } from 'next/server'
import { POST, GET } from '../route'
import { supabase } from '@/lib/supabaseClient'
import { getCurrentUser } from '@/lib/supabaseClient'

// Mock the Supabase client
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => ({
          data: [],
          error: null
        }))
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({
            data: null,
            error: null
          }))
        }))
      }))
    }))
  },
  getCurrentUser: jest.fn()
}))

const mockSupabase = supabase as jest.Mocked<typeof supabase>
const mockGetCurrentUser = getCurrentUser as jest.MockedFunction<typeof getCurrentUser>

describe('Polls API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/polls - Poll Creation', () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com'
    }

    const validPollData = {
      title: 'Test Poll',
      description: 'A test poll description',
      options: ['Option 1', 'Option 2', 'Option 3']
    }

    it('should successfully create a poll with valid data and verify complete database interaction', async () => {
      // Arrange - Set up comprehensive test data
      const authenticatedUser = {
        id: 'user-123',
        email: 'test@example.com',
        created_at: '2023-01-01T00:00:00Z'
      }
      mockGetCurrentUser.mockResolvedValue(authenticatedUser as any)
      
      const expectedCreatedPoll = {
        id: 'poll-123',
        title: 'Test Poll',
        description: 'A test poll description',
        options: ['Option 1', 'Option 2', 'Option 3'],
        created_by: 'user-123',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      }

      // Mock the complete Supabase chain with proper method chaining
      const mockSingle = jest.fn().mockResolvedValue({
        data: expectedCreatedPoll,
        error: null
      })
      
      const mockSelect = jest.fn().mockReturnValue({
        single: mockSingle
      })
      
      const mockInsert = jest.fn().mockReturnValue({
        select: mockSelect
      })
      
      mockSupabase.from.mockReturnValue({
        insert: mockInsert
      } as any)

      const request = new NextRequest('http://localhost:3000/api/polls', {
        method: 'POST',
        body: JSON.stringify(validPollData),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert - Comprehensive verification of response structure and database calls
      expect(response.status).toBe(201)
      expect(response.headers.get('content-type')).toContain('application/json')
      
      // Verify response structure matches expected format
      expect(responseData).toHaveProperty('poll')
      expect(responseData).toHaveProperty('message')
      expect(responseData.poll).toEqual(expectedCreatedPoll)
      expect(responseData.message).toBe('Poll created successfully')
      
      // Verify poll data structure integrity
      expect(responseData.poll).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        description: expect.any(String),
        options: expect.arrayContaining([expect.any(String)]),
        created_by: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String)
      })
      
      // Verify authentication was properly checked
      expect(mockGetCurrentUser).toHaveBeenCalledTimes(1)
      expect(mockGetCurrentUser).toHaveBeenCalledWith()
      
      // Verify complete database interaction chain
      expect(mockSupabase.from).toHaveBeenCalledTimes(1)
      expect(mockSupabase.from).toHaveBeenCalledWith('polls')
      expect(mockInsert).toHaveBeenCalledTimes(1)
      expect(mockInsert).toHaveBeenCalledWith([{
        title: 'Test Poll',
        description: 'A test poll description',
        options: ['Option 1', 'Option 2', 'Option 3'],
        created_by: 'user-123'
      }])
      expect(mockSelect).toHaveBeenCalledTimes(1)
      expect(mockSelect).toHaveBeenCalledWith()
      expect(mockSingle).toHaveBeenCalledTimes(1)
      expect(mockSingle).toHaveBeenCalledWith()
    })

    it('should reject poll creation when user is not authenticated', async () => {
      // Arrange
      mockGetCurrentUser.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/polls', {
        method: 'POST',
        body: JSON.stringify(validPollData),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(401)
      expect(responseData).toEqual({
        error: 'Authentication required'
      })
      expect(mockGetCurrentUser).toHaveBeenCalledTimes(1)
      expect(mockSupabase.from).not.toHaveBeenCalled()
    })

    it('should reject poll creation with invalid title', async () => {
      // Arrange
      mockGetCurrentUser.mockResolvedValue(mockUser as any)

      const invalidPollData = {
        title: '', // Empty title
        description: 'A test poll description',
        options: ['Option 1', 'Option 2']
      }

      const request = new NextRequest('http://localhost:3000/api/polls', {
        method: 'POST',
        body: JSON.stringify(invalidPollData),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(responseData).toEqual({
        error: 'Poll title is required and must be a non-empty string'
      })
      expect(mockSupabase.from).not.toHaveBeenCalled()
    })

    it('should reject poll creation with insufficient options', async () => {
      // Arrange
      mockGetCurrentUser.mockResolvedValue(mockUser as any)

      const invalidPollData = {
        title: 'Test Poll',
        description: 'A test poll description',
        options: ['Only one option'] // Only one option
      }

      const request = new NextRequest('http://localhost:3000/api/polls', {
        method: 'POST',
        body: JSON.stringify(invalidPollData),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(responseData).toEqual({
        error: 'At least 2 poll options are required'
      })
      expect(mockSupabase.from).not.toHaveBeenCalled()
    })

    it('should handle database errors gracefully', async () => {
      // Arrange
      mockGetCurrentUser.mockResolvedValue(mockUser as any)

      const mockInsert = {
        select: jest.fn(() => ({
          single: jest.fn(() => ({
            data: null,
            error: { message: 'Database connection failed' }
          }))
        }))
      }
      
      mockSupabase.from.mockReturnValue({
        insert: jest.fn(() => mockInsert)
      } as any)

      const request = new NextRequest('http://localhost:3000/api/polls', {
        method: 'POST',
        body: JSON.stringify(validPollData),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(responseData).toEqual({
        error: 'Failed to create poll'
      })
    })

    it('should handle malformed JSON in request body', async () => {
      // Arrange
      mockGetCurrentUser.mockResolvedValue(mockUser as any)

      const request = new NextRequest('http://localhost:3000/api/polls', {
        method: 'POST',
        body: 'invalid json',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      // Act
      const response = await POST(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(responseData).toEqual({
        error: 'Invalid JSON in request body'
      })
    })
  })

  describe('GET /api/polls - Fetch Polls', () => {
    it('should successfully fetch all polls with vote counts', async () => {
      // Arrange
      const mockPolls = [
        {
          id: 'poll-1',
          title: 'Poll 1',
          description: 'Description 1',
          options: ['A', 'B'],
          created_by: 'user-1',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
          votes: [{ count: 5 }]
        },
        {
          id: 'poll-2',
          title: 'Poll 2',
          description: 'Description 2',
          options: ['X', 'Y', 'Z'],
          created_by: 'user-2',
          created_at: '2023-01-02T00:00:00Z',
          updated_at: '2023-01-02T00:00:00Z',
          votes: [{ count: 0 }]
        }
      ]

      const mockSelect = {
        order: jest.fn(() => ({
          data: mockPolls,
          error: null
        }))
      }
      
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => mockSelect)
      } as any)

      const request = new NextRequest('http://localhost:3000/api/polls')

      // Act
      const response = await GET(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(responseData.polls).toHaveLength(2)
      expect(responseData.polls[0]).toEqual({
        ...mockPolls[0],
        vote_count: 5
      })
      expect(responseData.polls[1]).toEqual({
        ...mockPolls[1],
        vote_count: 0
      })
    })

    it('should handle database errors when fetching polls', async () => {
      // Arrange
      const mockSelect = {
        order: jest.fn(() => ({
          data: null,
          error: { message: 'Database query failed' }
        }))
      }
      
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => mockSelect)
      } as any)

      const request = new NextRequest('http://localhost:3000/api/polls')

      // Act
      const response = await GET(request)
      const responseData = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(responseData).toEqual({
        error: 'Failed to fetch polls'
      })
    })
  })
})
