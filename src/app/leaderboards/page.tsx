"use client";

import React, { useState, useEffect } from "react";

interface TopPlayer {
  id: string;
  username: string;
  title: string;
  rating: number;
  online: boolean;
}

const LeaderboardsPage = () => {
  const [topPlayers, setTopPlayers] = useState<TopPlayer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopPlayers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("https://lichess.org/api/player");
        if (!res.ok) {
          throw new Error(`Error fetching top player: ${res.statusText}`);
        }
        const data = await res.json();
        console.log("API Response:", data);
        const bulletPlayers = data.bullet;
        if (Array.isArray(bulletPlayers) && bulletPlayers.length > 0) {
          const players: TopPlayer[] = bulletPlayers.map((player: any) => ({
            id: player.id,
            username: player.username,
            title: player.title,
            rating: player.perfs.bullet.rating,
            online: player.online,
          }));
          setTopPlayers(players);
        } else {
          setError("No bullet players found");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTopPlayers();
  }, []);

  return (
    <div style={{display:'flex',justifySelf:'center',flexDirection:'column', marginTop:'3rem', gap:'0.5rem'}}>
      <h1>Top Bullet Player Leaderboard</h1>
      {loading && <p>Loading.</p>}
      {error && <p>Error: {error}</p>}
      <div>
        {topPlayers.length > 0 ? (
          <ul>
            {topPlayers.map((player) => (
              <li key={player.id}>
                <h3>
                  {player.username} ({player.title})
                </h3>
                <p>Rating: {player.rating}</p>
                <p>{player.online ? "Online" : "Offline"}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No  players available</p>
        )}
      </div>
    </div>
  );
};
export default LeaderboardsPage;
