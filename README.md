# LAB 3: Build a QR Code Generator with Cloudflare

## Introduction

In this lab, you will learn to create a QR code generator using Cloudflare Workers. This generator takes a text input
and returns a QR code image as a response.

## Prerequisites

1. **Cloudflare Account**: Ensure you have a Cloudflare account. If
   not, [sign up here](https://dash.cloudflare.com/sign-up).
2. **Node.js**: Ensure Node.js is installed on your machine. If not, [download it here](https://nodejs.org/).

## Step 1: Set Up Your Project

1. **Create a New Project**:
    ```bash
    npm create cloudflare@latest qr-code-generator
    ```
   Follow the prompts to set up your project.

2. **Navigate to Your Project Folder**:
    ```bash
    cd qr-code-generator
    ```

3. **Start Developing**:
    ```bash
    npm run dev
    ```
   This will start a local server where you can test your worker.

## Step 2: Handling Incoming Requests

1. **Open the `worker.js` File**:
   Open the `worker.js` file in your text editor.

2. **Add the Following Code**:
    ```javascript
    export default {
        async fetch(request, env, ctx) {
            if (request.method === 'POST') {
                return generateQRCode(request)
            }
            return new Response('Expected POST request', { status: 405 })
        },
    };

    async function generateQRCode(request) {
        // This function will be updated in the next step
        return new Response("Hello worker!")
    }
    ```

## Step 3: Building the QR Code Generator

1. **Install the `qr-image` Package**:
    ```bash
    npm install --save qr-image
    ```

2. **Update the `generateQRCode` Function**:
    ```javascript
    const qr = require("qr-image");

    async function generateQRCode(request) {
        const { text } = await request.json();
        const headers = { "Content-Type": "image/png" };
        const qr_png = qr.imageSync(text || "https://workers.dev");
        return new Response(qr_png, { headers });
    }
    ```

3. **Update Your `wrangler.toml` File**:
    ```toml
    node_compat = true
    ```

## Step 4: Test Your Worker with an Application UI

1. **Update Your `fetch` Function**:
    ```javascript
    export default {
        async fetch(request, env, ctx) {
            if (request.method === 'POST') {
                return generateQRCode(request);
            }
            return new Response(landing, {
                headers: {
                    "Content-Type": "text/html"
                }
            });
        },
    };
    
    const landing = `
    <h1>QR Generator</h1>
    <p>Click the below button to generate a new QR code. This will make a request to your Worker.</p>
    <input type="text" id="text" value="https://workers.dev"></input>
    <button onclick="generate()">Generate QR Code</button>
    <p>Generated QR Code Image</p>
    <img id="qr" src="#" />
    <script>
        function generate() {
            fetch(window.location.pathname, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: document.querySelector("#text").value })
            })
            .then(response => response.blob())
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = function () {
                    document.querySelector("#qr").src = reader.result;
                }
                reader.readAsDataURL(blob);
            })
        }
    </script>
    `;
    ```

## Step 5: Deploy Your Worker

1. **Deploy**:
    ```bash
    npx wrangler deploy
    ```
   Follow the prompts to deploy your worker.

2. **Test Live Version**:
    - Once deployed, you'll receive a URL for your worker.
    - Visit the URL to use your QR code generator.

## Conclusion

Congratulations! You have built a functional QR code generator using Cloudflare Workers. You can now generate QR codes
with ease by sending a POST request or using the provided UI.