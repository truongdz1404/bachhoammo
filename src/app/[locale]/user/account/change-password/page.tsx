export default function ChangePasswordPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Change Password
        </h1>
        <p className="text-muted-foreground">
          Keep your account secure by updating your password
        </p>
      </div>

      <div className="space-y-4 max-w-md">
        <div className="space-y-2">
          <label className="text-sm font-medium">Current Password</label>
          <input
            type="password"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
            placeholder="Enter current password"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">New Password</label>
          <input
            type="password"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
            placeholder="Enter new password"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Confirm New Password</label>
          <input
            type="password"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
            placeholder="Confirm new password"
          />
        </div>

        <div className="pt-4">
          <button className="bg-primary text-primary-foreground px-8 py-2 rounded-md hover:bg-primary/90 transition-colors">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
