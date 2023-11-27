const express = require("express");
const puppeteer = require("puppeteer");
const fs = require("fs");

const app = express();
const port = 3000;

app.get("/getUrlInfo", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: "URL parameter is required" });
  }

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "domcontentloaded" });

    const screenshotBuffer = await page.screenshot({ fullPage: true });

    await browser.close();

    res.json({ screenshot: screenshotBuffer.toString("base64") });
    fs.writeFileSync("./pic.png", screenshotBuffer);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch URL information" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
