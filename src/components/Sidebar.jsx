"use client";

import Link from "next/link";
import { Trophy, Settings, Flame, Dribbble, CalendarDays } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const path = usePathname();
  const isActive = (pathname) => path.includes(pathname);
  return (
    <aside className="w-64 bg-white shadow-md">
      <nav className="p-4">
        <ul className="space-y-2">
          <li className="mb-10 font-bold text-lg">
            <Link
              href="/"
              className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-200 ${
                path === "/"
              } && "bg-gray-200"
              }`}
            >
              <Flame className="h-5 w-5" />
              <span>HellFire Apps</span>
            </Link>
            <hr />
          </li>
          <li>
            <Link
              href="/leagues"
              className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-200 ${
                isActive("/leagues") && "bg-gray-200"
              }`}
            >
              <Trophy className="h-5 w-5" />
              <span>Leagues</span>
            </Link>
          </li>
          <li>
            <Link
              href="/teams"
              className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-200 ${
                isActive("/teams") && "bg-gray-200"
              }`}
            >
              <Dribbble className="h-5 w-5" />
              <span>Teams</span>
            </Link>
          </li>
          <li>
            <Link
              href="/matches"
              className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-200 ${
                isActive("/matches") && "bg-gray-200"
              }`}
            >
              <CalendarDays className="h-5 w-5" />
              <span>Matches</span>
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-200  ${
                isActive("/settings") && "bg-gray-200"
              }`}
            >
              <Settings className="h-5 w-5" />
              <span>App Configuration</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
