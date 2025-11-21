import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { LogOut, ShoppingCart, Clock, Package } from "lucide-react";
import MenuSection from "../components/student/MenuSection.jsx";
import ActiveOrder from "../components/student/ActiveOrder.jsx";
import OrderHistory from "../components/student/OrderHistory.jsx";
import Cart from "../components/student/Cart.jsx";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState("menu");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("canteenUser");
    if (!storedUser) {
      navigate(createPageUrl("Welcome"));
      return;
    }
    const user = JSON.parse(storedUser);
    if (user.userType !== "student") {
      navigate(createPageUrl("Welcome"));
      return;
    }
    setUserData(user);
  }, [navigate]);

  const { data: menuItems = [] } = useQuery({
    queryKey: ['menuItems'],
    queryFn: () => base44.entities.MenuItem.list(),
    initialData: [],
  });

  const { data: myOrders = [] } = useQuery({
    queryKey: ['myOrders', userData?.id],
    queryFn: () => base44.entities.Order.filter({ student_id: userData?.id }, '-created_date'),
    enabled: !!userData?.id,
    initialData: [],
  });

  const createOrderMutation = useMutation({
    mutationFn: (orderData) => base44.entities.Order.create(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myOrders'] });
      setCart([]);
      setShowCart(false);
      setActiveTab("orders");
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("canteenUser");
    navigate(createPageUrl("Welcome"));
  };

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity === 0) {
      setCart(cart.filter(item => item.id !== itemId));
    } else {
      setCart(cart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      ));
    }
  };

  const placeOrder = () => {
    if (cart.length === 0) return;

    const tokenNumber = `T${Date.now().toString().slice(-6)}`;
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const estimatedTime = cart.reduce((sum, item) => 
      sum + ((item.preparation_time || 10) * item.quantity), 0
    ) / cart.length;

    const orderData = {
      student_id: userData.id,
      student_name: userData.name,
      student_email: userData.email,
      token_number: tokenNumber,
      items: cart.map(item => ({
        item_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      total_amount: totalAmount,
      status: "pending",
      estimated_time: Math.ceil(estimatedTime),
      order_time: new Date().toISOString()
    };

    createOrderMutation.mutate(orderData);
  };

  const activeOrder = myOrders.find(order => 
    order.status === 'pending' || order.status === 'preparing' || order.status === 'ready'
  );

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Smart Canteen</h1>
                <p className="text-xs text-gray-600">Welcome, {userData.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCart(!showCart)}
                className="relative"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-teal-500 text-white text-xs rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Button>
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
              variant={activeTab === "menu" ? "default" : "ghost"}
              onClick={() => setActiveTab("menu")}
              className={activeTab === "menu" ? "bg-teal-500 hover:bg-teal-600" : ""}
            >
              <Package className="w-4 h-4 mr-2" />
              Menu
            </Button>
            <Button
              variant={activeTab === "orders" ? "default" : "ghost"}
              onClick={() => setActiveTab("orders")}
              className={activeTab === "orders" ? "bg-teal-500 hover:bg-teal-600" : ""}
            >
              <Clock className="w-4 h-4 mr-2" />
              My Orders
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeOrder && activeTab === "menu" && (
          <ActiveOrder order={activeOrder} />
        )}

        {activeTab === "menu" && (
          <MenuSection 
            menuItems={menuItems} 
            addToCart={addToCart}
          />
        )}

        {activeTab === "orders" && (
          <OrderHistory orders={myOrders} />
        )}
      </main>

      {/* Cart Sidebar */}
      {showCart && (
        <Cart
          cart={cart}
          updateQuantity={updateQuantity}
          placeOrder={placeOrder}
          onClose={() => setShowCart(false)}
          isPlacingOrder={createOrderMutation.isPending}
        />
      )}
    </div>
  );
}