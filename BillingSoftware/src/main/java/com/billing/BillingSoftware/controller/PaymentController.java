package com.billing.BillingSoftware.controller;

import com.billing.BillingSoftware.dto.OrderResponse;
import com.billing.BillingSoftware.dto.PaymentRequest;
import com.billing.BillingSoftware.dto.PaymentVerificationRequest;
import com.billing.BillingSoftware.dto.RazorpayOrderResponse;
import com.billing.BillingSoftware.service.OrderService;
import com.billing.BillingSoftware.service.RazorpayService;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final RazorpayService razorpayService;
    private final OrderService orderService;

    @PostMapping("/create-order")
    @ResponseStatus(HttpStatus.CREATED)
    public RazorpayOrderResponse createRazorpayOrder(@RequestBody PaymentRequest paymentRequest) throws RazorpayException {

        return razorpayService.createOrder(paymentRequest.getAmount(), paymentRequest.getCurrency());
    }

    @PostMapping("/verify")
    public OrderResponse verifyOrder(@RequestBody PaymentVerificationRequest paymentRequest) {

        return orderService.verifyPayment(paymentRequest);
    }
}
