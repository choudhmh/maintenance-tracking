# Maintenance Tracking System

The Equipment Maintenance Dashboard is a React (Next.js) application designed to track, monitor, and analyze maintenance activities for various equipment. It provides key insights into equipment status, maintenance history, and department-level workload using interactive charts and a user-friendly interface.

🚀 Features

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
- Include equipment name (joined from equipment data)
- Enable sorting and filtering
- Group by equipment for better organization

3️⃣ Dashboard & Analytics

- Equipment Status Breakdown 📊 (Pie Chart - Active, Under Maintenance, etc.)
- Maintenance Hours by Department 📈 (Bar Chart - Department-wise maintenance workload)
- Recent Maintenance Activities 📋 (List of latest maintenance logs)

Tech Stack

- Frontend: Next.js (React), TypeScript, Tailwind CSS
- State Management: React Hooks (useState, useEffect)
- Data Visualization: Recharts (PieChart, BarChart)
- Form Handling & Validation: Zod
- Local Storage: Used to persist equipment and maintenance data

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
git clone: https://github.com/choudhmh/maintenance-tracking

then:

cd maintenance-tracking
```

## Installation Dependencies

Now install te important dependencies:

```
npm install
or
yarn install

Once installation completed.
Start the development server:

npm run dev
or
yarn dev
```

The application should now be running at http://localhost:3000.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```

```
