export default async function handler(req, res) {
  try {
    const path = req.query.path.join("/");
    const url = `http://44.222.129.141:7350/${path}${req.url.split(path)[1] ?? ""}`;

    const response = await fetch(url, {
      method: req.method,
      headers: {
        ...req.headers,
        host: undefined,
        "content-length": undefined,
      },
      body: ["GET", "HEAD"].includes(req.method) ? undefined : req.body,
    });

    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy failed");
  }
}
