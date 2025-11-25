export default async function handler(req, res) {
  try {
    // Remove `/api/nakama` so we send correct URL to Nakama
    const targetPath = req.url.replace("/api/nakama", "");
    const url = `http://172.31.65.216:7350${targetPath}`;

    const response = await fetch(url, {
      method: req.method,
      headers: {
        ...req.headers,
        host: undefined,
        "content-length": undefined,
      },
      body: req.method === "GET" ? undefined : req.body,
    });

    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy failed");
  }
}
