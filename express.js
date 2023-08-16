import express from "express";
import fs from "fs";
import puppeteer from "puppeteer";

const app = express();

app.get("/", (req, res) => {
  res.send("Home");
});

app.get("/insta", (req, res) => {
  const url = req.query.url;

  (async () => {
    const browser = await puppeteer.launch({
      executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", // Specify the path to Chrome executable
    });

    const page = await browser.newPage();

    try {
      await page.goto(url); // Replace with the URL of the website

      // Wait for client-side rendering to complete (you can adjust the wait time if needed)
      await page.waitForTimeout(5000); // Wait for 5 seconds as an example

      // Get the updated HTML content after client-side rendering
      const updatedHtml = await page.content();

      

      // =============title=============
    const titleRegex = /<title>(.*?)<\/title>/i; // Regular expression to match <title>...</title>
    const matchTitle = updatedHtml.toString().match(titleRegex); // This will return an array with matched content
    // =============title=============

      

      const regex = /<video\s+[^>]*src=["']([^"']+)["'][^>]*>/i;

      const match = updatedHtml.toString().match(regex);

      if (match && matchTitle) {
        const videoSrc = match[1];
        const titleContent = matchTitle[1];

        const data = {
          status: true,
          title: titleContent,
          data: videoSrc.replace(/&amp;/g, "&"),
        };

        res.send(data);
      } else {
        const data = {
          status: false,
        };

        res.send(data);
      }
    } catch (error) {
      const data = {
        status: false,
      };

      res.send(data);
    } finally {
      await browser.close();
    }
  })();
});

app.listen(3000);
