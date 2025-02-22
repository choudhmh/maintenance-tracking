# Maintenance Tracking System

The Equipment Maintenance Dashboard is a React (Next.js) application designed to track, monitor, and analyze maintenance activities for various equipment. It provides key insights into equipment status, maintenance history, and department-level workload using interactive charts and a user-friendly interface.

🎥 **Demo Video:**  
The video demonstarte how it functions currently can be found here:
https://drive.google.com/file/d/1f4lqdK72dllvh66_o2AoTZvWPu7b7-iZ/view?usp=sharing 


## 🚀 Features

1️⃣ Equipment Management Form

- Navigate to the Equipment Form
- Enter name, location, department, model, serial number, and install date
- Click "Submit" to store the equipment on local Storage

Equipment Table:

- Displays all equipment details with sorting and filtering
- Status-based row coloring for quick visual reference
- Enable bulk status updates

2️⃣ Maintenance Tracking

- Go to the Maintenance Form
- Select an Equipment, enter date, select type, technician name, hours spent, brief description, parts used (optional), select priority and select status
- Click "Submit" to save the maintenance record

Maintenance Records Table:

- Display all maintenance logs
- Includes equipment name (retrived from equipment data table)
- Enable sorting and filtering
- Group by equipment for better organization

3️⃣ Dashboard & Analytics

- Equipment Status Breakdown 📊 (Pie Chart - Active, Under Maintenance, etc.)
- Maintenance Hours by Department 📈 (Bar Chart - Department-wise maintenance workload)
- Recent Maintenance Activities 📋 (List of latest maintenance logs)

## Tech Stack

- Frontend: Next.js (React), TypeScript, Tailwind CSS
- State Management: React Hooks (useState, useEffect)
- Data Visualization: Recharts (PieChart, BarChart)
- Form Handling & Validation: Zod
- Local Storage: Used to persist equipment and maintenance data

## Folder Structure

```
📦 src
┣ 📂 app
┃ ┣ 📂 dashboard
┃ ┃ ┣ 📜 page.tsx # Dashboard page with charts
┃ ┣ 📂 equipments_form # Equipment-related forms & components
┃ ┃ ┣ 📜 page.tsx # Equipment form page
┃ ┃ ┣ 📜 equipment_table.tsx # Equipment table with sorting/filtering
┃ ┃ ┣ 📂 maintenance_form # Maintenance form inside equipment module
┃ ┃ ┃ ┣ 📜 page.tsx # Maintenance form page
┃ ┃ ┃ ┣ 📂 maintenance_table # Maintenance records table inside maintenance form
┃ ┃ ┃ ┃ ┣ 📜 page.tsx # Maintenance table page
┃ ┃ ┃ ┃ ┣ 📜 maintenance_table.tsx # Maintenance records table with sorting & grouping
┃ ┃ ┣ 📜 zodSchemas.ts # Validation schemas (Zod)
┃ ┃ ┣ 📜 enum.ts # Enum definitions (Status, Priority, Department)
┃ ┣ 📜 page.tsx # Main app entry
┃ ┣ 📂 test
┃ ┃ ┃ ┣ 📜 equipment.spec.ts
┃ ┃ ┃ ┣ 📜 maintenance.spec.ts
┣ 📜 package.json
┣ 📜 tsconfig.json
┣ 📜 README.md
```

## Pre-requisites

[Node.js](https://nodejs.org/en/download) (version 14 or higher)

[npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Installation Instruction

To clone and run this application, you'll need Git and Node.js installed on your computer. Once installed from your command line type:

```
git clone https://github.com/choudhmh/maintenance-tracking
```

then:

```
cd maintenance-tracking
```

## Installation Dependencies

Now install the important dependencies:

```
npm install
or
yarn install
```

Once installation completed.
Start the development server:

```
npm run dev
or
yarn dev
```

The application should now be running at http://localhost:3000.

No other dependecies should be required to download as the ones needed are already downloaded / installed on the package.json file

## Testing Procedure

Testing was done using Playwright to make sure everything fully works according to the requirements.

To test the code, in one termninal make sure the application is running: 

``` npm run dev ```

which will load up http://localhost:3000 (might need to load that page up on a browser if it doesn't automatically open)


Open another terminal and cd into the tests folder:
``` cd tests ```


then either you test each file individually or test both at once.
For individuall testing (which I reccomend) type in:


``` 
npx playwright test tests/equipment.spec.ts 

which will run the test. When that testis complete; test the other file: 

npx playwright test tests/maintenance.spec.ts
```


If you want to test both at once:

```
npx playwright test  
```

The testing will showcase any errors you have. Make sure when testing on the code each page has the correct url to locate the tests, example:

```
http://localhost:3000/dashboard/equipments_form
```


Hope this helps & clear!

## Thank You, Happy Coding! ##
