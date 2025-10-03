/**
 * Email utility for sending test emails.
 * 
 * IMPORTANT SECURITY NOTE:
 * This is scaffolding code for demo purposes only.
 * In production, email sending MUST be done through a backend edge function,
 * NOT from frontend code. API keys should NEVER be exposed in frontend code.
 * 
 * For production use:
 * 1. Create a Supabase Edge Function
 * 2. Store RESEND_API_KEY as a Supabase secret
 * 3. Call the edge function from frontend
 */

// Check if Resend API key is configured (DEMO ONLY - should be in backend)
export const resendEnabled = Boolean(import.meta.env.VITE_RESEND_API_KEY);
export const fromEmail = import.meta.env.VITE_FROM_EMAIL || 'hello@gocrusade.local';

interface SendEmailParams {
  to: string;
  subject: string;
  body: string;
}

/**
 * Send a test email using Resend.
 * 
 * DEMO MODE: If VITE_RESEND_API_KEY is not set, this will:
 * - Log the email to console
 * - Return a success response without actually sending
 * 
 * PRODUCTION: This should be replaced with a call to an edge function
 */
export async function sendTestEmail({ to, subject, body }: SendEmailParams): Promise<{
  success: boolean;
  message: string;
  emailId?: string;
}> {
  // Demo mode: log to console
  if (!resendEnabled) {
    console.log('📧 [DEMO MODE] Email would be sent:', {
      from: fromEmail,
      to,
      subject,
      body,
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      message: 'Email logged to console (demo mode)',
    };
  }

  try {
    // In a real implementation, this would call a Supabase edge function
    // that uses Resend on the backend. Example:
    //
    // const response = await supabase.functions.invoke('send-email', {
    //   body: { to, subject, body }
    // });
    //
    // For now, we'll simulate the call (DEMO ONLY)
    console.warn('⚠️ SECURITY WARNING: Resend API key detected in frontend code.');
    console.warn('⚠️ This is for demo purposes only. Move to edge function for production.');
    
    // Simulated response
    return {
      success: true,
      message: 'Email would be sent via Resend (not implemented in demo)',
      emailId: `demo-${Date.now()}`,
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

/**
 * Get the current email configuration status
 */
export function getEmailConfig() {
  return {
    enabled: resendEnabled,
    fromEmail,
    mode: resendEnabled ? 'configured' : 'demo',
  };
}
