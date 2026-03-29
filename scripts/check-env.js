console.log("Checking LEMONSQUEEZY_API_KEY...");
if (process.env.LEMONSQUEEZY_API_KEY) {
  console.log("LEMONSQUEEZY_API_KEY is present (length: " + process.env.LEMONSQUEEZY_API_KEY.length + ")");
} else {
  console.error("LEMONSQUEEZY_API_KEY is MISSING from process.env");
}
