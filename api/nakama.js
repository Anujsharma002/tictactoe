export default async function handler(req, res) {
  // Capture everything after /api/nakama/
  const path = req.query.path.join("/");

  const url = `http://44.222.129.141:7350/${path}`;

  const response = await fetch(url, {
    method: req.method,
    headers: {
      ...req.headers,
      host: undefined,          // prevent host mismatch
      'content-length': undefined,
    },
    body: req.method === "GET" ? undefined : req.body,
  });

  const text = await response.text();
  res.status(response.status).send(text);
}
