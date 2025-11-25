export default async function handler(req, res) {
  const url = `http://44.222.129.141:7350${req.url}`;

  const response = await fetch(url, {
    method: req.method,
    headers: req.headers,
    body: req.body,
  });

  const body = await response.text();
  res.status(response.status).send(body);
}
