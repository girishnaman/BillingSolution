package com.billing.BillingSoftware.service.impl;

import com.billing.BillingSoftware.dto.UserRequest;
import com.billing.BillingSoftware.dto.UserResponse;
import com.billing.BillingSoftware.entity.UserEntity;
import com.billing.BillingSoftware.repository.UserRepository;
import com.billing.BillingSoftware.service.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse createUser(UserRequest userRequest) {

        UserEntity newUser = convertToEntity(userRequest);
        newUser =  userRepository.save(newUser);

        return convertToResponse(newUser);
    }

    private UserEntity convertToEntity(UserRequest userRequest) {

        return UserEntity.builder()
                .userId(UUID.randomUUID().toString())
                .email(userRequest.getEmail())
                .password(passwordEncoder.encode(userRequest.getPassword()))
                .name(userRequest.getName())
                .role(userRequest.getRole().toUpperCase())
                .build();
    }

    private UserResponse convertToResponse(UserEntity newUser) {

        return UserResponse.builder()
                .name(newUser.getName())
                .email(newUser.getEmail())
                .userId(newUser.getUserId())
                .createdAt(newUser.getCreatedAt())
                .updatedAt(newUser.getUpdatedAt())
                .role(newUser.getRole())
                .build();
    }

    @Override
    public String getUserRole(String email) {
        UserEntity existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return existingUser.getRole();
    }

    @Override
    public List<UserResponse> getUsers() {

        return userRepository.findAll()
                .stream()
                .map(user->convertToResponse(user))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteUser(String id) {

        UserEntity existingUser = userRepository.findByUserId(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
        userRepository.delete(existingUser);
    }
}
