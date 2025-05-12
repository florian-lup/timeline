import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/utils/apiHelpers';
import { validateCronAuth } from '@/utils/authHelpers';
import { config } from '@/lib/config';
import { runEventPipeline } from '@/features/events/services/pipelineService';

/**
 * GET handler for cron jobs to trigger the event pipeline
 */
export async function GET(request: NextRequest) {
  // Check for authorization
  const authError = validateCronAuth(request, config.security.cronSecret);
  if (authError) {
    return authError;
  }

  try {
    // Run the event pipeline
    const result = await runEventPipeline();
    
    if (!result.success) {
      return errorResponse(
        result.error || 'Failed to execute event pipeline', 
        500
      );
    }
    
    return successResponse({ 
      success: true,
      message: result.message || 'Event pipeline executed successfully',
      stats: {
        totalEvents: result.totalEvents,
        uniqueEvents: result.uniqueEvents
      }
    });
  } catch (error) {
    console.error('Unexpected error executing event pipeline:', error);
    return errorResponse(
      'Failed to execute event pipeline', 
      500, 
      error
    );
  }
} 