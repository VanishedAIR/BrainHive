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