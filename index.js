const puppeteer = require("puppeteer")
const fs = require("fs/promises")

async function start() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto("https://learnwebcode.github.io/practice-requests/")

  //Grab title
  const names = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".info strong")).map(x => x.textContent)
  })
  await fs.writeFile("names.txt", names.join("\r\n"))


  //Button clicked data
  await page.click("#clickme")
  const clickedData = await page.$eval("#data", el => el.textContent)
  console.log(clickedData)

  //Grab page data after submit form
  await page.type("#ourfield", "blue")
  await Promise.all([page.click("#ourform button"), page.waitForNavigation()])
  const info = await page.$eval("#message", el => el.textContent)

  //Grab photos
  const photos = await page.$$eval("img", imgs => {
    return imgs.map(x => x.src)
  })

  for (const photo of photos) {
    const imagepage = await page.goto(photo)
    await fs.writeFile(photo.split("/").pop(), await imagepage.buffer())
  }



//   console.log(info)



  await browser.close()
}

start()