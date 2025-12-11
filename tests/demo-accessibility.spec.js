const { test, expect } = require('@playwright/test');

// Configure the test to run in visual mode with slow motion
test.use({
  headless: false,
  launchOptions: {
    slowMo: 2000, // 2 seconds delay per action
  },
});

test.describe('Accessibility Features Demo', () => {
  
  test('User explores accessibility settings', async ({ page }) => {
    // Increase timeout for visual demo
    test.setTimeout(90000);

    // 1. Go to the home page
    await page.goto('http://localhost:3000');
    await expect(page.locator('body')).toBeVisible();

    // 2. Navigate to Accessibility Tab
    console.log('Navigating to Accessibility settings...');
    await page.locator('a[href="/accessibility"]').click();
    
    // Wait for accessibility page
    await expect(page).toHaveURL(/.*\/accessibility/);
    // The heading might be "Accessibility Settings" or just "Accessibility"
    // Let's use a more flexible selector or check for the text content
    await expect(page.locator('h1')).toContainText('Accessibility');
    await page.waitForTimeout(1000);

    // 3. Toggle High Contrast
    console.log('Toggling High Contrast...');
    // Find the High Contrast toggle/button.
    // We'll look for the button that has the text "High Contrast" inside it or near it.
    // The most reliable way is to find the text, then find the closest button.
    // Or, if the button itself contains the text (which is common in some UI libraries).
    
    // Strategy: Find the text "High Contrast", go up to a common container (like a card), then find the button (switch).
    const highContrastText = page.getByText('High Contrast').first();
    // Go up to the card container (likely a div with some padding/border)
    // We can try to find the button directly if it has an aria-label or role
    
    // Let's try to find the button by its proximity to the text
    // We assume the button is a 'switch' role or just a button
    const highContrastButton = page.locator('button').filter({ hasText: 'High Contrast' }).first();
    
    if (await highContrastButton.isVisible()) {
        await highContrastButton.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        await highContrastButton.click();
    } else {
        // Fallback: Find the container with the text, then find the button inside it
        // This is useful if the button is separate from the label
        const container = page.locator('div, section').filter({ has: highContrastText }).last();
        const btn = container.locator('button').first();
        if (await btn.isVisible()) {
             await btn.scrollIntoViewIfNeeded();
             await page.waitForTimeout(500);
             await btn.click();
        }
    }
    await page.waitForTimeout(1000);

    // 4. Change Text Size
    console.log('Changing Text Size...');
    // Scroll to Font Size section
    const fontSizeHeading = page.getByRole('heading', { name: 'Font Size' }).first();
    
    if (await fontSizeHeading.isVisible()) {
        await fontSizeHeading.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
    } else {
        // Fallback
        await page.getByText('Font Size').first().scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
    }
    
    // Click "Large"
    await page.getByRole('button', { name: 'Large', exact: true }).click();
    await page.waitForTimeout(1000);
    
    // Click "Extra Large"
    await page.getByRole('button', { name: 'Extra Large' }).click();
    await page.waitForTimeout(1000);

    // 5. Toggle Audio Assistance
    console.log('Toggling Audio Assistance...');
    const audioText = page.getByText('Audio Assistance').first();
    // Try to find button with text first
    const audioButton = page.locator('button').filter({ hasText: 'Audio Assistance' }).first();
    
    if (await audioButton.isVisible()) {
        await audioButton.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        await audioButton.click();
    } else {
        // Fallback: Container method
        const container = page.locator('div, section').filter({ has: audioText }).last();
        const btn = container.locator('button').first();
        if (await btn.isVisible()) {
             await btn.scrollIntoViewIfNeeded();
             await page.waitForTimeout(500);
             await btn.click();
        }
    }
    await page.waitForTimeout(1000);

    // 6. Toggle Reduced Motion
    console.log('Toggling Reduced Motion...');
    const motionText = page.getByText('Reduced Motion').first();
    const motionButton = page.locator('button').filter({ hasText: 'Reduced Motion' }).first();
    
    if (await motionButton.isVisible()) {
        await motionButton.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        await motionButton.click();
    } else {
        // Fallback: Container method
        const container = page.locator('div, section').filter({ has: motionText }).last();
        const btn = container.locator('button').first();
        if (await btn.isVisible()) {
             await btn.scrollIntoViewIfNeeded();
             await page.waitForTimeout(500);
             await btn.click();
        }
    }
    await page.waitForTimeout(1000);

    // 7. Toggle Color Blind Mode (if available as a toggle or selection)
    console.log('Checking Color Blind Mode...');
    const colorBlindText = page.getByText('Color Blind Mode').first();
    const colorBlindContainer = page.locator('div').filter({ has: colorBlindText }).last();
    // This might be a button or a clickable div
    if (await colorBlindContainer.isVisible()) {
        await colorBlindContainer.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        await colorBlindContainer.click();
        await page.waitForTimeout(1000);
    }

    // 8. Reset Settings (Optional, to show the reset functionality)
    // Commented out to keep settings ON as requested
    /*
    console.log('Resetting settings...');
    const resetButton = page.getByRole('button', { name: 'Reset all settings' });
    if (await resetButton.isVisible()) {
        await resetButton.scrollIntoViewIfNeeded();
        await resetButton.click();
        await page.waitForTimeout(1000);
    }
    */

    console.log('Accessibility demo finished.');
    await page.waitForTimeout(3000);
  });
});
