console.log("Checking STRIPE_SECRET_KEY...");
if (process.env.STRIPE_SECRET_KEY) {
  console.log("STRIPE_SECRET_KEY is present (length: " + process.env.STRIPE_SECRET_KEY.length + ")");
} else {
  console.error("STRIPE_SECRET_KEY is MISSING from process.env");
}
