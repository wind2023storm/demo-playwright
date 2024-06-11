import {
  test,
  chromium,
  ChromiumBrowser,
  Page,
  expect,
} from "@playwright/test";
import fs from "fs/promises";

const proxyServers = [];
let browser: ChromiumBrowser;

test("Check Proxy", async () => {
  if (proxyServers.length > 0) {
    const proxyServer =
      proxyServers[Math.floor(Math.random() * proxyServers.length)];

    const [usernamePassword, ipAddressPort] = proxyServer.split("@");
    const [username, password] = usernamePassword.split(":");
    const [ipAddress, port] = ipAddressPort.split(":");

    browser = await chromium.launch({
      proxy: {
        server: `http://${ipAddress}:${port}`,
        username: username,
        password: password,
      },
    });
  } else {
    browser = await chromium.launch();
  }

  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://admin-demo.moosocial.com/admin/home/login");

  await page.fill('input[name="data[User][email]"]', "demo@moosocial.com");
  await page.fill('input[name="data[User][password]"]', "admin");

  let navigationPromise = page.waitForNavigation();
  await page.click('input[type="submit"]');
  await navigationPromise;

  await page.click(
    "body > div.page-container > div.page-sidebar-wrapper > div > ul > li.open > a"
  );
  await page.click(
    "body > div.page-container > div.page-sidebar-wrapper > div > ul > li:nth-child(4) > a"
  );

  navigationPromise = page.waitForNavigation();
  await page.click(
    "body > div.page-container > div.page-sidebar-wrapper > div > ul > li.open > ul > li:nth-child(2) > a"
  );
  await navigationPromise;

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    await page.waitForTimeout(2000),
    page.click(
      "#sample_1 > tbody > tr:nth-child(2) > td:nth-child(5) > a:nth-child(3)"
    ),
  ]);

  await download.saveAs(download.suggestedFilename());

  // Log out
  navigationPromise = page.waitForNavigation();
  await page.hover(
    "body > div.page-header.navbar.navbar-fixed-top > div > div.top-menu > ul > li.dropdown.dropdown-user > a"
  );
  await page.waitForTimeout(2000),
    await page.click(
      "body > div.page-header.navbar.navbar-fixed-top > div > div.top-menu > ul > li.dropdown.dropdown-user > ul > li:nth-child(8) > a"
    );
  await navigationPromise;

  await browser.close();
});
