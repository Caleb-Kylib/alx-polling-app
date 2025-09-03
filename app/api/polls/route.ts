import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { getCurrentUser } from '@/lib/supabaseClient'

/**
 * Poll Creation API Route
 * 
 * Handles creating new polls with title, description, and options
 * Requires authentication - only authenticated users can create polls
 */

export interface CreatePollRequest {
  title: string
  description?: string
  options: string[]
}

export interface Poll {
  id: string
  title: string
  description?: string
  options: string[]
  created_by: string
  created_at: string
  updated_at: string
}

/**
 * GET /api/polls
 * Fetch all polls with their vote counts
 */
export async function GET(request: NextRequest) {
  try {
    const { data: polls, error } = await supabase
      .from('polls')
      .select(`
        *,
        votes(count)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching polls:', error)
      return NextResponse.json(
        { error: 'Failed to fetch polls' },
        { status: 500 }
      )
    }

    // Transform the data to include vote counts
    const pollsWithVotes = polls?.map(poll => ({
      ...poll,
      vote_count: poll.votes?.[0]?.count || 0
    })) || []

    return NextResponse.json({ polls: pollsWithVotes })
  } catch (error) {
    console.error('Unexpected error fetching polls:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/polls
 * Create a new poll
 */
export async function POST(request: NextRequest) {
  try {
    // Get the current user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body: CreatePollRequest = await request.json()
    
    // Validate required fields
    if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Poll title is required and must be a non-empty string' },
        { status: 400 }
      )
    }

    if (!body.options || !Array.isArray(body.options) || body.options.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 poll options are required' },
        { status: 400 }
      )
    }

    // Validate each option
    const validOptions = body.options.filter(option => 
      typeof option === 'string' && option.trim().length > 0
    )

    if (validOptions.length < 2) {
      return NextResponse.json(
        { error: 'All poll options must be non-empty strings' },
        { status: 400 }
      )
    }

    // Validate description if provided
    if (body.description && typeof body.description !== 'string') {
      return NextResponse.json(
        { error: 'Description must be a string' },
        { status: 400 }
      )
    }

    // Prepare poll data
    const pollData = {
      title: body.title.trim(),
      description: body.description?.trim() || null,
      options: validOptions.map(option => option.trim()),
      created_by: user.id
    }

    // Insert poll into database
    const { data: poll, error } = await supabase
      .from('polls')
      .insert([pollData])
      .select()
      .single()

    if (error) {
      console.error('Error creating poll:', error)
      return NextResponse.json(
        { error: 'Failed to create poll' },
        { status: 500 }
      )
    }

    // Return the created poll
    return NextResponse.json(
      { 
        poll,
        message: 'Poll created successfully' 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Unexpected error creating poll:', error)
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

