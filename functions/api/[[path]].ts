interface Env {
  ANTHROPIC_API_KEY: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  // Get the request from the client
  let request = context.request;

  // The original URL of the request
  let url = new URL(request.url);

  // The path of the request (e.g., /v1/messages)
  let path = url.pathname.replace(/^\/api/, '');

  // The target API URL
  let apiUrl = `https://api.anthropic.com${path}`;

  // Get the API key from the environment variables
  const apiKey = context.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return new Response("ANTHROPIC_API_KEY is not set", { status: 500 });
  }

  // Create new headers for the API request
  let headers = new Headers(request.headers);
  headers.set('x-api-key', apiKey);
  headers.set('host', 'api.anthropic.com');
  headers.delete('origin'); // The origin of the request is the Cloudflare Pages URL, which we don't want to send to the Anthropic API
  headers.delete('referer');

  // Create the API request
  let apiRequest = new Request(apiUrl, {
    method: request.method,
    headers: headers,
    body: request.body,
    redirect: 'follow'
  });

  // Make the API request
  let response = await fetch(apiRequest);

  // Return the API response to the client
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
}