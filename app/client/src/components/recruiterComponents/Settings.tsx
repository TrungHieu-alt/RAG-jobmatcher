import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { Bell, Lock, User, Globe } from "lucide-react";
import { useEffect, useState } from "react";

import {
  getUser,
  getRecruiterProfile,
  updateRecruiterProfile,
  type RecruiterProfileResponse,
} from "@/api/users";

export function Settings() {
  const userId = Number(localStorage.getItem("user_id"));

  const [loaded, setLoaded] = useState(false);

  // Recruiter profile state
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [title, setTitle] = useState("");
  const [aboutCompany, setAboutCompany] = useState("");
  const [hiringFields, setHiringFields] = useState<string[]>([]);

  // ======================================================
  // LOAD RECRUITER PROFILE
  // ======================================================
  useEffect(() => {
    async function load() {
      const user = await getUser(userId);
      if (user.role !== "recruiter") {
        console.error("Not recruiter");
        return;
      }

      const profile: RecruiterProfileResponse = await getRecruiterProfile(userId);
      setCompanyName(profile.company_name ?? "");
      setTitle(profile.recruiter_title ?? "");
      setAboutCompany(profile.about_company ?? "");
      setHiringFields(profile.hiring_fields ?? []);

      // Map the first hiring field to UI input
      setIndustry(profile.hiring_fields?.[0] ?? "");

      setLoaded(true);
    }

    load();
  }, [userId]);

  // ======================================================
  // SAVE PROFILE
  // ======================================================
  async function handleSave() {
    await updateRecruiterProfile(userId, {
      companyName,
      title,
      companyDescription: aboutCompany,
      hiringIndustry: industry ? [industry] : [],
    });

    alert("Profile updated!");
  }

  if (!loaded)
    return <div className="p-6 text-muted-foreground">Loading recruiter profile...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2>Settings</h2>
        <p className="text-muted-foreground">Manage your account preferences and configurations</p>
      </div>

      {/* Company Profile */}
      <Card className="rounded-2xl border-border shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>Company Profile</CardTitle>
              <CardDescription>Update your company information</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="bg-input-background border-border rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Industry</Label>
              <Input
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="bg-input-background border-border rounded-xl"
              />
            </div>

          </div>

          <div className="space-y-2">
            <Label>Recruiter Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-input-background border-border rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label>About Company</Label>
            <textarea
              value={aboutCompany}
              onChange={(e) => setAboutCompany(e.target.value)}
              className="w-full min-h-28 px-4 py-3 bg-input-background rounded-xl border-border"
            />
          </div>

          <Button
            onClick={handleSave}
            className="bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl"
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Notifications (nguyên bản UI của mày) */}
      <Card className="rounded-2xl border-border shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure how you receive updates</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div>New Candidate Matches</div>
              <div className="text-sm text-muted-foreground">Get notified when new candidates match your jobs</div>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <div>Message Replies</div>
              <div className="text-sm text-muted-foreground">Receive alerts when candidates respond</div>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <div>Weekly Reports</div>
              <div className="text-sm text-muted-foreground">Get a summary of your recruitment activity</div>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card className="rounded-2xl border-border shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-red-400 to-red-600 flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>Privacy & Security</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="rounded-xl border-border">
            Change Password
          </Button>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <div>Two-Factor Authentication</div>
              <div className="text-sm text-muted-foreground">Add an extra layer of security</div>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
