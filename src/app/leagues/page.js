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
import Loader from "@/components/Loader";

export default function Component() {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentLeague, setCurrentLeague] = useState(null);
  const [newLeague, setNewLeague] = useState({
    name: "",
    image: "",
    description: "",
  });

  useEffect(() => {
    const getLeagues = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${host}/leagues`);
        if (!response.ok) {
          throw Error("Cannot Fetch Leagues");
        }
        const data = await response.json();
        setLeagues(data.data);
      } catch (err) {
        toast.error("Error Fetch Leagues");
      } finally {
        setLoading(false);
      }
    };
    getLeagues();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLeague((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

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
      const createdLeague = await response.json();
      setLeagues((prev) => [...prev, createdLeague.data]);
      setNewLeague({ name: "", image: "", description: "" });
      setIsCreateModalOpen(false);
    } else {
      toast.error("Error Creating League");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const newImage = e.target.image?.files[0];

    // Check if a new image has been selected
    if (newImage) {
      console.log(newImage);
      formData.append("leagueImage", newImage);
    }

    // Append other fields regardless of change
    formData.append("name", currentLeague.name);
    formData.append("description", currentLeague.description);
    console.log(formData);
    // Prepare the PATCH request
    const response = await fetch(`${host}/leagues/${currentLeague._id}`, {
      method: "PATCH",
      body: formData,
    });

    if (response.ok) {
      toast.success("League Updated");
      const updatedLeague = await response.json();
      setLeagues((prev) =>
        prev.map((league) =>
          league._id === updatedLeague.data._id ? updatedLeague.data : league
        )
      );
      setIsEditModalOpen(false);
    } else {
      toast.error("League Cannot Updated");
    }
  };

  const handleDeleteLeague = async () => {
    const response = await fetch(`${host}/leagues/${currentLeague._id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      toast.success("League Deleted Successfully");
      setLeagues((prev) =>
        prev.filter((league) => league._id !== currentLeague._id)
      );
      setIsDeleteModalOpen(false);
    } else {
      toast.error("Error in Deleting League");
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
                <Button type="submit">Update League</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}

        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this league?</p>
            <div className="flex justify-end space-x-4">
              <Button
                variant="ghost"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                No
              </Button>
              <Button
                onClick={handleDeleteLeague}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Yes, Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        {loading && <Loader />}
      </main>
    </div>
  );
}
