import puppeteer from "puppeteer";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const files = ["fluxo-entrega.html", "mapa-ambiente.html", "arquitetura-k8s-labs.html", "mapa-seguranca-devops.html"];

const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
for (const file of files) {
  const page = await browser.newPage();
  const htmlPath = path.join(__dirname, file);
  await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });
  const height = await page.evaluate(() => document.body.scrollHeight);
  const width = await page.evaluate(() => document.body.scrollWidth);
  await page.setViewport({ width, height });
  const pdfPath = path.join(__dirname, file.replace(".html", "-estilo.pdf"));
  await page.pdf({ path: pdfPath, width: `${width}px`, height: `${height}px`, printBackground: true, margin: { top: 0, bottom: 0, left: 0, right: 0 } });
  console.log("gerado:", pdfPath);
  await page.close();
}
await browser.close();
