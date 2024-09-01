"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { host } from "@/lib/host";
import toast from "react-hot-toast";

export default function Component() {
  const [leagues, setLeagues] = useState([]);

  useEffect(() => {
    const getLeagues = async () => {
      const response = await fetch(`${host}/leagues`);
      if (!response.ok) {
        toast.error("Gannot get Leagues");
      } else {
        const data = await response.json();
        setLeagues(data.data);
      }
    };
    getLeagues();
  }, []);
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            Select League
          </h1>
        </div>

        <div className="rounded-lg bg-white shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>League Name</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leagues?.map((league) => (
                <TableRow
                  key={league.name}
                  className="group cursor-pointer hover:bg-gray-100"
                >
                  <Link href={`/teams/${league._id}`} className="contents">
                    <TableCell className="font-medium">{league.name}</TableCell>
                    <TableCell>
                      <Image
                        src={league.image}
                        alt={`${league.name} logo`}
                        width={60}
                        height={60}
                        className="rounded-md"
                      />
                    </TableCell>
                    <TableCell>{league.description}</TableCell>
                  </Link>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
