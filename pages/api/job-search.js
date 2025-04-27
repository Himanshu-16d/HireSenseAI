import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { query = '', location = 'India' } = req.query;

  const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'ba4bbabc0emshae9e858121c9906p1ae9bejsn0f6bf1d21e25',
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
      },
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 