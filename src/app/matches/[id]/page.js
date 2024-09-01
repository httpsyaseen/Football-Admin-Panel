"use client";

import { useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2 } from "lucide-react";

// Mock data for matches
const initialMatches = [
  {
    id: 1,
    team1: { name: "Team A", logo: "/placeholder.svg" },
    team2: { name: "Team B", logo: "/placeholder.svg" },
    isLive: true,
    time: "15:00",
  },
  {
    id: 2,
    team1: { name: "Team C", logo: "/placeholder.svg" },
    team2: { name: "Team D", logo: "/placeholder.svg" },
    isLive: false,
    time: "18:30",
  },
  {
    id: 3,
    team1: { name: "Team E", logo: "/placeholder.svg" },
    team2: { name: "Team F", logo: "/placeholder.svg" },
    isLive: false,
    time: "20:00",
  },
];

export default function MatchesPage() {
  const [matches, setMatches] = useState(initialMatches);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMatch, setNewMatch] = useState({ team1: "", team2: "", time: "" });

  const handleCreateMatch = (e) => {
    e.preventDefault();
    const newId =
      matches.length > 0 ? Math.max(...matches.map((m) => m.id)) + 1 : 1;
    const createdMatch = {
      id: newId,
      team1: { name: newMatch.team1, logo: "/placeholder.svg" },
      team2: { name: newMatch.team2, logo: "/placeholder.svg" },
      isLive: false,
      time: newMatch.time,
    };
    setMatches([...matches, createdMatch]);
    setIsDialogOpen(false);
    setNewMatch({ team1: "", team2: "", time: "" });
  };

  const toggleLive = (id) => {
    setMatches(
      matches.map((match) =>
        match.id === id ? { ...match, isLive: !match.isLive } : match
      )
    );
  };

  const deleteMatch = (id) => {
    setMatches(matches.filter((match) => match.id !== id));
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Matches</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Create Match</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Match</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateMatch} className="space-y-4">
                <div>
                  <Label htmlFor="team1">Team 1</Label>
                  <Input
                    id="team1"
                    value={newMatch.team1}
                    onChange={(e) =>
                      setNewMatch({ ...newMatch, team1: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="team2">Team 2</Label>
                  <Input
                    id="team2"
                    value={newMatch.team2}
                    onChange={(e) =>
                      setNewMatch({ ...newMatch, team2: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newMatch.time}
                    onChange={(e) =>
                      setNewMatch({ ...newMatch, time: e.target.value })
                    }
                    required
                  />
                </div>
                <Button type="submit">Create Match</Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team 1</TableHead>
                <TableHead>Team 2</TableHead>
                <TableHead>Live</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matches.map((match) => (
                <TableRow key={match.id}>
                  <TableCell className="flex items-center space-x-2">
                    <Image
                      src={match.team1.logo}
                      alt={`${match.team1.name} logo`}
                      width={40}
                      height={40}
                    />
                    <span>{match.team1.name}</span>
                  </TableCell>
                  <TableCell className="flex items-center space-x-2">
                    <Image
                      src={match.team2.logo}
                      alt={`${match.team2.name} logo`}
                      width={40}
                      height={40}
                    />
                    <span>{match.team2.name}</span>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={match.isLive}
                      onCheckedChange={() => toggleLive(match.id)}
                    />
                  </TableCell>
                  <TableCell>{match.time}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMatch(match.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
