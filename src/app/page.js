"use client";
import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import { fetchAndStoreLeagues } from "@/utils/league";
import Loading from "./loading";
import Particles from "@/components/magicui/particles";
import RetroGrid from "@/components/magicui/retro-grid";

export default function Page() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAndStoreLeagues(setLoading);
  }, []);

  return (
    <>
      <div className=" flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex justify-center items-center text-center relative">
          <Particles
            className="absolute inset-0"
            quantity={200}
            size={1.5}
            ease={80}
            vx={0.3}
            vy={0.3}
            color={"black"}
            refresh
          />
          <span className="pointer-events-none  whitespace-pre-wrap bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center text-7xl font-bold leading-none tracking-tighter text-transparent">
            Welcome to HellFire Apps
          </span>
          <RetroGrid />
          {loading && <Loading />}
        </div>
      </div>
    </>
  );
}
