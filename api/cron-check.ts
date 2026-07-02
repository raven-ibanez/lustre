import { createClient } from '@supabase/supabase-js';

// Fallback to VITE_ prefixed environment variables if standard ones are not set
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

export default async function handler(req: any, res: any) {
  // If CRON_SECRET is configured, secure this endpoint
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && req.headers.authorization !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(500).json({
      error: 'Supabase environment variables are missing',
      details: 'Please set SUPABASE_URL and SUPABASE_ANON_KEY (or VITE_ equivalents).'
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Make a simple query to keep the DB warm and verify database connection
    const { error } = await supabase
      .from('newsletter_signups')
      .select('id')
      .limit(1);

    if (error) {
      throw error;
    }

    return res.status(200).json({
      status: 'success',
      message: 'Database health check completed successfully',
      timestamp: new Date().toISOString(),
      active: true
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to connect to the database',
      error: error.message || error,
      timestamp: new Date().toISOString()
    });
  }
}
