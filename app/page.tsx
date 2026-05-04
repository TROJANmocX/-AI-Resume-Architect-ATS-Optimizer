/**
 * Root Page Component
 * Currently redirects users to the landing page.
 */
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/landing");
}

