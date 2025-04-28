/**
 * PostPage Component
 *
 * This component renders the post creation page for the Study Group Finder application.
 * It ensures that only authenticated users can access the page. If the user is not authenticated, they are redirected to the home page.
 *
 * Components Used:
 * - `Navbar`: Displays the navigation bar for the application.
 * - `Post`: A component that allows users to create a new study group post.
 *
 * External Actions:
 * - `getCurrentUser`: Retrieves the currently signed-in user from the server.
 * - `redirect`: Redirects the user to a specified path if they are not authenticated.
 *
 * Behavior:
 * - Checks if the user is authenticated using `getCurrentUser`.
 * - Redirects unauthenticated users to the `/home` page.
 * - Displays the `Navbar` and `Post` components for authenticated users.
 *
 * Styling:
 * - Uses a `relative` container for layout.
 * - Organizes content in a flex column layout.
 */

import Post from "@/app/_components/post";
import Navbar from "../_components/navbar";
import { getCurrentUser } from "@/actions/useractions";
import { redirect } from "next/navigation";

export default async function PostPage() {
    const user = await getCurrentUser();

    if (!user) {
        return redirect("/home");
    }

    return (
        <div className="relative">
            <section className="flex flex-col flex-1">
                <Navbar />
            </section>
            <Post redirectPath="/home" />
        </div>
    );
}