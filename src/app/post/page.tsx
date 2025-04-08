import Post from "@/app/_components/post";
import ClientNavbar from "../_components/ClientNavbar";
import Link from "next/link";
export default function PostPage() {
    return (
        <div className = "relative">
            <section>
                <header className="flex justify-between items-center p-4 h-25">
                <Link href="/">
                    <img
                    src="/logo.svg"
                    alt="Logo"
                    className="h-20 w-20 mt-1.35"
                    />
                </Link>
                <ClientNavbar />
                </header>
            </section>
            <Post />
        </div>
    );
}