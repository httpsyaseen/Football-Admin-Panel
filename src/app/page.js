"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Loader from "../components/Loader";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function Component() {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLeague, setNewLeague] = useState({
    name: "",
    image: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLeague((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newLeague.name && newLeague.image && newLeague.description) {
      setLeagues((prev) => [...prev, newLeague]);
      setNewLeague({ name: "", image: "", description: "" });
      setIsModalOpen(false);
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Leagues</h1>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add League
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New League</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">League Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newLeague.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    value={newLeague.image}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newLeague.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <Button type="submit">Add League</Button>
              </form>
            </DialogContent>
          </Dialog>
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
                <TableRow key={league.name}>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {loading && <Loader />}
      </main>
    </div>
  );
}
