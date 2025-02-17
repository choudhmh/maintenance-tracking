import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard"); // Redirect to the dashboard on load
}
