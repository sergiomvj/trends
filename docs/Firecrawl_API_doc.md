Perfeito — segue o **arquivo em Markdown** pronto para enviar aos devs e clientes externos.

Você pode salvar como:

```
firecrawl-integration.md
```

---

# 🔥 Firecrawl Self-Hosted — Integration Guide

## 📡 Base URL

```
http://76.13.168.223:3002
```

*(em produção futura)*

```
https://firecrawl.fbrapps.com
```

---

## 🔑 Authentication

All requests **must include** the API key header.

```
Authorization: Bearer fbr_super_key_2026
```

---

## 📌 Main Endpoint

### Scrape webpage

```
POST /v1/scrape
```

Full URL:

```
http://76.13.168.223:3002/v1/scrape
```

---

## 📦 Request Body

### Minimal

```json
{
  "url": "https://example.com"
}
```

### Recommended

```json
{
  "url": "https://example.com",
  "formats": ["markdown"],
  "timeout": 30000
}
```

---

## 🧪 Example — cURL

```bash
curl -X POST http://76.13.168.223:3002/v1/scrape \
-H "Content-Type: application/json" \
-H "Authorization: Bearer fbr_super_key_2026" \
-d '{
"url":"https://example.com"
}'
```

---

## 🧪 Example — Node.js

```js
const res = await fetch(
  "http://76.13.168.223:3002/v1/scrape",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer fbr_super_key_2026"
    },
    body: JSON.stringify({
      url: "https://example.com"
    })
  }
);

const data = await res.json();
console.log(data);
```

---

## 🧪 Example — Python

```python
import requests

url = "http://76.13.168.223:3002/v1/scrape"

headers = {
    "Authorization": "Bearer fbr_super_key_2026",
    "Content-Type": "application/json"
}

data = {
    "url": "https://example.com"
}

res = requests.post(url, headers=headers, json=data)
print(res.json())
```

---

## 🧪 Example — n8n

**Method:** POST
**URL:**

```
http://76.13.168.223:3002/v1/scrape
```

**Headers:**

```
Authorization: Bearer fbr_super_key_2026
Content-Type: application/json
```

**Body:**

```json
{
  "url": "https://example.com"
}
```

---

## 🔧 Environment Variables

Clients should configure:

```
FIRECRAWL_URL=http://76.13.168.223:3002
FIRECRAWL_API_KEY=fbr_super_key_2026
```

Usage:

```
POST ${FIRECRAWL_URL}/v1/scrape
Authorization: Bearer ${FIRECRAWL_API_KEY}
```

---

## ⚠️ Important Notes

Do **not** use:

```
/health
/docs
/api
```

Only use:

```
/v1/scrape
```

---

## 🧠 Recommended Limits

Clients should:

* Avoid high-frequency scraping loops
* Use queues for batch scraping
* Keep timeout ≤ 30s
* Avoid parallel bursts > 5 requests

---

## 🏗 Infrastructure

```
VPS 1 → Application servers
VPS 2 → Firecrawl service
```

Communication via internal API.

---

## 📞 Support

If requests return errors:

* 401 → missing API key
* 404 → wrong endpoint
* timeout → target site slow

Contact infra team if issues persist.

---

## 🚀 Production Upgrade (future)

Soon this endpoint will move to:

```
https://firecrawl.fbrapps.com
```

No code change required if using:

```
FIRECRAWL_URL env variable
```

