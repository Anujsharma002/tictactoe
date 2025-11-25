export default async function handler(req, res) {
  try {
    // Strip `/api/nakama` so the path matches Nakama correctly
    const targetPath = req.url.replace("/api/nakama", "");
    const url = `http://44.222.129.141:7350${targetPath}`;

    const response = await fetch(url, {
      method: req.method,
      headers: {
        ...req.headers,
        host: undefined,               // prevent host header conflict
        "content-length": undefined,   // avoids hanging requests
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
