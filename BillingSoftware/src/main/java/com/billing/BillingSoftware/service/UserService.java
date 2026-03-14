package com.billing.BillingSoftware.service;

import com.billing.BillingSoftware.dto.UserRequest;
import com.billing.BillingSoftware.dto.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse createUser(UserRequest userRequest);

    String getUserRole (String email);

    List<UserResponse> getUsers();

    void deleteUser(String id);
}
