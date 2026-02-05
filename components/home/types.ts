// Shared types for home screen components

export interface SalesSummary {
  totalSales: number;
  completedOrders: number;
  pendingPaymentOrders: number;
  cancelledOrders: number;
}

export interface Transaction {
  id: number;
  name: string;
  date: string;
  amount: number;
  icon: React.ReactNode;
}

export interface ChartColors {
  completed: string;
  pending: string;
  cancelled: string;
}
