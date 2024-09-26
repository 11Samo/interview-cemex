import { Component, OnDestroy, OnInit } from '@angular/core';
import { Order } from '../models/order.model';
import { OrderService } from '../services/order.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss',
})
export class OrderHistoryComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  private orderSub: Subscription | undefined;
  filteredOrders: Order[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderSub = this.orderService.getOrders().subscribe({
      next: (data: Order[]) => {
        this.orders = data;
        this.filteredOrders = data;
      },
      error: (error) => {
        console.error('loading data Error', error);
      },
    });
  }

  onFiltersChanged(filters: any) {
    this.filteredOrders = this.orders.filter((order) => {
      const statusMatch =
        (!filters.statusPending || order.status === 'Pending') &&
        (!filters.statusInProgress || order.status === 'In Progress') &&
        (!filters.statusCompleted || order.status === 'Completed');

      const productLineMatch =
        !filters.productLine || order.productLine === filters.productLine;

      const orderDate = this.normalizeDate(new Date(order.dateRequested));
      const startDate = filters.startDate
        ? this.normalizeDate(new Date(filters.startDate))
        : null;
      const endDate = filters.endDate
        ? this.normalizeDate(new Date(filters.endDate))
        : null;

      const dateMatch =
        (!startDate || orderDate >= startDate) &&
        (!endDate || orderDate <= endDate);

      const orderNumberMatch =
        !filters.orderNumber || order.orderNumber.includes(filters.orderNumber);

      return statusMatch && productLineMatch && dateMatch && orderNumberMatch;
    });
  }

  // function for remove time part
  normalizeDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  ngOnDestroy(): void {
    if (this.orderSub) {
      this.orderSub.unsubscribe();
    }
  }
}
