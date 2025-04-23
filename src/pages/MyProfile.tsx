
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const MyProfile = () => {
  const { currentUser } = useAuth();
  const { athleteProfiles, updateAthleteProfile } = useData();
  const [editPhoto, setEditPhoto] = useState(false);
  const [editLocation, setEditLocation] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [photoUrl, setPhotoUrl] = useState(currentUser?.profileImage || "");
  const [newPassword, setNewPassword] = useState("");
  const [currPassword, setCurrPassword] = useState("");

  if (!currentUser) {
    return <div className="p-8">Not logged in.</div>;
  }

  const athleteProfile = athleteProfiles.find((p) => p.userId === currentUser.id);
  
  // Location defaults
  React.useEffect(() => {
    if (athleteProfile) {
      setCity(athleteProfile.location.city || "");
      setState(athleteProfile.location.state || "");
      // If the user has a profile image, set it
      setPhotoUrl(currentUser.profileImage || "");
    }
  }, [athleteProfile, currentUser.profileImage]);

  // --- Handlers ---

  const handlePhotoSave = () => {
    // In real app you would upload and save
    // For now, just close the editor (simulate)
    setEditPhoto(false);
  };

  const handleLocationSave = async () => {
    if (!athleteProfile) return;
    await updateAthleteProfile(currentUser.id, {
      location: {
        ...athleteProfile.location,
        city,
        state,
      },
    });
    setEditLocation(false);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate password change
    setEditPassword(false);
  };

  // --- UI ---
  return (
    <div className="max-w-2xl mx-auto my-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>Your login and athlete info</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-8">
            <Avatar className="w-16 h-16">
              {photoUrl ? (
                <AvatarImage src={photoUrl} alt={currentUser.name} />
              ) : (
                <AvatarFallback>
                  {currentUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <div className="font-semibold text-lg">{currentUser.name}</div>
              <div className="text-sm text-muted-foreground">{currentUser.email}</div>
              <Button size="sm" variant="secondary" className="mt-2" onClick={() => setEditPhoto((v) => !v)}>
                {editPhoto ? "Cancel" : "Change Photo"}
              </Button>
            </div>
          </div>
          {editPhoto && (
            <form
              className="mb-4"
              onSubmit={e => {
                e.preventDefault();
                handlePhotoSave();
              }}
            >
              <Input
                type="url"
                placeholder="Paste new photo URL"
                value={photoUrl}
                onChange={e => setPhotoUrl(e.target.value)}
              />
              <Button type="submit" className="mt-2">Save</Button>
            </form>
          )}

          <hr className="my-4" />

          <div>
            <div className="font-semibold mb-2">Login Details</div>
            <div className="text-sm">Email: {currentUser.email}</div>
            <div className="text-sm">Account Created: {new Date(currentUser.createdAt).toLocaleDateString()}</div>
            <Button
              size="sm"
              variant="secondary"
              className="mt-2"
              onClick={() => setEditPassword((v) => !v)}
            >
              {editPassword ? "Cancel" : "Change Password"}
            </Button>
            {editPassword && (
              <form className="space-y-2 mt-2" onSubmit={handlePasswordChange}>
                <Input
                  type="password"
                  placeholder="Current Password"
                  value={currPassword}
                  onChange={(e) => setCurrPassword(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <Button type="submit">Save Password</Button>
              </form>
            )}
          </div>

          {athleteProfile && (
            <>
              <hr className="my-4" />
              <div>
                <div className="font-semibold mb-2">Athlete Details</div>
                <div className="text-sm">Handedness: {athleteProfile.handedness}</div>
                <div className="text-sm">Level: {athleteProfile.level}</div>
                <div className="text-sm">Wins: {athleteProfile.wins} | Losses: {athleteProfile.losses}</div>
                <div className="text-sm mb-2">
                  Years Playing: {athleteProfile.yearsPlaying || 0} | Bio: {athleteProfile.bio}
                </div>
                <div className="font-semibold mt-2">Location</div>
                {editLocation ? (
                  <form className="flex flex-col gap-2 mt-2" onSubmit={e => {
                    e.preventDefault();
                    handleLocationSave();
                  }}>
                    <Input
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="City"
                    />
                    <Input
                      value={state}
                      onChange={e => setState(e.target.value)}
                      placeholder="State"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" type="submit">Save</Button>
                      <Button size="sm" variant="secondary" onClick={() => setEditLocation(false)}>Cancel</Button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className="text-sm">
                      {athleteProfile.location.city}, {athleteProfile.location.state}, {athleteProfile.location.country}
                    </div>
                    <Button size="sm" variant="secondary" className="mt-2" onClick={() => setEditLocation(true)}>
                      Change Location
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyProfile;
