const SEARCH_PATH = "/api/yelp/businesses/search";

async function searchBusinesses(term, location, sortBy){
    // Create URL search parameters using term, location, sort_by, and limit
    const params = new URLSearchParams({
        term,
        location,
        sort_by: sortBy,
        limit: "20",
    });

    // Send a fetch request to the Yelp backend search endpoint
    const res = await fetch(`${SEARCH_PATH}?${params}`);

    // Check if the response failed, throw an error if necessary
    if(!res.ok){
        throw new Error(`Yelp request failed (${res.status})`);
    }

    // Convert the response to JSON
    const data = await res.json();
    
    // Return the bussinesses array mapped into the format used by the Business component
    return data.businesses.map((business) => ({
        id: business.id,
        imageSrc: business.image_url,
        name: business.name,
        address: business.location.address1,
        city: business.location.city,
        state: business.location.state,
        zipCode: business.location.zip_code,
        category: business.categories[0].title,
        rating: business.rating,
        reviewCount: business.review_count,
    }));
}

export { searchBusinesses };