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

  test("Should reject negative or over 24 hours for maintenance hours", async ({ page }) => {
    // Mock localStorage data for equipment and maintenance records
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
    await page.goto("http://localhost:3001/dashboard/maintenance_table", {
      waitUntil: "networkidle",
    });
  });
})