import axios from "axios";
import toast from "react-hot-toast";
import { host } from "@/lib/host";

export const fetchAndStoreLeagues = async (setLoading) => {
  try {
    setLoading(true);
    const response = await axios.get(`${host}/leagues`);
    const data = response.data;
    sessionStorage.setItem("leagues", JSON.stringify(data.data));
  } catch (err) {
    console.log(err);
    toast.error("Error Fetching Leagues");
  } finally {
    setLoading(false);
  }
};

export const getLeaguesFromSessionStorage = () => {
  const storedLeagues = sessionStorage.getItem("leagues");
  return storedLeagues ? JSON.parse(storedLeagues) : null;
};

export const addLeague = (newLegaue) => {
  const storedLeagues = getLeaguesFromSessionStorage();
  const newLeagues = [...storedLeagues, newLegaue];
  sessionStorage.setItem("leagues", JSON.stringify(newLeagues));
};

export const setUpdateLeagueStorage = (newLeague) => {
  const data = getLeaguesFromSessionStorage();
  const updatedLeague = data.map((league) =>
    league._id === newLeague._id ? newLeague : league
  );
  sessionStorage.setItem("leagues", JSON.stringify(updatedLeague));
};

export const deleteLeagueFromStorage = (newLeague) => {
  const data = getLeaguesFromSessionStorage();
  const updatedLeague = data.filter((league) => league._id !== newLeague._id);
  sessionStorage.setItem("leagues", JSON.stringify(updatedLeague));
};
