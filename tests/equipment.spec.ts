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
  await page.goto("http://localhost:3001/dashboard/equipments_form");
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
  await page.goto("http://localhost:3001/dashboard/equipments_form");
  await page.click("button[type='submit']"); // Submit without filling fields

  // Check for required field validation errors
  await expect(page.locator("text=Name is required")).toBeVisible();
  await expect(page.locator("text=Location is required")).toBeVisible();
});

// Test 3: Should update status for selected equipment
test("Should update status for selected equipment", async ({ page, context }) => {
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

  await page.goto("http://localhost:3001/dashboard/equipments_form/equipment_table", {
    waitUntil: "networkidle",
  });

  // Ensure table loads with correct number of rows
  const rows = page.locator("tbody tr");
  await expect(rows).toHaveCount(sampleData.length, { timeout: 60000 });

  // Ensure checkboxes exist
  const checkboxes = page.locator("tbody tr td input[type='checkbox']");
  await expect(checkboxes).toHaveCount(sampleData.length, { timeout: 60000 });

  // Ensure first checkbox is interactable before clicking
  await checkboxes.first().waitFor({ state: "visible", timeout: 60000 });
  await checkboxes.first().click();

  // Verify if checkbox is checked
  await expect(checkboxes.first()).toBeChecked();

  // Select Bulk Update Status dropdown and update
  const bulkStatusDropdown = page.locator("select:nth-of-type(2)");
  await bulkStatusDropdown.selectOption({ label: Status.Maintenance });

  // Wait for UI to update
  await page.waitForTimeout(2000);

  // Verify first row status update
  const firstRowStatus = await page.locator("tbody tr:nth-child(1) td:nth-child(8)").textContent();
  expect(firstRowStatus).toBe(Status.Maintenance);
});


// Test 4: Should filter equipment table
test("Should filter equipment table", async ({ page, context }) => {
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

  await page.goto("http://localhost:3001/dashboard/equipments_form/equipment_table", {
    waitUntil: "networkidle",
  });

  // Ensure table is fully loaded before filtering
  await page.waitForSelector("table", { timeout: 60000 });
  await page.waitForSelector("tbody tr", { timeout: 60000 });

  // Fill the search input
  const searchInput = page.locator("input[placeholder='Search by name...']");
  await searchInput.fill("Drill Press");

  // Wait for filtering to take effect dynamically
  await page.waitForTimeout(2000);

  // Ensure only "Drill Press" is visible
  const visibleRows = page.locator("tbody tr");
  await expect(visibleRows).toHaveCount(1, { timeout: 60000 });
  await expect(page.locator("text=Drill Press")).toBeVisible();
});
