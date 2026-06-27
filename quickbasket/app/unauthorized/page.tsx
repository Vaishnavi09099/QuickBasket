import Link from "next/link";
import { ShieldAlert } from "lucide-react";

const Unauthorized = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md rounded-2xl bg-white p-8 shadow-lg text-center">
        <ShieldAlert className="mx-auto h-16 w-16 text-red-500" />

        <h1 className="mt-4 text-3xl font-bold text-gray-800">
          Unauthorized Access
        </h1>

        <p className="mt-2 text-gray-600">
          You don't have permission to access this page.
        </p>

        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-black px-5 py-3 text-white transition hover:bg-gray-800"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;