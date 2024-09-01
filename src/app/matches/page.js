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
import Loading from "@/components/Loading";

export default function Component() {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLeagues = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${host}/leagues`);
        if (!response.ok) {
          throw Error("Cannot Fetch Leagues");
        } else {
          const data = await response.json();
          setLeagues(data.data);
        }
      } catch (err) {
        toast.error("Error Fetch Leagues");
      } finally {
        setLoading(false);
      }
    };
    getLeagues();
  }, []);
  return (
    <div className="flex h-screen bg-gray-100">
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
          {loading && <Loading />}
        </div>
      </main>
    </div>
  );
}
