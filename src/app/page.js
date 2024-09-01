"use client";
import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import { fetchAndStoreLeagues } from "@/utils/league";
import Loading from "./loading";

export default function Page() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAndStoreLeagues(setLoading);
  }, []);

  return (
    <>
      <div className=" flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex justify-center items-center text-center">
          <h1 className="text-bold text-5xl">Welcome to Hell Fire Dashboard</h1>
          {loading && <Loading />}
        </div>
      </div>
    </>
  );
}
