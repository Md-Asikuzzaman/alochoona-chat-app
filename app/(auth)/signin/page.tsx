"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

const SignIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { data } = useSession();
  const user = data?.user as UserType;

  const { mutate } = useMutation({
    mutationKey: ["online_status"],
    mutationFn: async ({ status, id }: { status: string; id: string }) => {
      const { data } = await axios.post(`/api/online-status/${id}`, {
        status,
      });
      return data;
    },
  });

  const handleSubmit = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email !== "" && password !== "") {
      setIsLoading(true);
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      }).then(({ ok, error }: any) => {
        if (ok) {
          toast.success("Login successful!!!");
          router.push("/");
          router.refresh();
          setIsLoading(false);
        } else {
          toast.error(error);
          setIsLoading(false);
        }
      });
    }
    setEmail("");
    setPassword("");
  };

  // [Update] online status
  useEffect(() => {
    if (user && user?.id) {
      mutate({
        status: "online",
        id: user.id,
      });
    }
  }, [user]);

  return (
    <section className="bg-zinc-200 dark:bg-gray-900">
      <div className="mx-auto flex h-screen flex-col items-center justify-center px-6 py-8 lg:py-0">
        <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 md:space-y-6"
              action="#"
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>

                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  placeholder="example@gmail.com"
                  className="input input-bordered w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  placeholder="••••••••"
                  className="input input-bordered w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full rounded-lg bg-violet-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-300"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don't have an account yet?{" "}
                <Link href={"/signup"}>
                  <span className="text-primary-600 dark:text-primary-500 font-medium hover:underline">
                    Sign up
                  </span>
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
