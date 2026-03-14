package com.billing.BillingSoftware.service;

import com.billing.BillingSoftware.dto.OrderRequest;
import com.billing.BillingSoftware.dto.OrderResponse;
import com.billing.BillingSoftware.dto.PaymentVerificationRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface OrderService {

    OrderResponse createOrder (OrderRequest orderRequest);

    void deleteOrder (String orderId);

    List<OrderResponse> getLatestOrders();

    OrderResponse verifyPayment (PaymentVerificationRequest paymentVerificationRequest);

    Double sumSalesByDate (LocalDate date);

    Long countByOrderDate(LocalDate date);

    List<OrderResponse> findRecentOrders ();
}
