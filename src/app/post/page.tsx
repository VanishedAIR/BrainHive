import Post from "@/app/_components/post";
import Navbar from "../_components/navbar";
export default function PostPage() {
    return (
        <div className = "relative">
            <section className="flex flex-col flex-1">
                <Navbar />
            </section>
            <Post />
        </div>
    );
}