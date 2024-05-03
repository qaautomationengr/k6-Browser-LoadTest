import { browser } from 'k6/experimental/browser'
import { check } from 'k6'
import http from 'k6/http'

export const options = {
  scenarios: {
    browser: {
      executor: 'per-vu-iterations',
      exec: 'browserTest',
      options: {
        browser: {
          type: 'chromium'
        }
      }
    },
    protocol: {
      executor: 'constant-vus',
      exec: 'protocolTest',
      vus: 20,
      duration: '30s'
    }
  }
}

export async function browserTest() {
  const page = browser.newPage()

  await page.goto('https://otel-demo.field-eng.grafana.net/')

  const productCard = page.locator('(//div[@data-cy="product-card"])[1]')
  check(page, {
      'cart item name': (page) =>
          page.locator('(//div[@data-cy="product-card"])[1]').isVisible() === true,
  });
  await productCard.click()

  const quantityOption = page.locator('[data-cy="product-quantity"]')
  quantityOption.selectOption('3')

  const addToCardBtn = page.locator('[data-cy="product-add-to-cart"]')
  await addToCardBtn.click()

  page.close()
}

export function protocolTest() {
  const res = http.get('https://otel-demo.field-eng.grafana.net/')

  check(res, {
    'status is 200': res => res.status === 200
  })
}
