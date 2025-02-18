import { test, expect } from "@playwright/test";
import { Status } from "@/app/dashboard/equipments_form/enum";

// Sample valid equipment data
const validEquipment = {
  name: "Drill Press",
  location: "Factory Floor",
  department: "Machining",
  model: "DP-5000",
  serialNumber: "SN123456",
  installDate: "2023-05-10",
  status: Status.Operational,
};

// Test 1: Should create new equipment with valid data
test("Should create new equipment with valid data", async ({ page }) => {
  await page.goto("http://localhost:3000/dashboard/equipments_form");
  await page.waitForSelector("form");

  // Fill out the form with valid data
  await page.fill("input[name='name']", validEquipment.name);
  await page.fill("input[name='location']", validEquipment.location);
  await page.selectOption("select[name='department']", validEquipment.department);
  await page.fill("input[name='model']", validEquipment.model);
  await page.fill("input[name='serialNumber']", validEquipment.serialNumber);
  await page.fill("input[name='installDate']", validEquipment.installDate);
  await page.selectOption("select[name='status']", validEquipment.status);

  // Submit the form
  await page.click("button[type='submit']");

  // Wait for success message
  await page.waitForSelector("text=Equipment added successfully!", { timeout: 60000 });
  await expect(page.locator("text=Equipment added successfully!")).toBeVisible();
});

// Test 2: Should show validation errors for invalid equipment data
test("Should show validation errors for invalid equipment data", async ({ page }) => {
  await page.goto("http://localhost:3000/dashboard/equipments_form");
  await page.click("button[type='submit']"); // Submit without filling fields

  // Check for required field validation errors
  await expect(page.locator("text=Name is required")).toBeVisible();
  await expect(page.locator("text=Location is required")).toBeVisible();
});

// Test 3: Should update status for selected equipment
test("Should update status for selected equipment", async ({ page, context }) => {
  // Sample data with Status enum values
  const sampleData = [
    {
      id: 1,
      name: "Drill Press",
      location: "Shop",
      department: "Machining",
      model: "DP-2000",
      serialNumber: "12345",
      installDate: "2023-01-01",
      status: Status.Operational,
    },
    {
      id: 2,
      name: "Lathe Machine",
      location: "Shop",
      department: "Assembly",
      model: "LM-500",
      serialNumber: "67890",
      installDate: "2022-06-15",
      status: Status.Down,
    },
  ];

  // Set up localStorage before the page loads
  await context.addInitScript((data) => {
    localStorage.setItem("equipmentData", JSON.stringify(data));
  }, sampleData);

  await page.goto("http://localhost:3000/dashboard/equipments_form/equipment_table", {
    waitUntil: "networkidle",
  });

  // Wait for the table to be loaded
  await page.waitForSelector("table", { timeout: 60000 });
  await page.waitForSelector("tbody tr", { timeout: 60000 });

  // Wait for the checkboxes to be visible
  const checkboxes = page.locator("tbody tr td input[type='checkbox']");
  const checkboxCount = await checkboxes.count();

  if (checkboxCount > 0) {
    await checkboxes.first().waitFor({ state: "visible", timeout: 60000 });
    await checkboxes.first().click(); // Select the first checkbox
  }

  // Ensure the selected checkbox is checked
  const isChecked = await checkboxes.first().isChecked();
  expect(isChecked).toBe(true);

  // Select the Bulk Update Status dropdown and choose a new status
  const bulkStatusDropdown = page.locator("select:nth-of-type(2)");
  await bulkStatusDropdown.selectOption({ label: Status.Maintenance });

  // Wait for the update to be reflected (if any visual feedback exists)
  await page.waitForTimeout(2000);

  // Validate status update
  const status = await page.locator("tbody tr td:nth-child(8)").first().textContent();
  expect(status).toBe(Status.Maintenance);
});

// Test 4: Should filter equipment table
test("Should filter equipment table", async ({ page, context }) => {
  // Sample equipment data for localStorage
  const sampleData = [
    {
      id: 1,
      name: "Drill Press",
      location: "Shop",
      department: "Machining",
      model: "DP-2000",
      serialNumber: "12345",
      installDate: "2023-01-01",
      status: Status.Operational,
    },
    {
      id: 2,
      name: "Lathe Machine",
      location: "Shop",
      department: "Assembly",
      model: "LM-500",
      serialNumber: "67890",
      installDate: "2022-06-15",
      status: Status.Down,
    },
  ];

  // Inject localStorage data before loading the page
  await context.addInitScript((data) => {
    localStorage.setItem("equipmentData", JSON.stringify(data));
  }, sampleData);

  await page.goto("http://localhost:3000/dashboard/equipments_form/equipment_table", {
    waitUntil: "networkidle",
  });

  // Ensure table is fully loaded before filtering
  await page.waitForSelector("table");
  await page.waitForSelector("tbody tr");

  // Fill the search input with "Drill Press"
  await page.fill("input[placeholder='Search by name...']", "Drill Press");

  // Wait for filtering to take effect dynamically
  await page.waitForFunction(() => {
    const rows = Array.from(document.querySelectorAll("tbody tr"));
    return rows.length === 1 && rows[0].textContent?.includes("Drill Press");
  });

  // Verify only "Drill Press" is visible
  await expect(page.locator("text=Drill Press")).toBeVisible();
  await expect(page.locator("tbody tr")).toHaveCount(1);
});
