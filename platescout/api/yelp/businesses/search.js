export default async function handler(req, res) {
  const params = new URLSearchParams(req.query);
  const response = await fetch(
    `https://api.yelp.com/v3/businesses/search?${params}`,
    { headers: { Authorization: `Bearer ${process.env.VITE_YELP_KEY}` } }
  );
  const data = await response.json();
  res.status(response.status).json(data);
}
