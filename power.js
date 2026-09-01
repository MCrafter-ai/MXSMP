exports.handler = async function (event) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { signal } = JSON.parse(event.body);

    // Only the "start" signal is allowed
    const ALLOWED_SIGNALS = ['start'];
    if (!ALLOWED_SIGNALS.includes(signal)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid signal. Only "start" is allowed.' })
      };
    }

    const SERVER_ID = '3381399';
    // Access the API key stored safely in Netlify Environment Variables
    const API_KEY = process.env.FALIX_API_KEY;

    const response = await fetch(`https://client.falixnodes.net/api/client/servers/${SERVER_ID}/power`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ signal })
    });

    if (!response.ok) {
      return { statusCode: response.status, body: JSON.stringify({ error: `API Error: ${response.statusText}` }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Successfully sent ${signal} signal!` })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
