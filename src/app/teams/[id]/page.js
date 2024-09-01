"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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

export default function TeamsPage({ params }) {
  const leagueId = params.id;
  const [teams, setTeams] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [newTeam, setNewTeam] = useState({ teamName: "", teamImage: null });

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(`http://192.168.100.16:3001/api/v1/teams`);
        const data = await response.json();
        setTeams(data.data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, [leagueId]);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("teamName", newTeam.teamName);
    formData.append("teamImage", newTeam.teamImage);
    formData.append("leagueId", leagueId);

    try {
      const response = await fetch("http://192.168.100.16:3001/api/v1/teams", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const createdTeam = await response.json();
        setTeams([...teams, createdTeam.data]);
        setIsDialogOpen(false);
        setNewTeam({ teamName: "", teamImage: null });
      } else {
        throw new Error("Failed to create team");
      }
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  const handleEditTeam = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("teamName", currentTeam.teamName);
    if (currentTeam.teamImage) {
      formData.append("teamImage", currentTeam.teamImage);
    }

    try {
      const response = await fetch(
        `http://192.168.100.16:3001/api/v1/teams/${currentTeam.id}`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      if (response.ok) {
        const updatedTeam = await response.json();
        setTeams(
          teams.map((team) =>
            team.id === updatedTeam.data.id ? updatedTeam.data : team
          )
        );
        setIsEditDialogOpen(false);
      } else {
        throw new Error("Failed to edit team");
      }
    } catch (error) {
      console.error("Error editing team:", error);
    }
  };

  const handleDeleteTeam = async () => {
    try {
      const response = await fetch(
        `http://192.168.100.16:3001/api/v1/teams/${currentTeam._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setTeams(teams.filter((team) => team._id !== currentTeam._id));
        setIsDeleteDialogOpen(false);
      } else {
        throw new Error("Failed to delete team");
      }
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewTeam({ ...newTeam, teamImage: e.target.files[0] });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Teams</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateTeam} className="space-y-4">
                <div>
                  <Label htmlFor="teamName">Team Name</Label>
                  <Input
                    id="teamName"
                    value={newTeam.teamName}
                    onChange={(e) =>
                      setNewTeam({ ...newTeam, teamName: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="teamLogo">Team Logo</Label>
                  <Input
                    id="teamLogo"
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    required
                  />
                </div>
                <Button type="submit">Create Team</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-lg bg-white shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team Name</TableHead>
                <TableHead>Logo</TableHead>
                <TableHead>Edit</TableHead>
                <TableHead>Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams?.map((team) => (
                <TableRow key={team.id}>
                  <TableCell className="font-medium text-lg">
                    {team.teamName}
                  </TableCell>
                  <TableCell>
                    <Image
                      src={team.image}
                      alt={`${team.teamName} logo`}
                      width={50}
                      height={50}
                      className="rounded-md"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      className="bg-yellow-500"
                      onClick={() => {
                        setCurrentTeam(team);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Pencil color="black" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      className="bg-red-500"
                      onClick={() => {
                        setCurrentTeam(team);
                        setIsDeleteDialogOpen(true);
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

        {/* Edit Team Dialog */}
        {currentTeam && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit League</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditTeam} className="space-y-4">
                <div>
                  <Label htmlFor="name">League Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={currentTeam.name}
                    onChange={(e) =>
                      setCurrentTeam({
                        ...currentTeam,
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
                      setCurrentTeam({
                        ...currentTeam,
                        image: e.target.files[0],
                      })
                    }
                  />
                </div>

                <Button type="submit">Update Team</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this Team?</p>
            <div className="flex justify-end space-x-4">
              <Button
                variant="ghost"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                No
              </Button>
              <Button
                onClick={handleDeleteTeam}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Yes, Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
