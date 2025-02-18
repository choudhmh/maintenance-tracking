import { test, expect } from "@playwright/test";

// Enum definitions for testing
export enum MaintenanceType {
  Preventive = "Preventive",
  Repair = "Repair",
  Emergency = "Emergency",
}

export enum PriorityLevel {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

export enum CompletionStatus {
  Complete = "Complete",
  Incomplete = "Incomplete",
  Pending = "Pending",
}

test.beforeEach(async ({ page }) => {
  console.log("Navigating to maintenance form...");
  await page.goto("http://localhost:3000/dashboard/equipments_form/maintenance_form");

  // Set equipment data in localStorage and reload the page
  console.log("Setting localStorage equipment data...");
  await page.evaluate(() => {
    localStorage.setItem(
      "equipmentData",
      JSON.stringify([{ id: 1, name: "Generator A" }])
    );
  });

  console.log("Reloading page to reflect equipment data...");
  await page.reload();
});

// test("Should create a new maintenance record", async ({ page }) => {
//   console.log("Checking if form is visible...");
//   await expect(page.locator("text=Maintenance Record Form")).toBeVisible();

//   // Fill out the form
//   console.log("Selecting equipment...");
//   await page.selectOption("select[name='equipmentId']", "1");

//   console.log("Filling date...");
//   const validDate = "2025-02-18";
//   await page.fill("input[name='date']", validDate);

//   console.log("Selecting maintenance type...");
//   await page.selectOption("select[name='type']", MaintenanceType.Preventive);

//   console.log("Filling technician name...");
//   await page.fill("input[name='technician']", "John Doe");

//   console.log("Filling hours spent...");
//   await page.fill("input[name='hoursSpent']", "5");

//   console.log("Filling description...");
//   await page.fill("textarea[name='description']", "Routine checkup with scheduled maintenance.");

//   // Add a replaced part (optional)
//   console.log("Adding replaced part...");
//   await page.click("button:has-text('+ Add Part')");
//   await page.fill("input[name='partsReplaced.0']", "Oil Filter");

//   // Select priority & completion status
//   console.log("Selecting priority...");
//   await page.selectOption("select[name='priority']", PriorityLevel.High);

//   console.log("Selecting completion status...");
//   await page.selectOption("select[name='completionStatus']", CompletionStatus.Complete);

//   // Click submit button
//   console.log("Clicking submit button...");
//   await page.click("button[type='submit']");

//   // Wait for success message to appear
//   const successMessageLocator = page.locator("text=Maintenance record added successfully!");
//   try {
//     await successMessageLocator.waitFor({ state: "visible", timeout: 30000 }); // Increased timeout
//     console.log("Success message found.");
//   } catch (error) {
//     console.error("Error waiting for success message:", error);
//   }
// })

// test("Should reject negative or over 24 hours for maintenance hours", async ({ page }) => {
//   console.log("Checking if form is visible...");
//   await expect(page.locator("text=Maintenance Record Form")).toBeVisible();

//   // Fill out the form with negative hoursSpent
//   console.log("Selecting equipment...");
//   await page.selectOption("select[name='equipmentId']", "1");

//   console.log("Filling date...");
//   const validDate = "2025-02-18";
//   await page.fill("input[name='date']", validDate);

//   console.log("Selecting maintenance type...");
//   await page.selectOption("select[name='type']", MaintenanceType.Preventive);

//   console.log("Filling technician name...");
//   await page.fill("input[name='technician']", "John Doe");

//   console.log("Filling negative hours spent...");
//   await page.fill("input[name='hoursSpent']", "-5");

//   console.log("Filling description...");
//   await page.fill("textarea[name='description']", "Routine checkup with scheduled maintenance.");

//   // Add a replaced part (optional)
//   console.log("Adding replaced part...");
//   await page.click("button:has-text('+ Add Part')");
//   await page.fill("input[name='partsReplaced.0']", "Oil Filter");

//   // Select priority & completion status
//   console.log("Selecting priority...");
//   await page.selectOption("select[name='priority']", PriorityLevel.High);

//   console.log("Selecting completion status...");
//   await page.selectOption("select[name='completionStatus']", CompletionStatus.Complete);

//   // Click submit button
//   console.log("Clicking submit button...");
//   await page.click("button[type='submit']");

//   // Wait for the error message for negative hours
//   console.log("Waiting for error message for negative hours...");
//   const negativeHoursError = page.locator("text=Hours must be at least 1");
//   try {
//     await negativeHoursError.waitFor({ state: "visible", timeout: 20000 });  // Increased timeout
//     await expect(negativeHoursError).toBeVisible();
//     console.log("Error message for negative hours found.");
//   } catch (error) {
//     console.error("Error waiting for negative hours message:", error);
//   }

//   // Now fill in hoursSpent with a value over 24

//   // await page.fill("input[name='hoursSpent']", "25");
//   // await page.click("button[type='submit']");

//   // // Wait for the error message for hours over 24
//   // console.log("Waiting for error message for hours over 24...");
//   // const over24HoursError = page.locator("text=Hours cannot exceed 24");
//   // try {
//   //   await over24HoursError.waitFor({ state: "visible", timeout: 20000 });  // Increased timeout
//   //   await expect(over24HoursError).toBeVisible();
//   //   console.log("Error message for hours over 24 found.");
//   // } catch (error) {
//   //   console.error("Error waiting for over 24 hours message:", error);
//   // }

//   // Now fill in valid hours
//   console.log("Filling valid hours spent...");
//   await page.fill("input[name='hoursSpent']", "8");

//   // Submit with valid data
//   await page.click("button[type='submit']");

//   // Wait for success message to appear
//   const successMessageLocator = page.locator("text=Maintenance record added successfully!");
//   try {
//     await successMessageLocator.waitFor({ state: "visible", timeout: 30000 }); // Increased timeout
//     console.log("Success message found.");
//   } catch (error) {
//     console.error("Error waiting for success message:", error);
//   }
// });


// test("Should show equipment name in maintenance table", async ({ page }) => {
//   console.log("Navigating to maintenance form...");
//   await page.goto("http://localhost:3000/dashboard/equipments_form/maintenance_form");

//   // Set equipment data in localStorage
//   console.log("Setting localStorage equipment data...");
//   await page.evaluate(() => {
//     localStorage.setItem(
//       "equipmentData",
//       JSON.stringify([{ id: 1, name: "Generator A" }])
//     );
//   });

//   console.log("Reloading page to reflect equipment data...");
//   await page.reload();

//   // Fill out the maintenance form
//   console.log("Selecting equipment...");
//   await page.selectOption("select[name='equipmentId']", "1");

//   console.log("Filling date...");
//   await page.fill("input[name='date']", "2025-02-18");

//   console.log("Selecting maintenance type...");
//   await page.selectOption("select[name='type']", "Preventive");

//   console.log("Filling technician name...");
//   await page.fill("input[name='technician']", "John Doe");

//   console.log("Filling hours spent...");
//   await page.fill("input[name='hoursSpent']", "5");

//   console.log("Filling description...");
//   await page.fill("textarea[name='description']", "Routine maintenance.");

//   console.log("Selecting priority...");
//   await page.selectOption("select[name='priority']", "Medium");

//   console.log("Selecting completion status...");
//   await page.selectOption("select[name='completionStatus']", "Complete");

//   // Submit the form
//   console.log("Clicking submit button...");
//   await page.click("button[type='submit']");

//   // Wait for success message
//   const successMessage = page.locator("text=Maintenance record added successfully!");
//   await successMessage.waitFor({ state: "visible", timeout: 20000 });
//   console.log("Success message confirmed.");

//   // Navigate to the maintenance records table
//   console.log("Navigating to maintenance table...");
//   await page.goto("http://localhost:3000/dashboard/equipments_form/maintenance_form/maintenance_table");

//   // Verify the equipment name is visible in the table
//   console.log("Checking if equipment name is in table...");
//   const equipmentNameCell = page.locator("table >> text=Generator A");
//   await expect(equipmentNameCell).toBeVisible({ timeout: 20000 });
//   console.log("Equipment name found in table.");
// });


test('Should filter maintenance records by date range', async ({ page }) => {
  console.log("Navigating to maintenance form...");
  await page.goto("http://localhost:3000/dashboard/equipments_form/maintenance_form");

  // Ensure equipment is available in localStorage
  console.log("Setting localStorage equipment data...");
  await page.evaluate(() => {
    localStorage.setItem(
      "equipmentData",
      JSON.stringify([{ id: "1", name: "Generator A" }, { id: "2", name: "Generator B" }])
    );
  });

  console.log("Reloading page to reflect equipment data...");
  await page.reload();

  // Maintenance records data
  const maintenanceRecords = [
    {
      equipmentName: "Generator A",
      date: "2024-02-10",
      technician: "John Doe",
      hoursSpent: "4",
      type: "Preventive",
      priority: "Medium",
      completionStatus: "Complete",
    },
    {
      equipmentName: "Generator B",
      date: "2024-02-15",
      technician: "Jane Smith",
      hoursSpent: "6",
      type: "Repair",
      priority: "High",
      completionStatus: "Incomplete",
    },
  ];

  for (const record of maintenanceRecords) {
    console.log(`Filling maintenance record for ${record.equipmentName}...`);

    // Select Equipment
    await page.selectOption("select[name='equipmentId']", { label: record.equipmentName });

    // Fill form fields
    await page.fill("input[name='date']", record.date);
    await page.fill("input[name='technician']", record.technician);
    await page.fill("input[name='hoursSpent']", record.hoursSpent);
    await page.selectOption("select[name='type']", record.type);
    await page.selectOption("select[name='priority']", record.priority);
    await page.selectOption("select[name='completionStatus']", record.completionStatus);

    // Debug: Check if the submit button exists
    const submitButton = page.locator("button[type='submit']");
    if (!(await submitButton.isVisible())) {
      console.error("🚨 Submit button is missing! Form might not be complete.");
      return;
    }

    // Submit the form
    console.log(`Submitting form for ${record.equipmentName}...`);
    await submitButton.click();

    // **Wait for form to be submitted (aria-busy state change or success message)**
    try {
      console.log(`Waiting for form submission to complete for ${record.equipmentName}...`);
      
      // Wait for aria-busy attribute to change (form should not be "busy")
      await page.waitForSelector("form[aria-busy='false']", { timeout: 15000 });

      // Alternatively, you can wait for the success message directly
      console.log(`Checking if the success message appears for ${record.equipmentName}...`);
      const successMessage = page.locator("text=Maintenance record added successfully!");
      await successMessage.waitFor({ state: 'visible', timeout: 15000 });
      console.log(`${record.equipmentName} record added successfully.`);
    } catch (error) {
      console.error(`🚨 Error: Could not submit form for ${record.equipmentName}`, error);

      // **Take a screenshot for debugging**
      await page.screenshot({ path: `error-${record.equipmentName}.png`, fullPage: true });

      // **Log potential form errors**
      const errorMessages = await page.locator(".error-message").allInnerTexts();
      console.log("Captured error messages:", errorMessages);

      // **Check page text to find success message**
      const pageText = await page.evaluate(() => document.body.innerText);
      console.log("Captured Page Text:", pageText);

      throw error; // Fail the test if success message doesn't appear
    }
  }

  // Navigate to maintenance records table
  console.log("Navigating to maintenance records table...");
  await page.goto("http://localhost:3000/dashboard/equipments_form/maintenance_form/maintenance_table");

  // Set start date
  console.log("Setting start date...");
  await page.fill("input[name='startDate']", "2024-02-12");

  // Set end date
  console.log("Setting end date...");
  await page.fill("input[name='endDate']", "2024-02-16");

  // Click filter button
  console.log("Clicking filter button...");
  await page.click("button:has-text('Filter')");

  // Wait for the table to update
  console.log("Waiting for maintenance records to update...");
  const updatedTable = page.locator("table");
  await updatedTable.waitFor({ state: 'attached' });

  // Ensure only Generator B's record is visible
  console.log("Checking if only Generator B is displayed...");
  const record1 = page.locator("table >> text=Generator A");
  const record2 = page.locator("table >> text=Generator B");

  // Assert that Generator A is NOT visible and Generator B is visible
  await expect(record1).not.toBeVisible();
  await expect(record2).toBeVisible();
  console.log("Filter by date range works correctly.");
});





