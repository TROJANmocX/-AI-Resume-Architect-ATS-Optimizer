const http = require('http');

const rawResumeText = `
Arish Khan
arish@example.com | (555) 019-2834 | San Francisco, CA | linkedin.com/in/arishkhan

Professional Summary:
Dynamic Software Architect with 8+ years of experience leading engineering teams to design and scale enterprise-grade cloud solutions. Proven expertise in Node.js, TypeScript, and high-performance Web APIs.

Education:
UC Berkeley - Master of Science in Computer Science, Graduated 2018 (GPA: 3.9)

Experience:
Lead Cloud Architect at CloudScale Inc. (2021 - Present)
- Spearheaded migration of legacy services to AWS, reducing latency by 42%.
- Managed and mentored a team of 8 senior developers.
- Designed high-throughput GraphQL APIs processing 5M+ daily requests.

Senior Software Engineer at DevCorp (2018 - 2021)
- Developed and launched a collaborative real-time editor using Socket.io.
- Optimized database indexing to boost query response times by 30%.

Projects:
CareerForge AI Resume Builder (2025)
Built a premium, high-fidelity resume creation and ATS optimization platform.

Skills:
TypeScript, Node.js, React, Go, AWS, Docker, Kubernetes, MongoDB, SQL, System Architecture

Languages:
English (Native), German (Conversational)
`;

const postData = JSON.stringify({
  text: rawResumeText
});

function makeRequest(options, dataToSend = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body ? JSON.parse(body) : null
        });
      });
    });

    req.on('error', (e) => reject(e));

    if (dataToSend) {
      req.write(dataToSend);
    }
    req.end();
  });
}

async function runTests() {
  console.log("=== Testing POST /api/import with Gemini AI parser ===");
  try {
    const start = Date.now();
    const res = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/import',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, postData);
    
    console.log("Time Taken:", ((Date.now() - start) / 1000).toFixed(2), "seconds");
    console.log("Status Code:", res.statusCode);
    console.log("Parsed Basic Info:", JSON.stringify(res.body?.basic, null, 2));
    console.log("Parsed Experience Count:", res.body?.experience?.length || 0);
    if (res.body?.experience) {
      console.log("First Experience Company:", res.body.experience[0]?.company);
      console.log("First Experience Bullets:", res.body.experience[0]?.bullets);
    }
    console.log("Parsed Academics:", JSON.stringify(res.body?.academics, null, 2));
    console.log("Parsed Skills Count:", res.body?.skills?.length || 0);
    console.log("Parsed Languages:", JSON.stringify(res.body?.languages, null, 2));

  } catch (error) {
    console.error("Test failed:", error);
  }
}

runTests();
