"use client";

import React, { useState } from "react";

interface UserProfile {
  id: string;
  username: string;
  bio?: string;
  count?: {
    all: number;
  };
  perfs?: {
    blitz?: { rating: number };
    bullet?: { rating: number };
    rapid?: { rating: number };
    classical?: { rating: number };
  };
  profile?: {
    country?: string;
    bio?: string;
    firstName?: string;
    lastName?: string;
    location?: string;
    image?: string;
  };
}

function UserProfilePage() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setUserData(null);

    try {
      const res = await fetch(`https://lichess.org/api/user/${username}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        setError("User not found");
        return;
      }

      const data: UserProfile = await res.json();
      setUserData(data);
    } catch (error) {
      setError("Failed to fetch user data");
    }
  };

  return (
    <div style={{display:'flex',justifySelf:'center',flexDirection:'column', marginTop:'3rem', gap:'0.5rem'}}>
      <h2 >enter id</h2>
      <form onSubmit={fetchUserData}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter Username"
          required
          style={{margin:'0.5rem',  border:'0', padding:'0.5rem'}}
        />
        <button style={{margin:'0.5rem', backgroundColor:'red', border:'0', padding:'0.5rem'}} type="submit">Fetch User Data</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {userData && (
        <div style={{gap:'0.5rem'}}>
          <h2>{userData.username}</h2>
          <p>
            <strong>Bio:</strong> {userData.bio || "bio is not avaiabe"}
          </p>
          <p>
            <strong>Total Games Played:</strong>{" "}
            {userData.count?.all ?? "Data not available"}
          </p>

          <h3>Ratings</h3>
          <ul>
            {userData.perfs?.blitz && (
              <li>Blitz: {userData.perfs.blitz.rating}</li>
            )}
            {userData.perfs?.bullet && (
              <li>Bullet: {userData.perfs.bullet.rating}</li>
            )}
            {userData.perfs?.rapid && (
              <li>Rapid: {userData.perfs.rapid.rating}</li>
            )}
            {userData.perfs?.classical && (
              <li>Classical: {userData.perfs.classical.rating}</li>
            )}
          </ul>

          {userData.profile?.image && (
            <div >
              <h3>Profile Image</h3>
              <img
                src={userData.profile.image}
                alt={`${userData.username}'s profile`}
                width="200"
                height="200"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UserProfilePage;
