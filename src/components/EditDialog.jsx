import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, X } from "lucide-react";

export default function MatchEditDialog({
  isOpen,
  onClose,
  handleEditMatch,
  currentMatch,
  setCurrentMatch,
  teamOptions,
}) {
  const addChannel = () => {
    const updatedChannels = [
      ...currentMatch.channels,
      {
        name: "",
        uri: "",
        headers: { origin: "", referer: "", "user-agent": "" },
      },
    ];
    setCurrentMatch({ ...currentMatch, channels: updatedChannels });
  };

  const getTime = (gameDate) => {
    // Convert the UTC time to a Date object
    const date = new Date(gameDate);

    // Format the date as yyyy-MM-ddThh:mm
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // Combine the parts into the desired format
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

    return formattedDate;
  };

  const removeChannel = (index) => {
    const updatedChannels = currentMatch.channels.filter((_, i) => i !== index);
    setCurrentMatch({ ...currentMatch, channels: updatedChannels });
  };

  const updateChannel = (index, field, value) => {
    const updatedChannels = currentMatch.channels.map((channel, i) => {
      if (i === index) {
        if (field.includes(".")) {
          const [headerField, subField] = field.split(".");
          return {
            ...channel,
            headers: { ...channel.headers, [subField]: value },
          };
        }
        return { ...channel, [field]: value };
      }
      return channel;
    });
    setCurrentMatch({ ...currentMatch, channels: updatedChannels });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[670px]">
        <DialogHeader>
          <DialogTitle>Edit Match</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] pr-4">
          <form onSubmit={handleEditMatch} className="space-y-4 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="teamA">Team A</Label>
                <Select
                  value={currentMatch.team1}
                  onValueChange={(value) =>
                    setCurrentMatch({ ...currentMatch, team1: value })
                  }
                >
                  <SelectTrigger id="teamA">
                    <SelectValue placeholder="Select Team A" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamOptions.map((team) => (
                      <SelectItem key={team._id} value={team._id}>
                        {team.teamName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="teamB">Team B</Label>
                <Select
                  value={currentMatch.team2}
                  onValueChange={(value) =>
                    setCurrentMatch({ ...currentMatch, team2: value })
                  }
                >
                  <SelectTrigger id="teamB">
                    <SelectValue placeholder="Select Team B" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamOptions.map((team) => (
                      <SelectItem key={team._id} value={team._id}>
                        {team.teamName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="datetime-local"
                  value={getTime(currentMatch.time)}
                  onChange={(e) =>
                    setCurrentMatch({ ...currentMatch, time: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isLive"
                  checked={currentMatch.isLive}
                  onCheckedChange={(checked) =>
                    setCurrentMatch({ ...currentMatch, isLive: checked })
                  }
                />
                <Label htmlFor="isLive">Is Live</Label>
              </div>
            </div>
            <div>
              <Label>Channels</Label>
              {currentMatch.channels.map((channel, index) => (
                <div
                  key={index}
                  className="mt-2 space-y-2 rounded-md border p-2"
                >
                  <div className="flex justify-between items-center">
                    <Label>Channel {index + 1}</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeChannel(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Channel Name"
                      value={channel.name}
                      onChange={(e) =>
                        updateChannel(index, "name", e.target.value)
                      }
                    />
                    <Input
                      placeholder="URI"
                      value={channel.uri}
                      onChange={(e) =>
                        updateChannel(index, "uri", e.target.value)
                      }
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="Origin"
                      value={channel.headers.origin}
                      onChange={(e) =>
                        updateChannel(index, "headers.origin", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Referer"
                      value={channel.headers.referer}
                      onChange={(e) =>
                        updateChannel(index, "headers.referer", e.target.value)
                      }
                    />
                    <Input
                      placeholder="User-Agent"
                      value={channel.headers["user-agent"]}
                      onChange={(e) =>
                        updateChannel(
                          index,
                          "headers.user-agent",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                onClick={addChannel}
                className="mt-2"
                variant="outline"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Channel
              </Button>
            </div>
            <Button type="submit">Update Match</Button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
