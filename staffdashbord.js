import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { LogOut, ClipboardList, Package } from "lucide-react";
import OrdersManagement from "../components/staff/OrdersManagement.jsx";
import MenuManagement from "../components/staff/MenuManagement.jsx";

export default function StaffDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    const storedUser = localStorage.getItem("canteenUser");
    if (!storedUser) {
      navigate(createPageUrl("Welcome"));
      return;
    }
    const user = JSON.parse(storedUser);
    if (user.userType !== "staff") {
      navigate(createPageUrl("Welcome"));
      return;
    }
    setUserData(user);
  }, [navigate]);

  const { data: orders = [] } = useQuery({
    queryKey: ['allOrders'],
    queryFn: () => base44.entities.Order.list('-created_date'),
    refetchInterval: 5000,
    initialData: [],
  });

  const { data: menuItems = [] } = useQuery({
    queryKey: ['menuItems'],
    queryFn: () => base44.entities.MenuItem.list(),
    initialData: [],
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ orderId, data }) => base44.entities.Order.update(orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
    },
  });

  const updateMenuItemMutation = useMutation({
    mutationFn: ({ itemId, data }) => base44.entities.MenuItem.update(itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("canteenUser");
    navigate(createPageUrl("Welcome"));
  };

  const updateOrderStatus = (orderId, newStatus, estimatedTime) => {
    const updateData = { status: newStatus };
    if (estimatedTime) {
      updateData.estimated_time = estimatedTime;
    }
    if (newStatus === 'ready') {
      updateData.ready_time = new Date().toISOString();
    }
    updateOrderMutation.mutate({ orderId, data: updateData });
  };

  const toggleItemAvailability = (itemId, currentStatus) => {
    updateMenuItemMutation.mutate({
      itemId,
      data: { is_available: !currentStatus }
    });
  };

  if (!userData) {
    return null;
  }

  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Staff Dashboard</h1>
                <p className="text-xs text-gray-600">Welcome, {userData.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-4 text-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{pendingOrders.length}</p>
                  <p className="text-xs text-gray-600">Pending</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{readyOrders.length}</p>
                  <p className="text-xs text-gray-600">Ready</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 py-2">
            <Button
              variant={activeTab === "orders" ? "default" : "ghost"}
              onClick={() => setActiveTab("orders")}
              className={activeTab === "orders" ? "bg-blue-500 hover:bg-blue-600" : ""}
            >
              <ClipboardList className="w-4 h-4 mr-2" />
              Orders
              {pendingOrders.length > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">
                  {pendingOrders.length}
                </span>
              )}
            </Button>
            <Button
              variant={activeTab === "menu" ? "default" : "ghost"}
              onClick={() => setActiveTab("menu")}
              className={activeTab === "menu" ? "bg-blue-500 hover:bg-blue-600" : ""}
            >
              <Package className="w-4 h-4 mr-2" />
              Menu Management
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "orders" && (
          <OrdersManagement
            orders={orders}
            updateOrderStatus={updateOrderStatus}
            isUpdating={updateOrderMutation.isPending}
          />
        )}

        {activeTab === "menu" && (
          <MenuManagement
            menuItems={menuItems}
            toggleItemAvailability={toggleItemAvailability}
            isUpdating={updateMenuItemMutation.isPending}
          />
        )}
      </main>
    </div>
  );
}