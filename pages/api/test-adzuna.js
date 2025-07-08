import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
  const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;

  if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
    return res.status(500).json({
      success: false,
      error: 'Adzuna API credentials not configured',
      debug: {
        hasAppId: !!ADZUNA_APP_ID,
        hasAppKey: !!ADZUNA_APP_KEY
      }
    });
  }

  try {
    // Test a simple search for developer jobs in India
    const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?` +
      `app_id=${ADZUNA_APP_ID}` +
      `&app_key=${ADZUNA_APP_KEY}` +
      `&results_per_page=5` +
      `&what=developer` +
      `&content-type=application/json`;

    console.log('Testing Adzuna API with URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Adzuna API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    res.status(200).json({
      success: true,
      message: 'Adzuna API test successful',
      data: {
        count: data.count,
        resultsReturned: data.results?.length || 0,
        results: data.results || [],
        mean: data.mean,
        __CLASS__: data.__CLASS__
      },
      url: url.replace(ADZUNA_APP_ID, '[APP_ID]').replace(ADZUNA_APP_KEY, '[APP_KEY]')
    });

  } catch (error) {
    console.error('Adzuna API test error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to test Adzuna API',
      debug: {
        hasCredentials: !!(ADZUNA_APP_ID && ADZUNA_APP_KEY)
      }
    });
  }
}
