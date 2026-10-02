import { chromium } from "playwright";
import fs from "node:fs";

const OUT = "D:/Teaching/phieu-hoc-tap/artifacts/kiem-tra-production";
fs.mkdirSync(OUT, { recursive: true });
const B = "https://supporter-ten.vercel.app";
const fails = [];
const ok = (c, m) => { console.log(`${c ? "  DAT " : "  HONG"} ${m}`); if (!c) fails.push(m); };

// Tai khoan dung thu, se xoa khoi database ngay sau khi kiem tra xong
const EMAIL = `kiemtra-${Date.now()}@example.com`;
const PASS = "matkhauthu12345";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 950 }, deviceScaleFactor: 2 });
page.on("pageerror", (e) => fails.push(`PAGEERROR: ${e.message}`));
page.on("console", (m) => m.type() === "error" && fails.push(`CONSOLE: ${m.text()}`));

console.log("\n== 1. Trang dang nhap ==");
await page.goto(`${B}/dang-nhap`, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
ok(await page.locator('input[name="email"]').isVisible(), "co o nhap email");
ok(await page.locator('button:has-text("Tiếp tục với Google")').isVisible(), "co nut Google");
await page.screenshot({ path: `${OUT}/1-dang-nhap.png` });

console.log("\n== 2. Dang ky tai khoan moi ==");
await page.click('a:has-text("Đăng ký")');
await page.waitForURL(/dang-ky/, { timeout: 25000 });
await page.waitForTimeout(900);
await page.fill('input[name="name"]', "Giao vien kiem tra");
await page.fill('input[name="email"]', EMAIL);
await page.fill('input[name="password"]', PASS);
await page.click('button:has-text("Tạo tài khoản")');

const landed = await page.waitForURL(B + "/", { timeout: 30000 }).then(() => true).catch(() => false);
ok(landed, `dang ky xong vao duoc trang chinh (dang o ${page.url()})`);
if (!landed) {
  const err = await page.locator('[role="alert"]').textContent().catch(() => null);
  console.log("      loi hien tren man hinh:", err);
}

console.log("\n== 3. Phien dang nhap giu duoc qua lan tai lai ==");
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(1000);
ok(!page.url().includes("dang-nhap"), `tai lai van o trong app (${page.url()})`);
await page.screenshot({ path: `${OUT}/2-sau-dang-ky.png`, fullPage: true });

console.log("\n== 4. Tao hoc vien va luu nhan xet ==");
await page.click('button:has-text("Thêm học viên")');
await page.waitForTimeout(700);
await page.fill('dialog input[name="name"]', "Hoc vien kiem tra");
await page.fill('dialog input[name="class_code"]', "TEST001");
await page.click('dialog button:has-text("Thêm")');
const toStudent = await page.waitForURL(/hoc-vien/, { timeout: 30000 }).then(() => true).catch(() => false);
ok(toStudent, "tao duoc hoc vien tren database that");

if (toStudent) {
  await page.waitForTimeout(1200);
  await page.fill('input[name="lesson_name"]', "Unit 1 - Lesson 1");
  await page.click('button:has-text("Đọc")');
  await page.waitForTimeout(400);
  await page.locator('button:has-text("Đọc hiểu được")').first().click();
  await page.click('button:has-text("Thêm buổi")');
  await page.waitForTimeout(3500);
  const saved = await page.locator('text=Unit 1 - Lesson 1').count();
  ok(saved > 0, "luu duoc nhan xet");
  await page.screenshot({ path: `${OUT}/3-hoc-vien.png`, fullPage: true });
}

console.log("\n== 5. Lich day ==");
const r = await page.goto(`${B}/lich`, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
ok(r?.status() === 200, `trang lich tra ve ${r?.status()}`);
ok((await page.locator("[data-day]").count()) === 7, "luoi lich hien du 7 ngay");
await page.screenshot({ path: `${OUT}/4-lich.png` });

console.log("\n== 6. Tai khoan thuong KHONG duoc vao trang quan tri ==");
await page.goto(`${B}/quan-tri`, { waitUntil: "networkidle" });
await page.waitForTimeout(900);
ok(!page.url().includes("quan-tri"), `bi day khoi trang quan tri (dang o ${page.url().replace(B, "") || "/"})`);

console.log("\n== KET QUA ==");
console.log(fails.length ? "HONG:\n" + fails.map((f) => "  - " + f).join("\n") : "Tat ca deu dat.");
console.log("\nTai khoan thu da tao:", EMAIL);
await browser.close();
process.exit(fails.length ? 1 : 0);
