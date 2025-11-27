import { createProxyServer } from "http-proxy";

const proxy = createProxyServer({
  target: "http://44.222.129.141:7351",
  changeOrigin: true,
  ws: true
});

export default function handler(req, res) {
  proxy.web(req, res, {}, (err) => {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy failed");
  });
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
};
