package com.billing.BillingSoftware.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {

    private String email;
    private String token;
    private String role;
}
