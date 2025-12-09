import http from "http";

console.log("🧪 Testing ML Pipeline Server...\n");

// Test 1: Health Check
function testHealthCheck() {
  return new Promise((resolve, reject) => {
    console.log("=== Test 1: Health Check ===");

    const options = {
      hostname: "localhost",
      port: 3001,
      path: "/api/health",
      method: "GET",
    };

    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const result = JSON.parse(data);
          console.log("✅ Status:", result.status);
          console.log("✅ Message:", result.message);
          console.log("");
          resolve(true);
        } catch (err) {
          console.log("❌ Failed to parse response");
          resolve(false);
        }
      });
    });

    req.on("error", (err) => {
      console.log("❌ Error:", err.message);
      resolve(false);
    });

    req.end();
  });
}

// Run test
testHealthCheck().then((success) => {
  if (success) {
    console.log("🎉 Server is running and responding correctly!");
    console.log("\n📋 Available Endpoints:");
    console.log("  POST /api/upload       - Upload dataset");
    console.log("  POST /api/preprocess   - Preprocess data");
    console.log("  POST /api/split        - Train-test split");
    console.log("  POST /api/train        - Train model");
    console.log("  GET  /api/health       - Health check");
    console.log("\n✅ Server is ready to use!");
  } else {
    console.log(
      "❌ Server test failed. Make sure the server is running on port 3001"
    );
  }
  process.exit(success ? 0 : 1);
});
