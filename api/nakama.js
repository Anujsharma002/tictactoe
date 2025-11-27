export default async function handler(req, res) {
  try {
    const backend = "http://44.222.129.141:7351";

    const path = req.url.replace("/api/nakama", "");
    const url = backend + path;

    const response = await fetch(url, {
      method: req.method,
      headers: {
        ...req.headers,
        host: undefined
      },
      body: req.method === "GET" ? undefined : req.body
    });

    const text = await response.text();
    res.status(response.status).send(text);

  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy failed");
  }
}
