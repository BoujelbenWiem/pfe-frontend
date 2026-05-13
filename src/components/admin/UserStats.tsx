"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  UserCheck, 
  TrendingUp,
  Shield,
  Store,
  Megaphone,
  Headphones,
  ShoppingCart
} from "lucide-react";
import { getUserStats, UserStatsResponse } from "@/services/admin.service";

const roleIcons = {
  ADMIN: Shield,
  STORE_MANAGER: Store,
  MARKETING: Megaphone,
  CRM: Headphones,
  ACHATS: ShoppingCart,
};

const roleLabels = {
  ADMIN: "Administrators",
  STORE_MANAGER: "Store Managers",
  MARKETING: "Marketing Team",
  CRM: "CRM Team",
  ACHATS: "Purchasing Team",
};

const roleColors = {
  ADMIN: "from-purple-500 to-purple-600",
  STORE_MANAGER: "from-blue-500 to-blue-600",
  MARKETING: "from-green-500 to-green-600",
  CRM: "from-yellow-500 to-yellow-600",
  ACHATS: "from-orange-500 to-orange-600",
};

export default function UserStats() {
  const [stats, setStats] = useState<UserStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUserStats()
      .then(setStats)
      .catch((err) => setError(err.message || "Failed to fetch statistics"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-700 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!stats) return null;

  const statsCards = [
    {
      label: "Total Users",
      value: stats.total,
      icon: Users,
      color: "from-gray-500 to-gray-600",
    },
    {
      label: "Active Roles",
      value: Object.keys(roleLabels).filter(r => stats[r as keyof UserStatsResponse]).length,
      icon: UserCheck,
      color: "from-green-500 to-green-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{card.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    {card.value}
                  </p>
                </div>
                <div className={`bg-gradient-to-br ${card.color} p-3 rounded-xl`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Role Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          User Distribution by Role
        </h3>
        <div className="space-y-4">
          {Object.entries(roleLabels).map(([role, label]) => {
            const Icon = roleIcons[role as keyof typeof roleIcons];
            const count = stats[role as keyof UserStatsResponse] as number;
            const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
            const color = roleColors[role as keyof typeof roleColors];

            return (
              <div key={role}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {count}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`bg-gradient-to-r ${color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity (Placeholder) */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h3>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Activity tracking coming soon</p>
          <p className="text-sm mt-1">Monitor user actions and system events</p>
        </div>
      </div>
    </div>
  );
}