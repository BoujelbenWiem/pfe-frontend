"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Search, 
  MoreVertical, 
  Trash2, 
  Ban, 
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Store,
  Building
} from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import {
  getUsers,
  activateUser,
  deactivateUser,
  deleteUser,
  AdminUser,
} from "@/services/admin.service";
import { useLanguage } from "@/context/language/useLanguage";

const roleColors = {
  ADMIN: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  STORE_MANAGER: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  MARKETING: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  CRM: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  ACHATS: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

const roleLabels = {
  ADMIN: "Admin",
  STORE_MANAGER: "Store Manager",
  MARKETING: "Marketing",
  CRM: "CRM",
  ACHATS: "Purchases",
};

export default function UsersList() {
  const {t}=useLanguage();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showActions, setShowActions] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const itemsPerPage = 10;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: Record<string, unknown> = {
        page: currentPage,
        per_page: itemsPerPage,
      };
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.is_active = statusFilter === "active";

      const data = await getUsers(params);
      setUsers(data.users);
      setTotalPages(Math.ceil(data.total / itemsPerPage));
      setTotalUsers(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [currentPage, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAction = async (userId: number, action: "activate" | "deactivate" | "delete") => {
    if (action === "delete" && !confirm("Are you sure you want to delete this user?")) return;

    setActionLoading(userId);
    try {
      switch (action) {
        case "activate":
          await activateUser(userId);
          break;
        case "deactivate":
          await deactivateUser(userId);
          break;
        case "delete":
          await deleteUser(userId);
          break;
      }
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${action} user`);
    } finally {
      setActionLoading(null);
      setShowActions(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("dashboard.usersList")}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t("dashboard.totalUsers")}: {totalUsers}
            </p>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t("dashboard.searchUsers")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">{t("dashboard.allRoles")}</option>
              <option value="ADMIN">{t("dashboard.admin")}</option>
              <option value="STORE_MANAGER">{t("dashboard.storeManager")}</option>
              <option value="MARKETING">{t("dashboard.marketing")}</option>
              <option value="CRM">{t("dashboard.crm")}</option>
              <option value="ACHATS">{t("dashboard.purchases")}</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">{t("dashboard.allStatus")}</option>
              <option value="active">{t("dashboard.active")}</option>
              <option value="inactive">{t("dashboard.inactive")}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 m-4 rounded">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Users Table - Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t("dashboard.user")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t("dashboard.role")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t("dashboard.status")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t("dashboard.joined")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t("dashboard.details")}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t("dashboard.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-semibold">
                      {user.username[0].toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.username}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-1 text-xs font-medium rounded-full",
                    roleColors[user.role as keyof typeof roleColors] || "bg-gray-100 text-gray-700"
                  )}>
                    {roleLabels[user.role as keyof typeof roleLabels] || user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                    user.is_active 
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  )}>
                    {t(user.is_active ? "dashboard.active" : "dashboard.inactive")}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(user.created_at)}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    {user.store_id && (
                      <div className="flex items-center gap-1">
                        <Store className="w-3 h-3" />
                        <span>{t("dashboard.store")} #{user.store_id}</span>
                      </div>
                    )}
                    {user.department && (
                      <div className="flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        <span>{t("dashboard.department")}: {user.department}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right relative">
                  <button
                    onClick={() => setShowActions(showActions === user.id ? null : user.id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                  
                  {showActions === user.id && (
                    <div className="absolute right-6 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                      <div className="py-1">
                        {user.is_active ? (
                          <button
                            onClick={() => handleAction(user.id, "deactivate")}
                            disabled={actionLoading === user.id}
                            className="flex items-center w-full px-4 py-2 text-sm text-yellow-700 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                          >
                            <Ban className="w-4 h-4 mr-2" />
                            {t("dashboard.deactivate")}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAction(user.id, "activate")}
                            disabled={actionLoading === user.id}
                            className="flex items-center w-full px-4 py-2 text-sm text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {t("dashboard.activate")}
                          </button>
                        )}
                        <button
                          onClick={() => handleAction(user.id, "delete")}
                          disabled={actionLoading === user.id}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {t("dashboard.delete")}
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
        {filteredUsers.map((user) => (
          <div key={user.id} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center text-white font-semibold">
                  {user.username[0].toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {user.username}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowActions(showActions === user.id ? null : user.id)}
                className="p-2"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <span className={cn(
                "px-2 py-1 text-xs font-medium rounded-full",
                roleColors[user.role as keyof typeof roleColors] || "bg-gray-100 text-gray-700"
              )}>
                {roleLabels[user.role as keyof typeof roleLabels] || user.role}
              </span>
              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                user.is_active 
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              )}>
                {user.is_active ? t("dashboard.active") : t("dashboard.inactive")}
              </span>
            </div>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {t("dashboard.joined")}: {formatDate(user.created_at)}
            </div>
            
            {showActions === user.id && (
              <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                {user.is_active ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction(user.id, "deactivate")}
                    disabled={actionLoading === user.id}
                    className="flex-1"
                  >
                    <Ban className="w-4 h-4 mr-1" />
                    {t("dashboard.deactivate")}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction(user.id, "activate")}
                    disabled={actionLoading === user.id}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {t("dashboard.activate")}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleAction(user.id, "delete")}
                  disabled={actionLoading === user.id}
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  {t("dashboard.delete")}
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}