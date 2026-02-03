import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ResetDataSection } from "@/components/settings/ResetDataSection";
import { User, Bell, CreditCard, Shield, ExternalLink, Save } from "lucide-react";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [saving, setSaving] = useState(false);

  const { profile, loading: profileLoading, refetch } = useProfile(userId);
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
    postcode: "",
    notification_email: true,
    notification_sms: true,
    notification_app: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUserId(session.user.id);
      setAuthChecking(false);
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone: "",
        address: "",
        postcode: "",
        notification_email: true,
        notification_sms: true,
        notification_app: true,
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!userId) return;
    
    setSaving(true);
    
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        address: formData.address,
        postcode: formData.postcode,
        notification_email: formData.notification_email,
        notification_sms: formData.notification_sms,
        notification_app: formData.notification_app,
      })
      .eq("user_id", userId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Settings Saved",
        description: "Your profile has been updated successfully.",
      });
      refetch();
    }
    
    setSaving(false);
  };

  if (authChecking || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-portal-bg">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-eucalyptus border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <PortalLayout>
      <div className="p-4 lg:p-8">
        {/* Header */}
        <motion.div
          className="mb-6 lg:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-serif text-2xl lg:text-3xl font-medium text-foreground mb-1 lg:mb-2">
            Settings
          </h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Manage your account and preferences
          </p>
        </motion.div>

        <div className="max-w-2xl space-y-4 lg:space-y-6">
          {/* Profile Section */}
          <motion.div
            className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-border/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4 lg:mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-eucalyptus-muted flex items-center justify-center">
                <User className="w-4 h-4 lg:w-5 lg:h-5 text-eucalyptus" />
              </div>
              <h3 className="font-medium text-sm lg:text-base text-foreground">Profile Information</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              <div className="space-y-1.5 lg:space-y-2">
                <Label htmlFor="first_name" className="text-xs lg:text-sm">First Name</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData(f => ({ ...f, first_name: e.target.value }))}
                  className="rounded-lg lg:rounded-xl h-10 lg:h-11"
                />
              </div>
              <div className="space-y-1.5 lg:space-y-2">
                <Label htmlFor="last_name" className="text-xs lg:text-sm">Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData(f => ({ ...f, last_name: e.target.value }))}
                  className="rounded-lg lg:rounded-xl h-10 lg:h-11"
                />
              </div>
              <div className="space-y-1.5 lg:space-y-2">
                <Label htmlFor="phone" className="text-xs lg:text-sm">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+44..."
                  className="rounded-lg lg:rounded-xl h-10 lg:h-11"
                />
              </div>
              <div className="space-y-1.5 lg:space-y-2">
                <Label htmlFor="postcode" className="text-xs lg:text-sm">Postcode</Label>
                <Input
                  id="postcode"
                  value={formData.postcode}
                  onChange={(e) => setFormData(f => ({ ...f, postcode: e.target.value }))}
                  className="rounded-lg lg:rounded-xl h-10 lg:h-11"
                />
              </div>
              <div className="sm:col-span-2 space-y-1.5 lg:space-y-2">
                <Label htmlFor="address" className="text-xs lg:text-sm">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(f => ({ ...f, address: e.target.value }))}
                  className="rounded-lg lg:rounded-xl h-10 lg:h-11"
                />
              </div>
            </div>
          </motion.div>

          {/* Notifications Section */}
          <motion.div
            className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-border/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4 lg:mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-eucalyptus-muted flex items-center justify-center">
                <Bell className="w-4 h-4 lg:w-5 lg:h-5 text-eucalyptus" />
              </div>
              <h3 className="font-medium text-sm lg:text-base text-foreground">Notification Preferences</h3>
            </div>

            <div className="space-y-3 lg:space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-xs lg:text-sm">Email Notifications</p>
                  <p className="text-[10px] lg:text-sm text-muted-foreground truncate">Receive updates via email</p>
                </div>
                <Switch
                  checked={formData.notification_email}
                  onCheckedChange={(checked) => setFormData(f => ({ ...f, notification_email: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-xs lg:text-sm">SMS Notifications</p>
                  <p className="text-[10px] lg:text-sm text-muted-foreground truncate">Receive reminders via text</p>
                </div>
                <Switch
                  checked={formData.notification_sms}
                  onCheckedChange={(checked) => setFormData(f => ({ ...f, notification_sms: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-xs lg:text-sm">App Notifications</p>
                  <p className="text-[10px] lg:text-sm text-muted-foreground truncate">Push notifications in the portal</p>
                </div>
                <Switch
                  checked={formData.notification_app}
                  onCheckedChange={(checked) => setFormData(f => ({ ...f, notification_app: checked }))}
                />
              </div>
            </div>
          </motion.div>

          {/* Security Section */}
          <motion.div
            className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-border/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-4 lg:mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-eucalyptus-muted flex items-center justify-center">
                <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-eucalyptus" />
              </div>
              <h3 className="font-medium text-sm lg:text-base text-foreground">Security</h3>
            </div>

            <Button
              variant="outline"
              className="w-full rounded-lg lg:rounded-xl justify-between h-10 lg:h-11 text-xs lg:text-sm"
              onClick={() => {
                toast({
                  title: "Password Reset",
                  description: "A password reset link has been sent to your email.",
                });
              }}
            >
              Change Password
              <ExternalLink className="w-3 h-3 lg:w-4 lg:h-4" />
            </Button>
          </motion.div>

          {/* Billing Section */}
          <motion.div
            className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 shadow-sm border border-border/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-4 lg:mb-6">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-eucalyptus-muted flex items-center justify-center">
                <CreditCard className="w-4 h-4 lg:w-5 lg:h-5 text-eucalyptus" />
              </div>
              <h3 className="font-medium text-sm lg:text-base text-foreground">Billing & Subscription</h3>
            </div>

            <Button
              variant="outline"
              className="w-full rounded-lg lg:rounded-xl justify-between h-10 lg:h-11 text-xs lg:text-sm"
              onClick={() => {
                toast({
                  title: "Billing Portal",
                  description: "Opening billing portal...",
                });
              }}
            >
              Manage Subscription
              <ExternalLink className="w-3 h-3 lg:w-4 lg:h-4" />
            </Button>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-eucalyptus hover:bg-eucalyptus-dark rounded-lg lg:rounded-xl h-11 lg:h-12 text-sm lg:text-base"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </motion.div>

          {/* Danger Zone - Reset Data */}
          {userId && <ResetDataSection userId={userId} />}
        </div>
      </div>
    </PortalLayout>
  );
}
