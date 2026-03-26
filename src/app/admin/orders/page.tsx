"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { createSupabaseBrowserClient } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  CreditCard, 
  Search, 
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Filter
} from 'lucide-react';

const supabase = createSupabaseBrowserClient();

interface Order {
  id: string;
  user_id: string;
  item_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'rejected';
  metadata: {
    plan_name?: string;
  } | null;
  created_at: string;
  profiles: {
    email: string | null;
  } | null;
}

export default function OrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const PAGE_SIZE = 50;

  useEffect(() => {
    loadOrders();
  }, [page, statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from('orders')
        .select('*, profiles(email)', { count: 'exact' })
        .range(from, to)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error, count } = await query;
      
      if (error) {
        console.error('Error loading orders:', error);
        toast.error('Lỗi tải đơn hàng: ' + error.message);
        return;
      }

      setOrders((data as Order[]) || []);
      setTotalCount(count || 0);

    } catch (error) {
      console.error('Error in loadOrders:', error);
      toast.error('Lỗi khi tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const confirmOrder = async (orderId: string) => {
    if (!confirm('Bạn có chắc muốn xác nhận đơn hàng này?')) return;

    try {
      const { error } = await supabase.functions.invoke('confirm-payment', {
        body: { order_id: orderId },
      });

      if (error) throw error;
      toast.success('Xác nhận đơn hàng thành công!');
      loadOrders();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Lỗi khi xác nhận: ${errorMessage}`);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (!searchTerm.trim()) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      order.id.toLowerCase().includes(search) ||
      order.profiles?.email?.toLowerCase().includes(search) ||
      order.metadata?.plan_name?.toLowerCase().includes(search)
    );
  });

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Đơn hàng</h1>
            <p className="text-gray-600">Xem và xác nhận các đơn hàng thanh toán.</p>
          </div>
          <Button onClick={loadOrders} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm theo mã đơn, email, tên gói..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="failed">Thất bại</SelectItem>
                <SelectItem value="rejected">Đã từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Danh sách đơn hàng ({filteredOrders.length.toLocaleString()})
            <div className="text-sm text-gray-500">
              Trang {page + 1} / {totalPages}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải đơn hàng...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã đơn hàng</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Gói</TableHead>
                      <TableHead>Số tiền</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs">
                          {order.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell>{order.profiles?.email || 'N/A'}</TableCell>
                        <TableCell>{order.metadata?.plan_name || order.item_id}</TableCell>
                        <TableCell>{order.amount.toLocaleString()} VND</TableCell>
                        <TableCell>
                          <Badge variant={
                            order.status === 'completed' ? 'default' :
                            order.status === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(order.created_at).toLocaleDateString('vi-VN')}
                        </TableCell>
                        <TableCell>
                          {order.status === 'pending' && (
                            <Button 
                              size="sm" 
                              onClick={() => confirmOrder(order.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Xác nhận
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    Trước
                  </Button>
                  <span className="text-sm text-gray-600">
                    Trang {page + 1} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                  >
                    Sau
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}