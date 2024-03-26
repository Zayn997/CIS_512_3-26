import axios from "axios";
import { rootURL } from "../config/config";

export const allPlayers = async (teamName) => {
  try {
    const response = await axios.get(`${rootURL}/allPlayers`, {
      params: { teamName }, // Make sure the param name matches the backend expectation
    });
    if (response.status !== 200) {
      throw new Error(response.data.message || `Error fetching all players`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching all players:", error.message);
    return { error: error.message };
  }
};

export const allTeams = async () => {
  try {
    const response = await axios.get(`${rootURL}/allTeams`);

    if (response.status !== 200) {
      throw new Error(response.data.message || "Error fetching all teams");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching teams:", error.message);
    return { error: error.message };
  }
};

export const ncaaTeams = async () => {
  try {
    const response = await axios.get(`${rootURL}/ncaa/allTeams`);
    if (response.status !== 200) {
      throw new Error(response.data.message || "Error fetching all teams");
    }
    console.log("response.data", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching teams:", error.message);
    return { error: error.message };
  }
};

export const ncaaPlayers = async (team_full_name) => {
  try {
    const response = await axios.get(`${rootURL}/ncaa/allPlayers`, {
      params: { team_full_name }, // Make sure the param name matches the backend expectation
    });
    if (response.status !== 200) {
      throw new Error(response.data.message || `Error fetching all players`);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching all players:", error.message);
    return { error: error.message };
  }
};

export const PlayersByTeamName = async (teamName, isNBA) => {
  try {
    const response = await axios.get(`${rootURL}/playersByTeamName`, {
      params: { teamName, isNBA: isNBA ? "1" : "0" },
    });
    if (response.status !== 200) {
      throw new Error(
        response.data.message || "Error fetching players by team name"
      );
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching players by team name:", error.message);
    return { error: error.message };
  }
};

export const fetchTeamData = async (teamName) => {
  try {
    const response = await axios.get(`${rootURL}/teamData`, {
      params: { teamName },
    });
    if (response.status !== 200) {
      throw new Error(response.data.message || "Error fetching team data");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching team data:", error.message);
    return { error: error.message };
  }
};

// Fetch top five skills for a player
export const topFive = async (teamName, seasonName, firstName, lastName) => {
  try {
    const response = await axios.get(`${rootURL}/playerTopFive`, {
      params: { teamName, seasonName, firstName, lastName },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching top five skills:", error);
    return { error: error.message };
  }
};

export const teamTopFive = async (teamName, seasonName) => {
  try {
    const response = await axios.get(`${rootURL}/teamTopFive`, {
      params: { teamName, seasonName },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching top five skills:", error);
    return { error: error.message };
  }
};

// Fetch player info
export const playerInfo = async (teamName, firstName, lastName) => {
  try {
    const response = await axios.get(`${rootURL}/playerInfo`, {
      params: { teamName, firstName, lastName },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching player info:", error);
    return { error: error.message };
  }
};

// Fetch all players info
export const allPlayersInfo = async (
  teamName,
  seasonName,
  leagueName,
  schoolName
) => {
  try {
    const response = await axios.get(`${rootURL}/allPlayersInfo`, {
      params: { teamName, seasonName, leagueName, schoolName },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all players info:", error);
    return { error: error.message };
  }
};

// Fetch average skills for a player
export const getAvgSkills = async (
  teamName,
  seasonName,
  firstName,
  lastName
) => {
  try {
    const response = await axios.get(`${rootURL}/playerAvgSkills`, {
      params: { teamName, seasonName, firstName, lastName },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching average skills:", error);
    return { error: error.message };
  }
};

export const getTeamAvgSkills = async (teamName, seasonName) => {
  try {
    const response = await axios.get(`${rootURL}/teamAvgSkills`, {
      params: { teamName, seasonName },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching average skills:", error);
    return { error: error.message };
  }
};

export const ncaaplayeravgskills = async (
  team_full_name,
  firstName,
  lastName
) => {
  try {
    const response = await axios.get(`${rootURL}/ncaa/playerAvgSkills`, {
      params: { team_full_name, firstName, lastName },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching average skills:", error);
    return { error: error.message };
  }
};

export const ncaaTopFive = async (team_full_name) => {
  try {
    const response = await axios.get(`${rootURL}/ncaa/topFive`, {
      params: { team_full_name },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching top five skills:", error);
    return { error: error.message };
  }
};

export const ncaaAllPlayers = async (team_full_name) => {
  try {
    const response = await axios.get(`${rootURL}/ncaa/allPlayers`, {
      params: { team_full_name },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all NCAA players:", error);
    return { error: error.message };
  }
};

export const ncaaPlayerInfo = async (team_full_name) => {
  try {
    const response = await axios.get(`${rootURL}/ncaa/allPlayers`, {
      params: { team_full_name },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all NCAA players information:", error);
    return { error: error.message };
  }
};

export const ncaaPlayerTopFive = async (
  team_full_name,
  firstName,
  lastName
) => {
  try {
    const response = await axios.get(`${rootURL}/ncaa/ncaaPlayerTopFive`, {
      params: { team_full_name, firstName, lastName },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching top five skills:", error);
    return { error: error.message };
  }
};

export const nbaCalculateRatings = async (
  firstName,
  lastName,
  season,
  league
) => {
  try {
    const response = await axios.get(`${rootURL}/nba/calculate_rating`, {
      params: { firstName, lastName, season, league },
    });
    return response.data;
  } catch (error) {
    console.error("Error calculating ratings:", error);
    return { error: error.message };
  }
};

export const ncaaCalculateRatings = async (
  firstName,
  lastName,
  season,
  league
) => {
  try {
    const response = await axios.get(`${rootURL}/ncaa/calculate_rating`, {
      params: { firstName, lastName, season, league },
    });
    return response.data;
  } catch (error) {
    console.error("Error calculating ratings:", error);
    return { error: error.message };
  }
};
