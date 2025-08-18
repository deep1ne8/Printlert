const fs = require("fs");
const crypto = require("crypto");
const prompt = require("prompt-sync")({ sigint: true, echo: "*" });

const algorithm = "aes-256-cbc";
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

let secrets = {};
try {
  if (fs.existsSync("secrets.json")) {
    const data = fs.readFileSync("secrets.json", "utf8");
    secrets = JSON.parse(data || "{}"); // fallback to empty object
  }
} catch (err) {
  console.warn("⚠️ Could not parse secrets.json, starting fresh.");
  secrets = {};
}

const password = prompt("Enter SMTP password to encrypt: ");

const cipher = crypto.createCipheriv(algorithm, key, iv);
let encrypted = cipher.update(password, "utf8", "hex");
encrypted += cipher.final("hex");

secrets.SMTP_USER = "noreply@example.com";
secrets.SMTP_PASS_ENC = encrypted;
secrets.IV = iv.toString("hex");

fs.writeFileSync("secrets.json", JSON.stringify(secrets, null, 2));

console.log("✅ Encrypted secret written to secrets.json");
console.log("🔑 IMPORTANT: Save this key in an ENV variable (never commit it):");
console.log("SMTP_KEY=" + key.toString("hex"));
