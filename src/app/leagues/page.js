"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import toast from "react-hot-toast";
import { host } from "@/lib/host";
import {
  addLeague,
  deleteLeagueFromStorage,
  getLeaguesFromSessionStorage,
  setUpdateLeagueStorage,
} from "@/utils/league";
import DeleteDialog from "@/components/DeleteDialog";

export default function Component() {
  const [leagues, setLeagues] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentLeague, setCurrentLeague] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newLeague, setNewLeague] = useState({
    name: "",
    image: "",
    description: "",
  });

  useEffect(() => {
    const data = getLeaguesFromSessionStorage();
    setLeagues(data || []);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLeague((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", newLeague.name);
    formData.append("image", e.target.image.files[0]);
    formData.append("description", newLeague.description);

    const response = await fetch(`${host}/leagues`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      toast.success("League Created");
      const updatedLeague = await response.json();
      addLeague(updatedLeague.data);
      setLeagues((prev) => [...prev, updatedLeague.data]);
      setNewLeague({ name: "", image: "", description: "" });
      setIsCreateModalOpen(false);
    } else {
      toast.error("Error Creating League");
    }
    setLoading(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    const newImage = e.target.image?.files[0];

    if (newImage) {
      console.log(newImage);
      formData.append("leagueImage", newImage);
    }
    // Append other fields regardless of change
    formData.append("name", currentLeague.name);
    formData.append("description", currentLeague.description);

    try {
      const response = await fetch(`${host}/leagues/${currentLeague._id}`, {
        method: "PATCH",
        body: formData,
      });

      if (response.ok) {
        const updatedLeague = await response.json();
        setUpdateLeagueStorage(updatedLeague.data);
        setLeagues((prevLeagues) => {
          return prevLeagues.map((league) =>
            league._id === updatedLeague.data._id ? updatedLeague.data : league
          );
        });

        toast.success("League Updated");
        setIsEditModalOpen(false);
      } else {
        toast.error("League Cannot Be Updated");
      }
    } catch (error) {
      console.error("Error updating league:", error);
      toast.error("An error occurred while updating the league");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLeague = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${host}/leagues/${currentLeague._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        deleteLeagueFromStorage(currentLeague);
        setLeagues((prevLeagues) => {
          const updatedLeagues = prevLeagues.filter(
            (league) => league._id !== currentLeague._id
          );
          return updatedLeagues;
        });

        toast.success("League Deleted Successfully");
        setIsDeleteModalOpen(false);
      } else {
        const errorData = await response.json();
        toast.error(
          `Error in Deleting League: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error deleting league:", error);
      toast.error("An error occurred while deleting the league");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Leagues</h1>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
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
              <form onSubmit={handleCreateSubmit} className="space-y-4">
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
                  <Label htmlFor="image">Image</Label>
                  <Input
                    id="image"
                    name="image"
                    type="file"
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
                <Button type="submit">
                  {loading ? "Loading" : "Add League"}
                </Button>
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
                <TableHead>Edit League</TableHead>
                <TableHead>Delete League</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leagues?.map((league) => (
                <TableRow key={league._id}>
                  <TableCell className="font-medium text-lg">
                    {league.name}
                  </TableCell>
                  <TableCell>
                    <Image
                      src={league.image}
                      alt={`${league.name} logo`}
                      width={60}
                      height={60}
                      className="rounded-md"
                    />
                  </TableCell>
                  <TableCell className="text-md ">
                    {league.description}
                  </TableCell>
                  <TableCell>
                    <Button
                      className="bg-yellow-500 ms-4"
                      onClick={() => {
                        setCurrentLeague(league);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <Pencil color="black" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      className="bg-red-500 ms-4"
                      onClick={() => {
                        setCurrentLeague(league);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {currentLeague && (
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit League</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">League Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={currentLeague.name}
                    onChange={(e) =>
                      setCurrentLeague({
                        ...currentLeague,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="image">Image</Label>
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    onChange={(e) =>
                      setCurrentLeague({
                        ...currentLeague,
                        image: e.target.files[0],
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={currentLeague.description}
                    onChange={(e) =>
                      setCurrentLeague({
                        ...currentLeague,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <Button type="submit">
                  {loading ? "Loading" : "Update League"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}

        <DeleteDialog
          modal={isDeleteModalOpen}
          setModal={setIsDeleteModalOpen}
          handleDelete={handleDeleteLeague}
        />
      </main>
    </div>
  );
}
