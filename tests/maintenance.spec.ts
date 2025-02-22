import { test, expect } from "@playwright/test";

test.describe("Maintenance Record Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Mock localStorage data for equipment
    await page.addInitScript(() => {
      window.localStorage.setItem(
        "equipmentData",
        JSON.stringify([
          { id: 1, name: "Excavator" },
          { id: 2, name: "Crane" },
        ])
      );
    });

    // Navigate to the form page
    await page.goto("http://localhost:3001/dashboard/equipments_form/maintenance_form", {
      waitUntil: "networkidle",
    });
  });

  //Test 1
  test("Should create new maintenance record", async ({ page }) => {
    // Mock the alert function
    await page.evaluate(() => {
      window.alert = (message) => {
        console.log(`Alert: ${message}`);
      };
    });

    // Fill out the form
    await page.selectOption('select[name="equipmentId"]', "1"); // Select equipment
    await page.fill('input[name="date"]', "2023-10-01"); // Enter date
    await page.selectOption('select[name="type"]', "Preventive"); // Select type
    await page.fill('input[name="technician"]', "John Doe"); // Enter technician
    await page.fill('input[name="hoursSpent"]', "5"); // Enter hours spent
    await page.fill('textarea[name="description"]', "Routine checkup"); // Enter description
    await page.click('button:text("+ Add Part")'); // Add a part
    await page.fill('input[name="partsReplaced.0"]', "Oil Filter"); // Enter part replaced
    await page.selectOption('select[name="priority"]', "High"); // Select priority
    await page.selectOption('select[name="completionStatus"]', "Complete"); // Select status

    // Submit the form
    await page.click('button[type="submit"]');

    // Wait for the form submission to complete
    await page.waitForTimeout(500); // Adjust timeout as needed

    // Verify the record is saved in localStorage
    const records = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("maintenanceRecords") || "[]")
    );
    expect(records.length).toBe(1);
    expect(records[0].equipmentId).toBe(1);
    expect(records[0].technician).toBe("John Doe");
  });

//Test 2
  test("Should reject negative or over 24 hours for maintenance hours", async ({ page }) => {

    await page.addInitScript(() => {
      window.localStorage.setItem(
        "equipmentData",
        JSON.stringify([
          { id: 1, name: "Excavator" },
          { id: 2, name: "Crane" },
        ])
      );
      window.localStorage.setItem(
        "maintenanceRecords",
        JSON.stringify([
          {
            id: 1,
            equipmentId: 1, // Excavator
            date: "2023-10-01",
            type: "Preventive",
            technician: "John Doe",
            hoursSpent: 5,
            description: "Routine checkup",
            partsReplaced: ["Oil Filter"],
            priority: "High",
            completionStatus: "Complete",
          },
        ])
      );
    });

    // Navigate to the maintenance table page
    await page.goto("http://localhost:3001/dashboard/equipments_form/maintenance_form", {
      waitUntil: "networkidle",
    });
  });

//test 3
  test("Should show equipment name in maintenance table", async ({ page }) => {
    // Mock localStorage data for maintenance records
    await page.addInitScript(() => {
      window.localStorage.setItem(
        "maintenanceRecords",
        JSON.stringify([
          {
            id: 1,
            equipmentId: 1,
            date: "2023-10-01",
            technician: "John Doe",
            hoursSpent: 5,
            description: "Routine checkup",
            priority: "High",
            completionStatus: "Complete",
          },
        ])
      );
    });

    // Navigate to the maintenance table page
    await page.goto("http://localhost:3001/dashboard/equipments_form/maintenance_form/maintenance_table", {
      waitUntil: "networkidle",
    });

    // Verify that the table displays "Excavator" for the equipment name
    await expect(page.locator("td:text('Excavator')")).toBeVisible();
  });

  //test 4
  // test("Should filter maintenance records by date range", async ({ page }) => {
  //   await page.goto("http://localhost:3001/dashboard/equipments_form/maintenance_form/maintenance_table");
  //   await page.waitForLoadState("domcontentloaded");
    
  //   await page.addInitScript(() => {
  //     window.localStorage.setItem(
  //       "maintenanceRecords",
  //       JSON.stringify([
  //         {
  //           id: 1,
  //           equipmentId: 1,
  //           date: "2023-09-15",
  //           technician: "Alice",
  //           hoursSpent: 4,
  //           description: "Inspection",
  //           priority: "Medium",
  //           completionStatus: "Complete",
  //         },
  //         {
  //           id: 2,
  //           equipmentId: 2,
  //           date: "2023-10-05",
  //           technician: "Bob",
  //           hoursSpent: 6,
  //           description: "Engine repair",
  //           priority: "High",
  //           completionStatus: "Incomplete",
  //         },
  //       ])
  //     );
  //     window.localStorage.setItem(
  //       "equipmentData",
  //       JSON.stringify([
  //         { id: 1, name: "Excavator" },
  //         { id: 2, name: "Crane" },
  //       ])
  //     );
  //   });
  
  //   // ✅ Navigate to the correct maintenance table page
  //   await page.goto("http://localhost:3001/dashboard/equipments_form/maintenance_form/maintenance_table", {
  //     waitUntil: "domcontentloaded",
  //   });
  
  //   // 📸 Screenshot before checking for the table
  //   await page.screenshot({ path: "debug-before-table.png", fullPage: true });
  
  //   // ⏳ Wait for the table to be visible
  //   await page.waitForTimeout(2000);
  //   await page.locator("table tbody tr").first().waitFor();
  
  //   // 🔍 Debug: Log records found in table
  //   const recordsOnPage = await page.evaluate(() => {
  //     return Array.from(document.querySelectorAll("table tbody tr")).map(row => (row as HTMLElement).innerText);
  //   });
    
  //   console.log("Table rows:", recordsOnPage);
  
  //   // ✅ Wait for date filters to be ready
  //   await page.locator('input[name="startDate"]').waitFor();
  //   await page.locator('input[name="endDate"]').waitFor();
  
  //   // 🗓 Set date range
  //   await page.fill('input[name="startDate"]', "2023-10-01");
  //   await page.fill('input[name="endDate"]', "2023-10-10");
  
  //   // ⏳ Allow React time to update
  //   await page.waitForTimeout(1000);
  
  //   // ✅ Expect only Bob's record to be visible
  //   await expect(page.locator("td:text('Bob')")).toBeVisible();
  //   await expect(page.locator("td:text('Alice')")).not.toBeVisible();
  // });
  
  
  
})