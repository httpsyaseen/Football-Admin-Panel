"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MatchEditDialog from "@/components/EditDialog";
import { Pencil, Trash2, Bell, X } from "lucide-react";
import { toast } from "react-hot-toast";

import Sidebar from "@/components/Sidebar";
import DeleteDialog from "@/components/DeleteDialog";
import { host } from "@/lib/host";
import MatchCreationDialog from "@/components/matchDialog";
import Loading from "@/components/Loading";
import { getLeaguesFromSessionStorage } from "@/utils/league";

export default function MatchManagementPage({ params }) {
  const leagueId = params.id;
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [teamOptions, setTeamOptions] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [newMatch, setNewMatch] = useState({
    teamA: "",
    teamB: "",
    isLive: false,
    time: "",
    leagueId: leagueId,
    channels: [
      {
        name: "",
        uri: "",
        headers: { origin: "", referer: "", "user-agent": "" },
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetched Called");
      setLoading(true);
      try {
        const matchesResponse = await axios.get(`${host}/matches/${leagueId}`);
        setMatches(matchesResponse.data.data);
        const teamOptionsResponse = await axios.get(
          `${host}/teams/meta/${leagueId}`
        );
        setTeamOptions(teamOptionsResponse.data.data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [leagueId]);

  const getTeamName = (id) => {
    const team = teamOptions.find((team) => team._id === id);
    return team?.teamName || "Reload Page";
  };

  const getTime = (gameDate) => {
    const date = new Date(gameDate);

    const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
    return formattedDate;
  };

  const handleCreateMatch = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(`${host}/matches`, newMatch);
      console.log(data);
      setMatches([...matches, data.data]);
      setIsDialogOpen(false);
      setNewMatch({
        teamA: "",
        teamB: "",
        isLive: false,
        time: "",
        leagueId: leagueId,
        channels: [
          {
            name: "",
            uri: "",
            headers: { origin: "", referer: "", "user-agent": "" },
          },
        ],
      });
      toast.success("Match created successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error creating match");
    }
  };

  const handleEditMatch = async (e) => {
    try {
      const response = await axios.patch(
        `${host}/matches/${currentMatch._id}`,
        currentMatch
      );
      const updatedMatches = matches.map((match) =>
        match._id === response.data.data._id ? response.data.data : match
      );
      setMatches(updatedMatches);
      setIsEditDialogOpen(false);
      toast.success("Match updated successfully");
    } catch (error) {
      toast.error("Error updating match");
    }
  };

  const handleDeleteMatch = async () => {
    try {
      await axios.delete(`${host}/matches/${currentMatch._id}`);
      const updatedMatches = matches.filter(
        (match) => match._id !== currentMatch._id
      );
      setMatches(updatedMatches);
      setIsDeleteDialogOpen(false);
      toast.success("Match deleted successfully");
    } catch (error) {
      toast.error("Error deleting match");
    }
  };

  const handleNotification = async (match) => {
    const leagues = getLeaguesFromSessionStorage();
    console.log(match);
    const currentLeague = leagues?.find((league) => league._id === leagueId);
    console.log(currentLeague);

    await toast.promise(
      axios.post(`${host}/games/notify`, {
        title: `${currentLeague.name}`,
        body: `${getTeamName(match.team1)} VS ${getTeamName(match.team2)}`,
      }),
      {
        loading: "Sending Notifications",
        success: `Notification sent for ${getTeamName(
          match.team1
        )} VS ${getTeamName(match.team2)}`,
        error: "Error sending notification",
      }
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Matches</h1>
          <MatchCreationDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            newMatch={newMatch}
            setNewMatch={setNewMatch}
            handleCreateMatch={handleCreateMatch}
            teamOptions={teamOptions}
          />
        </div>

        <div className="rounded-lg bg-white shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team A</TableHead>
                <TableHead>Team B</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Channels</TableHead>
                <TableHead>Is Live</TableHead>
                <TableHead>Notification</TableHead>
                <TableHead>Edit</TableHead>
                <TableHead>Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matches?.map((match) => (
                <TableRow key={match.id}>
                  <TableCell>{getTeamName(match.team1)}</TableCell>
                  <TableCell>{getTeamName(match.team2)}</TableCell>
                  <TableCell>{getTime(match.time)}</TableCell>
                  <TableCell className="ps-4">
                    {match.channels?.length}
                  </TableCell>
                  <TableCell>{match.isLive ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleNotification(match)}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <Bell className="h-4 w-4" />
                      <span className="sr-only">Send notification</span>
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        setCurrentMatch(match);
                        setIsEditDialogOpen(true);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit match</span>
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        setCurrentMatch(match);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete match</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {currentMatch && (
          <MatchEditDialog
            isOpen={isEditDialogOpen}
            onClose={setIsEditDialogOpen}
            handleEditMatch={handleEditMatch}
            teamOptions={teamOptions}
            currentMatch={currentMatch}
            setCurrentMatch={setCurrentMatch}
          />
        )}

        <DeleteDialog
          modal={isDeleteDialogOpen}
          setModal={setIsDeleteDialogOpen}
          handleDelete={handleDeleteMatch}
        />
        {loading && <Loading />}
      </main>
    </div>
  );
}
