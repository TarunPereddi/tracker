'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';
import { Alert } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Lock, 
  Trash2, 
  Save, 
  X,
  AlertTriangle,
  Shield
} from 'lucide-react';

interface UserData {
  id: string;
  username: string;
  isAdmin: boolean;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAdminDeleteModal, setShowAdminDeleteModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showRegistrationCodeModal, setShowRegistrationCodeModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [currentRegistrationCode, setCurrentRegistrationCode] = useState('');
  const { success: showSuccess, error: showError } = useToast();

  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Delete confirmation
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteAccountPassword, setDeleteAccountPassword] = useState('');

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/verify');
      const data = await response.json();
      
      if (data.ok) {
        setUser(data.user);
      } else {
        showError('Failed to load user data');
      }
    } catch (error) {
      showError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      setSaving(false);
      return;
    }

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        }),
      });

      const data = await response.json();

      if (data.ok) {
        showSuccess('Password changed successfully!');
        setShowPasswordModal(false);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setError(data.error || 'Failed to change password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteData = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch('/api/user/delete-data', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          confirmPassword: deletePassword
        }),
      });

      const data = await response.json();

      if (data.ok) {
        showSuccess('All your data has been deleted successfully!');
        setShowDeleteModal(false);
        setDeletePassword('');
        // Optionally redirect to login or refresh the page
        window.location.href = '/login';
      } else {
        setError(data.error || 'Failed to delete data');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAdminDeleteAllData = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch('/api/cleanup', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (data.ok) {
        showSuccess('All data has been deleted successfully!');
        setShowAdminDeleteModal(false);
        // Redirect to login
        window.location.href = '/login';
      } else {
        setError(data.error || 'Failed to delete all data');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const fetchCurrentRegistrationCode = async () => {
    try {
      const response = await fetch('/api/admin/registration-code');
      const data = await response.json();
      
      if (data.ok) {
        setCurrentRegistrationCode(data.code);
      } else {
        showError('Failed to load registration code');
      }
    } catch (error) {
      showError('Failed to load registration code');
    }
  };

  const generateNewRegistrationCode = async () => {
    setSaving(true);
    setError('');

    try {
      const response = await fetch('/api/admin/generate-registration-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (data.ok) {
        setCurrentRegistrationCode(data.code);
        showSuccess('New registration code generated successfully!');
      } else {
        setError(data.error || 'Failed to generate new code');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          confirmPassword: deleteAccountPassword
        }),
      });

      const data = await response.json();

      if (data.ok) {
        showSuccess('Your account has been permanently deleted!');
        // Redirect to login page
        window.location.href = '/login';
      } else {
        setError(data.error || 'Failed to delete account');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="space-y-4">
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <User className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account and data</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Account Information
            </CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                value={user?.username || ''}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Username cannot be changed
              </p>
            </div>

            {user?.isAdmin && (
              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-medium text-purple-300">Admin User</span>
                </div>
                <p className="text-xs text-purple-200 mt-1">
                  You have administrative privileges
                </p>
              </div>
            )}

            <div className="pt-4">
              <Button 
                onClick={() => setShowPasswordModal(true)}
                className="w-full"
              >
                <Lock className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Data Management
            </CardTitle>
            <CardDescription>Manage your personal data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-medium text-destructive">Delete All Data</h4>
                  <p className="text-sm text-muted-foreground">
                    This will permanently delete all your transactions, skills, health logs, 
                    job applications, and other data. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            <Button 
              variant="destructive"
              onClick={() => setShowDeleteModal(true)}
              className="w-full"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete All My Data
            </Button>
          </CardContent>
        </Card>

        {/* Account Deletion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Account Deletion
            </CardTitle>
            <CardDescription>Permanently delete your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border border-red-500/20 rounded-lg bg-red-500/5">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-medium text-red-500">Permanently Delete Account</h4>
                  <p className="text-sm text-muted-foreground">
                    This will permanently delete your account and ALL associated data including:
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside ml-4">
                    <li>Your user account</li>
                    <li>All transactions</li>
                    <li>All skill logs</li>
                    <li>All health logs</li>
                    <li>All job applications</li>
                    <li>All routine data</li>
                    <li>All finance setup</li>
                  </ul>
                  <p className="text-sm font-medium text-red-500 mt-2">
                    This action cannot be undone!
                  </p>
                </div>
              </div>
            </div>

            <Button 
              variant="destructive"
              onClick={() => setShowDeleteAccountModal(true)}
              className="w-full"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Delete My Account
            </Button>
          </CardContent>
        </Card>

        {/* Admin Section */}
        {user?.isAdmin && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Registration Management
                </CardTitle>
                <CardDescription>Manage user registration codes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Registration Code</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={currentRegistrationCode}
                      disabled
                      className="bg-muted font-mono"
                    />
                    <Button
                      variant="outline"
                      onClick={fetchCurrentRegistrationCode}
                      disabled={saving}
                    >
                      Load
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Share this code with new users for registration
                  </p>
                </div>

                <Button 
                  onClick={generateNewRegistrationCode}
                  disabled={saving}
                  className="w-full"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  {saving ? 'Generating...' : 'Generate New Code'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Admin Data Management
                </CardTitle>
                <CardDescription>Dangerous admin operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-red-500/20 rounded-lg bg-red-500/5">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div className="space-y-2">
                      <h4 className="font-medium text-red-500">Delete ALL Data</h4>
                      <p className="text-sm text-muted-foreground">
                        This will permanently delete ALL user data from ALL users including:
                      </p>
                      <ul className="text-sm text-muted-foreground list-disc list-inside ml-4">
                        <li>All transactions</li>
                        <li>All skill logs</li>
                        <li>All health logs</li>
                        <li>All job applications</li>
                        <li>All routine data</li>
                        <li>All registration codes</li>
                      </ul>
                      <p className="text-sm text-blue-400 mt-2">
                        Note: User accounts will be preserved
                      </p>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="destructive"
                  onClick={() => setShowAdminDeleteModal(true)}
                  className="w-full"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Delete ALL System Data
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Password Change Modal */}
      <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Change Password</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPasswordModal(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
                minLength={6}
              />
            </div>

            {error && (
              <Alert type="error" title="Error" description={error} />
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Changing...' : 'Change Password'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Delete Data Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-destructive">Delete All Data</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteModal(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-medium text-destructive">Warning: This action is irreversible</h4>
                  <p className="text-sm text-muted-foreground">
                    This will permanently delete all your data including:
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside ml-4">
                    <li>All transactions</li>
                    <li>All skill logs</li>
                    <li>All health logs</li>
                    <li>All job applications</li>
                    <li>All routine data</li>
                    <li>All finance setup</li>
                  </ul>
                </div>
              </div>
            </div>

            <form onSubmit={handleDeleteData} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deletePassword">Enter your password to confirm</Label>
                <Input
                  id="deletePassword"
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Enter your current password"
                  required
                />
              </div>

              {error && (
                <Alert type="error" title="Error" description={error} />
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={saving || !deletePassword}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {saving ? 'Deleting...' : 'Delete All Data'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Modal>

      {/* Admin Delete All Data Modal */}
      <Modal isOpen={showAdminDeleteModal} onClose={() => setShowAdminDeleteModal(false)}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-red-500">Delete ALL System Data</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdminDeleteModal(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="p-4 border border-red-500/20 rounded-lg bg-red-500/5">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-medium text-red-500">WARNING: This action is irreversible</h4>
                  <p className="text-sm text-muted-foreground">
                    This will permanently delete ALL user data from ALL users including:
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside ml-4">
                    <li>All transactions</li>
                    <li>All skill logs</li>
                    <li>All health logs</li>
                    <li>All job applications</li>
                    <li>All routine data</li>
                    <li>All registration codes</li>
                  </ul>
                  <p className="text-sm text-blue-400 mt-2">
                    Note: User accounts will be preserved
                  </p>
                  <p className="text-sm font-medium text-red-500 mt-2">
                    This action cannot be undone!
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleAdminDeleteAllData} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminConfirm">Type "DELETE ALL DATA" to confirm</Label>
                <Input
                  id="adminConfirm"
                  type="text"
                  placeholder="DELETE ALL DATA"
                  required
                />
              </div>

              {error && (
                <Alert type="error" title="Error" description={error} />
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAdminDeleteModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={saving}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  {saving ? 'Deleting...' : 'Delete ALL Data'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal isOpen={showDeleteAccountModal} onClose={() => setShowDeleteAccountModal(false)}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-red-500">Delete Account</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteAccountModal(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="p-4 border border-red-500/20 rounded-lg bg-red-500/5">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-medium text-red-500">WARNING: This action is irreversible</h4>
                  <p className="text-sm text-muted-foreground">
                    This will permanently delete your account and ALL associated data including:
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside ml-4">
                    <li>Your user account</li>
                    <li>All transactions</li>
                    <li>All skill logs</li>
                    <li>All health logs</li>
                    <li>All job applications</li>
                    <li>All routine data</li>
                    <li>All finance setup</li>
                  </ul>
                  <p className="text-sm font-medium text-red-500 mt-2">
                    This action cannot be undone!
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deleteAccountPassword">Enter your password to confirm account deletion</Label>
                <Input
                  id="deleteAccountPassword"
                  type="password"
                  value={deleteAccountPassword}
                  onChange={(e) => setDeleteAccountPassword(e.target.value)}
                  placeholder="Enter your current password"
                  required
                />
              </div>

              {error && (
                <Alert type="error" title="Error" description={error} />
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDeleteAccountModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={saving || !deleteAccountPassword}
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  {saving ? 'Deleting...' : 'Delete Account'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
}
