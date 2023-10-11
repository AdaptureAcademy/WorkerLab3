const qr = require("qr-image"); // Importing the qr-image library for generating QR codes

// Defining a constant 'landing' which holds HTML and JavaScript code for a simple QR code generator web interface
// language=HTML
const landing = `
    <h1>QR Generator</h1>
    <p>Click the below button to generate a new QR code. This will make a request to your Worker.</p>
    <input type="text" id="text" value="https://github.com/AdaptureAcademy/WorkerLab3"></input>
    <button onclick="generate()">Generate QR Code</button>
    <br/>
    <p><b>Generated QR Code Image</b></p>
    <img id="qr" src="#"/>
    <script>
        function generate() {
            fetch(window.location.pathname, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({text: document.querySelector("#text").value})
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

// Exporting an object with a method 'fetch' to handle HTTP requests and respond with either a generated QR code or the QR code generator web interface
export default {
  async fetch(request, env, ctx) {
    if (request.method === "POST") {
      return generateQRCode(request);
    } else if (request.method === "GET") {
      return new Response(landing, {
        headers: { "Content-Type": "text/html" },
      });
    }
    return new Response("Expected POST or GET request", { status: 405 });
  },
};

async function generateQRCode(request) {
  const { text } = await request.json();
  const headers = { "Content-Type": "image/png" };
  const qr_png = qr.imageSync(
    text || "https://github.com/AdaptureAcademy/WorkerLab3",
  ); // Generating a QR code from the provided text, or a default URL if no text is provided
  return new Response(qr_png, { headers });
};
