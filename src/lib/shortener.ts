export async function shortenUrl(longUrl: string): Promise<string> {
  try {
    // Call free is.gd API without CORS restrictions via JSONP/Fetch proxy
    const response = await fetch(
      `https://is.gd/create.php?format=json&url=${encodeURIComponent(longUrl)}`
    );
    
    if (!response.ok) {
      throw new Error(`Shortener network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.shorturl) {
      return data.shorturl;
    }
    
    throw new Error(data.errormessage || 'URL shortening failed');
  } catch (error) {
    console.warn('Primary shortener failed, returning raw payload URL:', error);
    // Graceful fallback to raw URL if API rate limits or network fails
    return longUrl;
  }
}