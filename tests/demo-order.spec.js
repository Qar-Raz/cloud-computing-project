const { test, expect } = require('@playwright/test');

// Check if running in CI environment (Azure DevOps)
const isCI = !!process.env.CI;

// Configure the test to run in visual mode with slow motion ONLY on local machine
test.use({
  headless: isCI, // true in CI (invisible), false locally (visible)
  launchOptions: {
    slowMo: isCI ? 0 : 2500, // No delay in CI, 2.5s delay locally
  },
});

test.describe('User Journey Demo', () => {
  
  test('Customer places a food order', async ({ page }) => {
    // Increase timeout to 90 seconds for visual demo mode
    test.setTimeout(90000);

    // 1. Go to the home page
    await page.goto('http://localhost:3000');
    
    // Wait for the page to load
    await expect(page.locator('body')).toBeVisible();

    // 2. Find a food item and click 'Add to Cart'
    // First, navigate to a restaurant page
    console.log('Navigating to restaurant...');
    // Find the first restaurant card that links to a restaurant page
    const restaurantCard = page.locator('a[href^="/restaurant/"]').first();
    await restaurantCard.click();

    // Wait for restaurant page to load
    await expect(page).toHaveURL(/\/restaurant\//);
    await expect(page.getByText('Menu')).toBeVisible({ timeout: 10000 }).catch(() => {});

    // Find an "Add" button for a food item
    console.log('Adding items to cart...');
    
    // 1. Add first item (likely from the top category)
    // We look for a button that contains the Plus icon (lucide-plus)
    const firstAddButton = page.locator('button:has(svg.lucide-plus)').first();
    await expect(firstAddButton).toBeVisible();
    await firstAddButton.click();
    console.log('Added first item');
    await page.waitForTimeout(1000); // Visual delay

    // 2. Scroll to a different category (e.g., "Main Course" or just down)
    // We'll try to find a heading for "Main Course" or just scroll down significantly
    const mainCourseHeading = page.getByRole('heading', { name: 'Main Course' });
    
    if (await mainCourseHeading.isVisible()) {
        console.log('Scrolling to Main Course...');
        await mainCourseHeading.scrollIntoViewIfNeeded();
    } else {
        console.log('Scrolling down...');
        await page.mouse.wheel(0, 800);
    }
    await page.waitForTimeout(1000);

    // 3. Add another item from this section
    // We pick the 3rd add button on the page (which should be further down now)
    const secondAddButton = page.locator('button:has(svg.lucide-plus)').nth(2);
    await secondAddButton.scrollIntoViewIfNeeded();
    await expect(secondAddButton).toBeVisible();
    await secondAddButton.click();
    console.log('Added second item');
    
    // Optional: Wait for toast or cart update
    // await page.waitForTimeout(1000);

    // 3. Navigate to the Cart page
    console.log('Navigating to cart...');
    // Use the bottom navigation link to cart
    await page.locator('a[href="/cart"]').click();

    // Wait for cart page
    await expect(page).toHaveURL(/.*\/cart/);
    // The header on the cart page says "Cart", not "Your Cart"
    await expect(page.getByRole('heading', { name: 'Cart', exact: true })).toBeVisible();

    // 4. Proceed to Checkout
    console.log('Proceeding to checkout...');
    // Click "Proceed to Checkout" button
    await page.getByRole('button', { name: 'Proceed to Checkout' }).click();

    // Wait for checkout page
    await expect(page).toHaveURL(/.*\/checkout/);
    await expect(page.getByText('Review and place your order')).toBeVisible();

    // 5. Interact with Checkout options
    console.log('Interacting with checkout options...');
    
    // Toggle Contactless Delivery
    console.log('Toggling Contactless Delivery...');
    const contactlessSection = page.locator('div').filter({ hasText: 'Contactless delivery' }).last();
    // The button is likely the last child or we can find it by role
    const contactlessBtn = contactlessSection.locator('button');
    if (await contactlessBtn.isVisible()) {
        await contactlessBtn.click();
        await page.waitForTimeout(500);
    }

    // Select Priority Delivery
    console.log('Selecting Priority Delivery...');
    await page.getByText('Priority', { exact: true }).click();
    await page.waitForTimeout(500);

    // Select Payment Method (MoonCoin)
    console.log('Selecting Payment Method...');
    await page.getByText('MoonCoin').click();
    await page.waitForTimeout(500);

    // Change Tip to 100
    console.log('Selecting Tip...');
    await page.getByRole('button', { name: 'Rs. 100.00 (Oxygen tank)' }).click();
    await page.waitForTimeout(500);

    // Toggle Save Tip
    console.log('Toggling Save Tip...');
    const saveTipSection = page.locator('div').filter({ hasText: 'Save it for the next order' }).last();
    const saveTipBtn = saveTipSection.locator('button');
    if (await saveTipBtn.isVisible()) {
        await saveTipBtn.click();
        await page.waitForTimeout(500);
    }

    // 6. Click 'Place Order' and expect Login redirect
    console.log('Placing order (expecting login redirect)...');
    const placeOrderBtn = page.getByRole('button', { name: 'Place order' });
    await placeOrderBtn.click();

    // 7. Verify redirection to Login
    console.log('Waiting for redirect to login...');
    await expect(page).toHaveURL(/.*\/login.*/);
    
    console.log('Redirected to login page successfully.');

    // 8. Wait for 5 seconds at the end so the audience can see the result
    console.log('Demo finished. Waiting for audience...');
    await page.waitForTimeout(5000);
  });
});
