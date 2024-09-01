"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { host } from "@/lib/host";
import Sidebar from "@/components/Sidebar";
import toast from "react-hot-toast";

export default function AdConfigPage() {
  const [config, setConfig] = useState({
    channelScreenAd: false,
    matchScreenAd: false,
    appOpenAd: false,
    matchBannerAd: false,
    channelBannerAd: false,
    videoScreenAd: false,
    videoPlayerAd: false,
    videoPlayerAdTime: 10,
    redirectApp: false,
    redirectLink: "",
    redirectMessage: "Cannot Fetch AppConfig",
    rateMessage: false,
    appUrl: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [newButton, setNewButton] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${host}/appconfig`);
        if (!response.ok) throw new Error("Failed to fetch config");
        const data = await response.json();
        if (data.message) {
          setNewButton(true);
        } else {
          setConfig(data.data);
        }
      } catch (error) {
        toast.error("Cannot Fetch AppConfig");
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggle = (name) => {
    setConfig((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${host}/appconfig`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json", // Specify the content type as JSON
        },
        body: JSON.stringify(config),
      });
      if (!response.ok) throw new Error("Failed to update config");
      toast.success("appConfig Updated Sucessfully");
    } catch (error) {
      toast.error("Cannot Update Configuration");
    } finally {
      setIsLoading(false);
    }
  };

  const createAdConfig = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${host}/appconfig`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify the content type as JSON
        },
        body: JSON.stringify(config),
      });
      if (!response.ok) throw new Error("Failed to update config");
      toast.success("Configuration Created ");
      setNewButton(false);
    } catch (error) {
      toast.error("Error in Creating App Configuration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      {newButton ? (
        <div className="flex flex-1 min-h-screen justify-center align-center flex-col gap-10 container mx-auto text-center">
          <h1 className="text-4xl font-bold">Create Ad Configuration.</h1>
          <Button
            onClick={createAdConfig}
            disabled={isLoading}
            className={"mx-auto"}
          >
            {isLoading ? "Creating..." : "Create Configuration"}
          </Button>
        </div>
      ) : (
        <Card className="w-full max-w-2xl mx-auto my-8">
          <CardHeader>
            <CardTitle>Ad Configuration</CardTitle>
            <CardDescription>Manage your ad settings here</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  "channelScreenAd",
                  "matchScreenAd",
                  "appOpenAd",
                  "matchBannerAd",
                  "channelBannerAd",
                  "videoScreenAd",
                  "videoPlayerAd",
                ].map((item) => (
                  <div key={item} className="flex items-center justify-between">
                    <Label htmlFor={item}>{item}</Label>
                    <Switch
                      id={item}
                      checked={config[item]}
                      onCheckedChange={() => handleToggle(item)}
                    />
                  </div>
                ))}
              </div>

              <div>
                <Label htmlFor="videoPlayerAdTime">
                  Video Player Ad Time (seconds)
                </Label>
                <Input
                  id="videoPlayerAdTime"
                  name="videoPlayerAdTime"
                  type="number"
                  value={config.videoPlayerAdTime}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="redirectApp">Redirect App</Label>
                <Switch
                  id="redirectApp"
                  checked={config.redirectApp}
                  onCheckedChange={() => handleToggle("redirectApp")}
                />
              </div>

              <div>
                <Label htmlFor="redirectLink">Redirect Link</Label>
                <Input
                  id="redirectLink"
                  name="redirectLink"
                  value={config.redirectLink}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="redirectMessage">Redirect Message</Label>
                <Input
                  id="redirectMessage"
                  name="redirectMessage"
                  value={config.redirectMessage}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="rateMessage">Rate Message</Label>
                <Switch
                  id="rateMessage"
                  checked={config.rateMessage}
                  onCheckedChange={() => handleToggle("rateMessage")}
                />
              </div>

              <div>
                <Label htmlFor="appUrl">App URL</Label>
                <Input
                  id="appUrl"
                  name="appUrl"
                  value={config.appUrl}
                  onChange={handleChange}
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Configuration"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
