import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, X } from "lucide-react";

export default function MatchCreationDialog({
  open,
  onOpenChange,
  teamOptions,
  newMatch,
  setNewMatch,
  handleCreateMatch,
}) {
  const addChannel = () => {
    setNewMatch({
      ...newMatch,
      channels: [
        ...newMatch.channels,
        {
          name: "",
          uri: "",
          headers: { origin: "", referer: "", "user-agent": "" },
        },
      ],
    });
  };

  const removeChannel = (index) => {
    const updatedChannels = newMatch.channels.filter((_, i) => i !== index);
    setNewMatch({ ...newMatch, channels: updatedChannels });
  };

  const updateChannel = (index, field, value) => {
    const updatedChannels = newMatch.channels.map((channel, i) => {
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
    setNewMatch({ ...newMatch, channels: updatedChannels });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Match
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[670px]">
        <DialogHeader>
          <DialogTitle>Create New Match</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] pr-4">
          <form onSubmit={handleCreateMatch} className="space-y-4 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="teamA">Team A</Label>
                <Select
                  value={newMatch.teamA}
                  onValueChange={(value) =>
                    setNewMatch({ ...newMatch, teamA: value })
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
                  value={newMatch.teamB}
                  onValueChange={(value) =>
                    setNewMatch({ ...newMatch, teamB: value })
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
                  value={newMatch.time}
                  onChange={(e) =>
                    setNewMatch({ ...newMatch, time: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isLive"
                  checked={newMatch.isLive}
                  onCheckedChange={(checked) =>
                    setNewMatch({ ...newMatch, isLive: checked })
                  }
                />
                <Label htmlFor="isLive">Is Live</Label>
              </div>
            </div>
            <div>
              <Label>Channels</Label>
              {newMatch.channels.map((channel, index) => (
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
            <Button type="submit">Create Match</Button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
