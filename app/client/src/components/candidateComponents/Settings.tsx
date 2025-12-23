import { User, Bell, Shield, Palette } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getUser,
  getCandidateProfile,
  updateCandidateProfile,
  type CandidateProfileResponse,
} from "@/api/users";

export default function Settings() {
  const userId = Number(localStorage.getItem("user_id"));

  const [loaded, setLoaded] = useState(false);

  // Candidate Profile States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [summary, setSummary] = useState("");

  // Fake notification UI (unchanged from your template)
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    jobMatches: true,
    messages: true,
  });

  // ======================================================
  // LOAD CANDIDATE PROFILE
  // ======================================================
  useEffect(() => {
    async function load() {
      const user = await getUser(userId);
      if (user.role !== "candidate") {
        console.error("User is not a candidate!");
        return;
      }

      setEmail(user.email);

      const profile: CandidateProfileResponse = await getCandidateProfile(userId);
      setFullName(profile.full_name ?? "");
      setLocation(profile.location ?? "");
      setExperience(profile.experience_years ?? "");
      setSummary(profile.summary ?? "");

      setLoaded(true);
    }

    load();
  }, [userId]);

  // ======================================================
  // SAVE PROFILE
  // ======================================================
  async function handleSave() {
    await updateCandidateProfile(userId, {
      full_name: fullName,
      location,
      experience,
      skills: null, // vì Settings không chỉnh
      bio: summary,
    });

    alert("Profile updated successfully!");
  }

  if (!loaded)
    return <div className="p-6 text-muted-foreground">Loading profile…</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2>Settings</h2>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3>Profile Settings</h3>
              <p className="text-muted-foreground text-sm">
                Update your personal information
              </p>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm mb-2 block">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 bg-input-background rounded-xl border border-transparent focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm mb-2 block">Email Address</label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full px-4 py-2.5 bg-input-background rounded-xl border border-transparent opacity-60 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-sm mb-2 block">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 bg-input-background rounded-xl border border-transparent focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm mb-2 block">Experience (Years)</label>
              <input
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Example: 1, 2, 3..."
                className="w-full px-4 py-2.5 bg-input-background rounded-xl border border-transparent focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm mb-2 block">Short Bio</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-4 py-2.5 min-h-28 bg-input-background rounded-xl border border-transparent focus:border-primary focus:outline-none"
              />
            </div>

            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Notification Settings (unchanged) */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3>Notification Preferences</h3>
              <p className="text-muted-foreground text-sm">
                Choose how you want to be notified
              </p>
            </div>
          </div>

          {/* giữ nguyên UI switch */}
          <div className="p-6 space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div className="flex items-center justify-between" key={key}>
                <div>
                  <p>{key}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        [key]: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 peer-checked:bg-primary transition-all"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3>Privacy & Security</h3>
              <p className="text-muted-foreground text-sm">Manage your privacy settings</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <button className="w-full px-4 py-3 text-left hover:bg-muted rounded-xl transition-colors">
              Change Password
            </button>
            <button className="w-full px-4 py-3 text-left hover:bg-muted rounded-xl transition-colors">
              Two-Factor Authentication
            </button>
            <button className="w-full px-4 py-3 text-left hover:bg-muted rounded-xl transition-colors">
              Connected Accounts
            </button>
            <button className="w-full px-4 py-3 text-left hover:bg-muted rounded-xl transition-colors">
              Privacy Policy
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Palette className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3>Preferences</h3>
              <p className="text-muted-foreground text-sm">Customize your experience</p>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm mb-2 block">Language</label>
              <select className="w-full px-4 py-2.5 bg-input-background rounded-xl border border-transparent focus:border-primary focus:outline-none">
                <option>English (US)</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
            <div>
              <label className="text-sm mb-2 block">Time Zone</label>
              <select className="w-full px-4 py-2.5 bg-input-background rounded-xl border border-transparent focus:border-primary focus:outline-none">
                <option>Pacific Time (PT)</option>
                <option>Eastern Time (ET)</option>
                <option>Central Time (CT)</option>
                <option>Mountain Time (MT)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
