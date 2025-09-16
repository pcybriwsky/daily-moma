export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const objectId = searchParams.get('objectId');
    
    if (!objectId) {
      return Response.json({ error: 'ObjectID is required' }, { status: 400 });
    }

    // Clean the objectId (remove any extra characters like ":1")
    const cleanObjectId = objectId.split(':')[0];
    
    // For now, return a placeholder image URL since MoMA is blocking our scraping attempts
    // This provides a better user experience than showing broken images
    const placeholderImageUrl = `https://via.placeholder.com/400x300/0066cc/ffffff?text=MoMA+Artwork+${cleanObjectId}`;
    
    console.log(`Returning placeholder image for ObjectID: ${cleanObjectId}`);
    
    return Response.json({ 
      imageUrl: placeholderImageUrl,
      source: 'placeholder',
      objectId: cleanObjectId,
      note: 'Image scraping temporarily disabled due to MoMA blocking requests'
    });

  } catch (error) {
    console.error('Error in image API:', error);
    return Response.json({ 
      error: error.message,
      objectId: searchParams.get('objectId')
    }, { status: 500 });
  }
}
