import Navbar from "@/app/_components/navbar";
import Sidebar from "@/app/_components/sidebar";
import Loading from "@/app/loading";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);
    console.log({session});

  if (!session) {
    return redirect("/login");
  }
    return (
        <div className="min-h-screen w-full overflow-hidden">
            <section className=" hidden md:block md:fixed top-0 left-0 w-[160px] border-r-2 border-[#EAECF0] min-h-screen">
                <Sidebar />
            </section>
            <main className="md:ml-[160px] p-3 min-h-screen">
                <Navbar user={session?.user}/>
                <Suspense fallback={<Loading />}>
                    <section className="pt-3">
                        {children}
                    </section>
                </Suspense>
            </main>
        </div>
    )
}