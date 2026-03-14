package com.billing.BillingSoftware.service.impl;

import com.billing.BillingSoftware.dto.*;
import com.billing.BillingSoftware.entity.OrderEntity;
import com.billing.BillingSoftware.entity.OrderItemEntity;
import com.billing.BillingSoftware.repository.OrderRepository;
import com.billing.BillingSoftware.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    @Override
    public OrderResponse createOrder(OrderRequest orderRequest) {

        OrderEntity newOrder = convertToOrderEntity(orderRequest);
        PaymentDetails paymentDetails = new PaymentDetails();
        paymentDetails.setStatus(newOrder.getPaymentMethod() == PaymentMethod.CASH ?
                PaymentDetails.PaymentStatus.COMPLETED : PaymentDetails.PaymentStatus.PENDING);
        newOrder.setPaymentDetails(paymentDetails);
       List<OrderItemEntity> orderItems = orderRequest.getCartItems().stream()
                .map(this::convertToOrderItemEntity)
                .collect(Collectors.toList());

        newOrder.setItems(orderItems);
        newOrder = orderRepository.save(newOrder);

        return convertToResponse(newOrder);
    }

    private OrderItemEntity convertToOrderItemEntity(OrderRequest.OrderItemRequest orderItemRequest) {

        return OrderItemEntity.builder()
                .itemId(orderItemRequest.getItemId())
                .name(orderItemRequest.getName())
                .price(orderItemRequest.getPrice())
                .quantity(orderItemRequest.getQuantity())
                .build();
    }

    private OrderResponse convertToResponse(OrderEntity newOrder) {

        return OrderResponse.builder()
                .orderId(newOrder.getOrderId())
                .customerName(newOrder.getCustomerName())
                .phoneNumber(newOrder.getPhoneNumber())
                .subtotal(newOrder.getSubtotal())
                .tax(newOrder.getTax())
                .grandTotal(newOrder.getGrandTotal())
                .paymentMethod(newOrder.getPaymentMethod())
                .items(newOrder.getItems().stream()
                        .map(this::convertToItemResponse)
                        .collect(Collectors.toList()))
                .paymentDetails(newOrder.getPaymentDetails())
                .createdAt(newOrder.getCreatedAt())
                .build();
    }

    private OrderResponse.OrderItemResponse convertToItemResponse(OrderItemEntity orderItemEntity) {

        return OrderResponse.OrderItemResponse.builder()
                .itemId(orderItemEntity.getItemId())
                .name(orderItemEntity.getName())
                .price(orderItemEntity.getPrice())
                .quantity(orderItemEntity.getQuantity())
                .build();
    }

    private OrderEntity convertToOrderEntity(OrderRequest orderRequest) {

        return OrderEntity.builder()
                .customerName(orderRequest.getCustomerName())
                .phoneNumber(orderRequest.getPhoneNumber())
                .subtotal(orderRequest.getSubtotal())
                .tax(orderRequest.getTax())
                .grandTotal(orderRequest.getGrandTotal())
                .paymentMethod(PaymentMethod.valueOf(orderRequest.getPaymentMethod()))
                .build();
    }


    @Override
    public void deleteOrder(String orderId) {
        OrderEntity orderEntity = orderRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        orderRepository.delete(orderEntity);
    }

    @Override
    public List<OrderResponse> getLatestOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponse verifyPayment(PaymentVerificationRequest paymentVerificationRequest) {
        OrderEntity orderEntity =  orderRepository.findByOrderId(paymentVerificationRequest.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!verifyRazorpaySignature(paymentVerificationRequest.getRazorpayOrderId(),
                paymentVerificationRequest.getRazorpayPaymentId(), paymentVerificationRequest.getRazorpaySignature())) {

            throw new  RuntimeException("Payment Verification Failed");
        }

        PaymentDetails paymentDetails = orderEntity.getPaymentDetails();
        paymentDetails.setRazorpayOrderId(paymentVerificationRequest.getRazorpayOrderId());
        paymentDetails.setRazorpayPaymentId(paymentVerificationRequest.getRazorpayPaymentId());
        paymentDetails.setRazorpaySignature(paymentVerificationRequest.getRazorpaySignature());
        paymentDetails.setStatus(PaymentDetails.PaymentStatus.COMPLETED);

        orderEntity = orderRepository.save(orderEntity);

        return convertToResponse(orderEntity);
    }

    @Override
    public Double sumSalesByDate(LocalDate date) {
        return orderRepository.sumSalesByDate(date);
    }

    @Override
    public Long countByOrderDate(LocalDate date) {
        return orderRepository.countByOrderDate(date);
    }

    @Override
    public List<OrderResponse> findRecentOrders() {
        return orderRepository.findRecentOrders(PageRequest.of(0, 5))
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private boolean verifyRazorpaySignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        return true;
    }
}
