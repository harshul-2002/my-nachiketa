"use client"; 

import React, { useState, useEffect } from "react";

interface Tournament {
  id: string;
  fullName: string;
  minutes: number;
  clock: {
    limit: number;
    increment: number;
  };
  nbPlayers: number;
  variant: {
    name: string;
  };
  startsAt: number;
  finishesAt: number;
  status: number;
}

const OngoingTournamentsPage = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTournaments = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("https://lichess.org/api/tournament");

        if (!res.ok) {
          throw new Error(`Error   in fetching tournaments: ${res.statusText}`);
        }
        const data = await res.json();
        console.log("Full  API Response:", data);
        if (data.started && Array.isArray(data.started) && data.started.length > 0) {
          const ongoingTournaments: Tournament[] = data.started.map((tournament: any) => ({
            id: tournament.id,
            fullName: tournament.fullName,
            minutes: tournament.minutes,
            clock: tournament.clock,
            nbPlayers: tournament.nbPlayers,
            variant: tournament.variant,
            startsAt: tournament.startsAt,
            finishesAt: tournament.finishesAt,
            status: tournament.status,
          }));
          setTournaments(ongoingTournaments);
        } else {
          setError("No  tournaments found");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("  error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  return (
    <div style={{display:'flex',justifySelf:'center',flexDirection:'column', marginTop:'3rem', gap:'0.5rem'}}>
      <h1>Ongoing Tournaments</h1>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <div>
        {tournaments.length > 0 ? (
          <ul style={{display:'flex',justifySelf:'center',flexDirection:'column', marginTop:'3rem', gap:'0.5rem'}}>
            {tournaments.map((tournament) => (
              <li key={tournament.id}>
                <h3>{tournament.fullName}</h3>
                <p>Players: {tournament.nbPlayers}</p>
                <p>Variant: {tournament.variant.name}</p>
                <p>Starts at: {new Date(tournament.startsAt).toLocaleString()}</p>
                <p>Finishes at: {new Date(tournament.finishesAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No ongoing tournaments available.</p>
        )}
      </div>
    </div>
  );
};

export default OngoingTournamentsPage;
