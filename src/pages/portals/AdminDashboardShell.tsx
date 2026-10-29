import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Modal } from '../../components/common/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  Users,
  Lock,
  Ban,
  FileText,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  UserCheck,
  TrendingUp,
  GraduationCap,
  Award
} from 'lucide-react';
import { UserRole, AuditLogEntry, UserProfile, UserCustomClaims } from '../../types/auth';
import { getUserAdminService, getAuditService } from '../../services/auth';
import { AdminAccountRequestsTab } from '../../components/admin/AdminAccountRequestsTab';
import { AdminAnalyticsDashboard } from '../../components/admin/AdminAnalyticsDashboard';
import { AdmissionApplicationsManagementTab } from '../../components/admin/AdmissionApplicationsManagementTab';
import { AdminIqacEvaluations } from '../../components/evaluation/AdminIqacEvaluations';
import { AdminScholarshipsTab } from '../../components/admin/AdminScholarshipsTab';
import { SharedDataStoreManager } from '../../services/shared/sharedDataStore';

export const AdminDashboardShell: React.FC = () => {
  const { user, claims, role } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const isSuperAdmin = role === 'super_admin';

  // Navigation tab state: 'analytics' | 'evaluations' | 'scholarships' | 'admissions' | 'requests' | 'users' | 'audit'
  const [activeTab, setActiveTab] = useState<'analytics' | 'evaluations' | 'scholarships' | 'admissions' | 'requests' | 'users' | 'audit'>('analytics');
  const pendingRequestsCount = (SharedDataStoreManager.getInstance().getStore().accountRequests || []).filter(
    (r) => r.status === 'PENDING'
  ).length;

  // State for user provisioning
  const [provisionModalOpen, setProvisionModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [assignedRole, setAssignedRole] = useState<UserRole>('teacher');
  const [departmentId, setDepartmentId] = useState('CSE');
  const [studentId, setStudentId] = useState('');
  const [provisionMessage, setProvisionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isProvisioning, setIsProvisioning] = useState(false);

  // State for user list management
  const [usersList, setUsersList] = useState<{ profile: UserProfile; claims: UserCustomClaims }[]>([]);
  const [userActionMessage, setUserActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedUserForRoleChange, setSelectedUserForRoleChange] = useState<{ profile: UserProfile; claims: UserCustomClaims } | null>(null);
  const [selectedNewRole, setSelectedNewRole] = useState<UserRole>('teacher');
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  // State for audit logs
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  const loadAllUsers = async () => {
    if (!claims || !user) return;
    try {
      const userAdminService = await getUserAdminService();
      const list = await userAdminService.getAllUsers();
      setUsersList(list);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAllUsers();
  }, [user, claims]);

  // Load audit logs if super_admin
  const loadLogs = async () => {
    if (!isSuperAdmin) {
      setAuditError('Audit logs may only be accessed by super_admin via Cloud Function.');
      return;
    }

    setIsLoadingLogs(true);
    setAuditError(null);
    try {
      if (claims && user) {
        const auditService = await getAuditService();
        const logs = await auditService.getAuditLogs();
        setAuditLogs(logs);
      }
    } catch (err) {
      setAuditError(err instanceof Error ? err.message : 'Failed to retrieve audit logs');
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      loadLogs();
    }
  }, [isSuperAdmin]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setProvisionMessage(null);
    setIsProvisioning(true);

    try {
      if (!claims || !user) throw new Error('Unauthenticated');

      const userAdminService = await getUserAdminService();
      const res = await userAdminService.createUserAccount({
        email: email.trim(),
        fullName: fullName.trim(),
        role: assignedRole,
        departmentId: assignedRole === 'student' || assignedRole === 'teacher' || assignedRole === 'dept_chairman' ? departmentId : undefined,
        studentId: assignedRole === 'student' ? studentId.trim() : undefined
      });

      setProvisionMessage({ type: 'success', text: res.message });
      setEmail('');
      setFullName('');
      setStudentId('');
      await loadAllUsers();
      if (isSuperAdmin) loadLogs();
    } catch (err) {
      setProvisionMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Provisioning failed.'
      });
    } finally {
      setIsProvisioning(false);
    }
  };

  const handleRoleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForRoleChange || !user || !claims) return;
    setIsUpdatingRole(true);
    setUserActionMessage(null);
    try {
      const userAdminService = await getUserAdminService();
      const res = await userAdminService.setUserRole(selectedUserForRoleChange.profile.uid, selectedNewRole);
      setUserActionMessage({ type: 'success', text: res.message });
      setSelectedUserForRoleChange(null);
      await loadAllUsers();
      if (isSuperAdmin) loadLogs();
    } catch (err) {
      setUserActionMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Role change failed.'
      });
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const handleToggleUserStatus = async (targetUid: string, currentDisabled: boolean) => {
    if (!user || !claims) return;
    setUserActionMessage(null);
    try {
      const userAdminService = await getUserAdminService();
      if (currentDisabled) {
        await userAdminService.enableUser(targetUid);
        setUserActionMessage({ type: 'success', text: `Account for ${targetUid} re-enabled.` });
      } else {
        await userAdminService.disableUser(targetUid, 'Administrative suspension from console');
        setUserActionMessage({ type: 'success', text: `Account for ${targetUid} disabled and tokens revoked.` });
      }
      await loadAllUsers();
      if (isSuperAdmin) loadLogs();
    } catch (err) {
      setUserActionMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to update account status.'
      });
    }
  };

  return (
    <DashboardLayout portalTitle={isSuperAdmin ? 'Super Admin Console' : 'Administrator Console'}>
      <div className="space-y-6">
        {/* Banner */}
        <div className="p-6 bg-gradient-to-r from-[#07192C] to-[#0A2540] text-white rounded-2xl shadow-sm space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                Central Identity Authority &bull; {role?.toUpperCase()}
              </span>
              <h1 className="text-2xl font-bold mt-1">
                {isBn ? `প্রশাসনিক কনসোল: ${user?.displayName}` : `System Console: ${user?.displayName}`}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/admin/content">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500"
                  leftIcon={<FileText className="w-4 h-4" />}
                >
                  {isBn ? 'ওয়েবসাইট কন্টেন্ট ম্যানেজমেন্ট' : 'Website CMS Editor'}
                </Button>
              </Link>
              <Button
                variant="primary"
                size="sm"
                className="bg-blue-600 hover:bg-blue-500"
                onClick={() => setProvisionModalOpen(true)}
                leftIcon={<UserPlus className="w-4 h-4" />}
              >
                {isBn ? 'নতুন একাউন্ট খুলুন' : 'Provision User Account'}
              </Button>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            {isBn
              ? 'জেএসটিইউ আইডেন্টিটি ও রোল-বেসড অ্যাক্সেস কন্ট্রোল (ফেজ ২: ক্লাউড ফাংশন ও কাস্টম ক্লেইমস সক্রিয়)।'
              : 'JSTU RBAC Engine: Roles set only via Cloud Functions. users/{uid} is never trusted for authorization.'}
          </p>
        </div>

        {/* Security Metric Placeholders */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card padding="md" className="space-y-1">
            <span className="text-xs text-slate-500 font-medium">Provisioned Accounts</span>
            <div className="text-2xl font-extrabold text-[#0A2540] dark:text-white tabular-nums">9</div>
            <p className="text-[11px] text-slate-400">1 per Institutional Role</p>
          </Card>

          <Card padding="md" className="space-y-1">
            <span className="text-xs text-slate-500 font-medium">MFA Compliance Rate</span>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">100%</div>
            <p className="text-[11px] text-slate-400">Mandatory for all 8 Staff Roles</p>
          </Card>

          <Card padding="md" className="space-y-1">
            <span className="text-xs text-slate-500 font-medium">Brute Force Defenses</span>
            <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">Active</div>
            <p className="text-[11px] text-slate-400">App Check + Throttling</p>
          </Card>

          <Card padding="md" className="space-y-1">
            <span className="text-xs text-slate-500 font-medium">Idle Timeout Policy</span>
            <div className="text-2xl font-extrabold text-slate-700 dark:text-slate-300 tabular-nums">30 Min</div>
            <p className="text-[11px] text-slate-400">5 Min Grace Warning</p>
          </Card>
        </div>

        {/* Global Feedback Alert */}
        {userActionMessage && (
          <div
            className={`p-3 rounded-xl flex items-center justify-between gap-2 text-xs ${
              userActionMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-900'
            }`}
          >
            <div className="flex items-center gap-2">
              {userActionMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              )}
              <span>{userActionMessage.text}</span>
            </div>
            <button
              onClick={() => setUserActionMessage(null)}
              className="text-slate-400 hover:text-slate-600 font-bold"
            >
              &times;
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1 pt-1">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition flex items-center gap-2 border-b-2 ${
              activeTab === 'analytics'
                ? 'border-blue-600 text-blue-600 bg-white dark:bg-slate-900 shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>{isBn ? 'অ্যানালিটিক্স ড্যাশবোর্ড' : 'Analytics Dashboard'}</span>
          </button>

          <button
            onClick={() => setActiveTab('evaluations')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition flex items-center gap-2 border-b-2 ${
              activeTab === 'evaluations'
                ? 'border-blue-600 text-blue-600 bg-white dark:bg-slate-900 shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>{isBn ? 'আইকিউএসি কোর্স মূল্যায়ন' : 'IQAC Evaluations'}</span>
          </button>

          <button
            onClick={() => setActiveTab('scholarships')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition flex items-center gap-2 border-b-2 ${
              activeTab === 'scholarships'
                ? 'border-blue-600 text-blue-600 bg-white dark:bg-slate-900 shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>{isBn ? 'বৃত্তি ও অনুদান' : 'Scholarships & Grants'}</span>
          </button>

          <button
            onClick={() => setActiveTab('admissions')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition flex items-center gap-2 border-b-2 ${
              activeTab === 'admissions'
                ? 'border-blue-600 text-blue-600 bg-white dark:bg-slate-900 shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>{isBn ? 'ভর্তি আবেদন রেজিস্ট্রি' : 'Admission Applications'}</span>
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition flex items-center gap-2 border-b-2 ${
              activeTab === 'requests'
                ? 'border-blue-600 text-blue-600 bg-white dark:bg-slate-900 shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>{isBn ? 'অ্যাকাউন্ট আবেদন' : 'Account Requests'}</span>
            {pendingRequestsCount > 0 && (
              <span className="px-1.5 py-0.5 bg-amber-500 text-white rounded-full text-[10px] font-bold">
                {pendingRequestsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition flex items-center gap-2 border-b-2 ${
              activeTab === 'users'
                ? 'border-blue-600 text-blue-600 bg-white dark:bg-slate-900 shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{isBn ? 'ব্যবহারকারী ও ক্লেইমস' : 'User Accounts & Claims'}</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition flex items-center gap-2 border-b-2 ${
              activeTab === 'audit'
                ? 'border-blue-600 text-blue-600 bg-white dark:bg-slate-900 shadow-sm'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{isBn ? 'অডিট লগ' : 'Audit Trail'}</span>
          </button>
        </div>

        {/* Tab 0: Analytics Dashboard */}
        {activeTab === 'analytics' && (
          <AdminAnalyticsDashboard
            departmentScoped={false}
            onNavigateToRequests={() => setActiveTab('requests')}
            onNavigateToApplications={() => setActiveTab('requests')}
          />
        )}

        {/* Tab: IQAC Teaching & Course Evaluations */}
        {activeTab === 'evaluations' && (
          <AdminIqacEvaluations />
        )}

        {/* Tab: Admission Applications */}
        {activeTab === 'admissions' && (
          <AdmissionApplicationsManagementTab
            reviewerRole={role === 'super_admin' ? 'super_admin' : 'admin'}
            reviewerDisplayName={user?.displayName || 'University Central Admin'}
          />
        )}

        {/* Tab: Scholarships & Grants Management */}
        {activeTab === 'scholarships' && (
          <AdminScholarshipsTab
            onNotification={(msg) => setUserActionMessage(msg)}
          />
        )}

        {/* Tab 1: Account Requests */}
        {activeTab === 'requests' && (
          <AdminAccountRequestsTab
            actorUid={user?.uid || 'admin_caller'}
            actorRole={role || 'admin'}
            actorDisplayName={user?.displayName || undefined}
            onAccountApproved={async () => {
              await loadAllUsers();
              if (isSuperAdmin) await loadLogs();
            }}
            onNotification={(msg) => setUserActionMessage(msg)}
          />
        )}

        {/* Tab 2: User Accounts & Custom Claims Management Table */}
        {activeTab === 'users' && (
        <Card padding="md" className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Institutional User Accounts & Custom Claims</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Roles set only via Cloud Functions (<code>createUserAccount</code>, <code>setUserRole</code>, <code>disableUser</code>). Hierarchy enforced server-side.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadAllUsers}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Refresh Accounts
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-3">Full Name & Email</th>
                  <th className="py-2.5 px-3">Role Custom Claim</th>
                  <th className="py-2.5 px-3">Dept / ID</th>
                  <th className="py-2.5 px-3">Staff MFA</th>
                  <th className="py-2.5 px-3">Account Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {usersList.map(({ profile, claims: itemClaims }) => {
                  const isTargetSuperAdmin = itemClaims.role === 'super_admin';
                  const isTargetAdmin = itemClaims.role === 'admin';
                  const isDisabled = !!itemClaims.disabled;

                  return (
                    <tr key={profile.uid} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2 px-3">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{profile.fullName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{profile.email}</div>
                      </td>
                      <td className="py-2 px-3">
                        <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-mono text-[10px] uppercase font-bold rounded">
                          {itemClaims.role}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                        {itemClaims.studentId || itemClaims.departmentId || '-'}
                      </td>
                      <td className="py-2 px-3">
                        {itemClaims.mfaEnforced ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                            <ShieldCheck className="w-3.5 h-3.5" /> Enforced
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">Optional</span>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        {isDisabled ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 rounded font-semibold text-[10px]">
                            <Ban className="w-3 h-3" /> Disabled
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded font-semibold text-[10px]">
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-right space-x-1.5">
                        {/* Change Role Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-[11px] px-2"
                          onClick={() => {
                            setSelectedUserForRoleChange({ profile, claims: itemClaims });
                            setSelectedNewRole(itemClaims.role);
                          }}
                        >
                          Change Role
                        </Button>

                        {/* Disable/Enable Button */}
                        {profile.uid !== user?.uid && (
                          <Button
                            variant={isDisabled ? 'outline' : 'ghost'}
                            size="sm"
                            className={`h-7 text-[11px] px-2 ${isDisabled ? 'text-emerald-600 border-emerald-300' : 'text-red-600'}`}
                            onClick={() => handleToggleUserStatus(profile.uid, isDisabled)}
                          >
                            {isDisabled ? 'Re-enable' : 'Disable'}
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
        )}

        {/* Tab 3: Audit Logs Trail (Strictly Super Admin Only) */}
        {activeTab === 'audit' && (
        <Card padding="md" className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Append-Only Immutable Audit Log Trail</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Written strictly by Cloud Functions. Direct client read/write denied by Firestore rules.
              </p>
            </div>

            {isSuperAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={loadLogs}
                isLoading={isLoadingLogs}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Refresh Log
              </Button>
            )}
          </div>

          {!isSuperAdmin ? (
            <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-2">
              <Lock className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                Audit Trail Restricted to Super Admin
              </p>
              <p className="max-w-md mx-auto">
                In compliance with security rules, standard administrators cannot inspect forensic audit records.
              </p>
            </div>
          ) : auditLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Action</th>
                    <th className="py-2.5 px-3">Actor UID</th>
                    <th className="py-2.5 px-3">Target</th>
                    <th className="py-2.5 px-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 tabular-nums">
                  {auditLogs.slice(0, 10).map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 font-mono text-[11px]">
                      <td className="py-2 px-3 text-slate-500 whitespace-nowrap">{new Date(log.timestamp).toLocaleTimeString()}</td>
                      <td className="py-2 px-3 font-semibold text-blue-700 dark:text-blue-400">{log.action}</td>
                      <td className="py-2 px-3 text-slate-600 dark:text-slate-300 truncate max-w-[120px]">{log.actorUid}</td>
                      <td className="py-2 px-3 text-slate-600 dark:text-slate-300 truncate max-w-[140px]">{log.targetEmail || log.targetUid || '-'}</td>
                      <td className="py-2 px-3 text-slate-500 truncate max-w-[200px]">{JSON.stringify(log.details || {})}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-4 text-center">No audit records logged yet in this session.</p>
          )}
        </Card>
        )}
      </div>

      {/* User Provisioning Modal */}
      <Modal
        isOpen={provisionModalOpen}
        onClose={() => setProvisionModalOpen(false)}
        title={isBn ? 'নতুন প্রাতিষ্ঠানিক ব্যবহারকারী সৃষ্টি' : 'Provision User Account'}
        description="Creates Firebase Auth user, sets verified custom claims, creates minimal users/{uid}, and writes audit trail."
      >
        <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
          {provisionMessage && (
            <div
              className={`p-3 rounded-lg flex items-start gap-2 ${
                provisionMessage.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200'
                  : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-200'
              }`}
            >
              {provisionMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span>{provisionMessage.text}</span>
            </div>
          )}

          <Input
            label="Full Name"
            required
            placeholder="e.g. Dr. Mahmudur Rahman"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <Input
            label="Institutional Email"
            type="email"
            required
            placeholder="e.g. m.rahman@jstu.ac.bd"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Assigned Role"
              value={assignedRole}
              onChange={(e) => setAssignedRole(e.target.value as UserRole)}
              options={[
                { value: 'student', label: 'Student' },
                { value: 'teacher', label: 'Teacher' },
                { value: 'dept_chairman', label: 'Department Chairman' },
                { value: 'registrar', label: 'Registrar' },
                { value: 'exam_controller', label: 'Exam Controller' },
                { value: 'account_officer', label: 'Account Officer' },
                { value: 'library_officer', label: 'Library Officer' },
                ...(isSuperAdmin
                  ? [
                      { value: 'admin', label: 'Administrator' },
                      { value: 'super_admin', label: 'Super Administrator' }
                    ]
                  : [])
              ]}
            />

            <Select
              label="Department (If Applicable)"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              options={[
                { value: 'CSE', label: 'CSE' },
                { value: 'EEE', label: 'EEE' },
                { value: 'MATH', label: 'Mathematics' },
                { value: 'FISH', label: 'Fisheries' },
                { value: 'GEOL', label: 'Geology' },
                { value: 'MGMT', label: 'Management' },
                { value: 'SW', label: 'Social Work' }
              ]}
            />
          </div>

          {assignedRole === 'student' && (
            <Input
              label="Student ID (Compulsory for student role)"
              required
              placeholder="e.g. JSTU2026042"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
          )}

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-[11px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300">Hierarchy & Claims Invariant:</p>
            <p>
              Admins cannot create admin or super_admin accounts. Custom claims are provisioned with <code>mustChangePassword: true</code> and staff MFA requirement.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setProvisionModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isProvisioning}
            >
              Provision Account
            </Button>
          </div>
        </form>
      </Modal>

      {/* Role Modification Modal (Tests setUserRole & Hierarchy Validation) */}
      <Modal
        isOpen={!!selectedUserForRoleChange}
        onClose={() => setSelectedUserForRoleChange(null)}
        title={isBn ? 'ব্যবহারকারীর প্রাতিষ্ঠানিক রোল পরিবর্তন' : 'Change Institutional User Role'}
        description="Executes Cloud Function `setUserRole`. Sets custom claims, revokes refresh tokens, and writes audit record."
      >
        {selectedUserForRoleChange && (
          <form onSubmit={handleRoleUpdate} className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-1">
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                {selectedUserForRoleChange.profile.fullName}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                {selectedUserForRoleChange.profile.email} &bull; Current Role: <span className="font-bold text-blue-600">{selectedUserForRoleChange.claims.role}</span>
              </div>
            </div>

            <Select
              label="Select New Custom Claim Role"
              value={selectedNewRole}
              onChange={(e) => setSelectedNewRole(e.target.value as UserRole)}
              options={[
                { value: 'student', label: 'Student' },
                { value: 'teacher', label: 'Teacher' },
                { value: 'dept_chairman', label: 'Department Chairman' },
                { value: 'registrar', label: 'Registrar' },
                { value: 'exam_controller', label: 'Exam Controller' },
                { value: 'account_officer', label: 'Account Officer' },
                { value: 'library_officer', label: 'Library Officer' },
                ...(isSuperAdmin
                  ? [
                      { value: 'admin', label: 'Administrator' },
                      { value: 'super_admin', label: 'Super Administrator' }
                    ]
                  : [
                      // Admin attempting to elevate will trigger hierarchy exception
                      { value: 'admin', label: 'Administrator (Will trigger hierarchy rejection if caller is admin)' }
                    ])
              ]}
            />

            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-lg text-[11px] text-amber-800 dark:text-amber-300 space-y-1">
              <p className="font-bold">Security Enforcement Rule:</p>
              <p>
                Role update immediately revokes the target user&apos;s active refresh tokens. The user will be required to re-authenticate or refresh claims on their next request.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedUserForRoleChange(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isUpdatingRole}
              >
                Apply Role & Revoke Session
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </DashboardLayout>
  );
};
