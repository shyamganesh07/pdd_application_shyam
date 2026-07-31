export default ({ config }) => ({
  ...config,
  name: "TradeMind",
  slug: "trademind",
  version: "2.0.0",
  extra: {
    apiUrl: process.env.VITE_API_URL || "http://localhost:8000",
    firebaseApiKey: process.env.VITE_FIREBASE_API_KEY || ""
  }
});
