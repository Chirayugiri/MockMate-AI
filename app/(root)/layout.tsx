"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { signOut } from "@/lib/actions/auth.action";

const Layout = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [loadingSignOut, setLoadingSignOut] = useState(false); // ✅ loading state
  const router = useRouter();

  const handleFormAction = async () => {
    setLoadingSignOut(true); // ✅ show loader
    await signOut(); // ✅ server-side action
    router.push("/sign-in"); // ✅ client-side redirect
  };

  return (
    <>
      <div className="root-layout">
        <nav className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="MockMate Logo" width={38} height={32} />
            <h2 className="text-primary-100">MockMate</h2>
          </Link>

          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              style={{ cursor: "pointer" }}
            >
              <Image
                src="/boy.png"
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            </button>

            {open && (
              <form
                action={handleFormAction}
                className="absolute right-0 mt-2 z-50"
              >
                <button
                  type="submit"
                  className="min-w-[120px] whitespace-nowrap bg-neutral-900 text-white px-4 py-2 rounded-md border border-neutral-700 hover:text-red-400 text-sm text-left"
                  style={{ cursor: "pointer" }}
                >
                  Sign out
                </button>
              </form>
            )}
          </div>
        </nav>

        {children}
      </div>

      {/* ✅ Fullscreen Sign-out Loader */}
      {loadingSignOut && (
        <div className="fixed inset-0 z-50 bg-[#0d0d0d]/90 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="h-12 w-12 border-4 border-neutral-700 border-t-blue-500 rounded-full animate-spin" />
          <p className="mt-4 text-sm text-neutral-300 tracking-wide font-medium">
            Signing out...
          </p>
        </div>
      )}
    </>
  );
};

export default Layout;
