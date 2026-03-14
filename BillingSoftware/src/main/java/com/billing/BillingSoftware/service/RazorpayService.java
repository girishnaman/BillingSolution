package com.billing.BillingSoftware.service;

import com.billing.BillingSoftware.dto.RazorpayOrderResponse;
import com.razorpay.RazorpayException;

public interface RazorpayService {

    RazorpayOrderResponse createOrder(Double amount, String currency) throws RazorpayException;
}
