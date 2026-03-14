package com.billing.BillingSoftware.controller;

import com.billing.BillingSoftware.dto.AuthRequest;
import com.billing.BillingSoftware.dto.AuthResponse;
import com.billing.BillingSoftware.service.UserService;
import com.billing.BillingSoftware.service.impl.AppUserDetailsService;
import com.billing.BillingSoftware.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final AppUserDetailsService appUserDetailsService;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public AuthResponse login (@RequestBody AuthRequest authRequest) throws Exception {

        authenticate(authRequest.getEmail(), authRequest.getPassword());

        final UserDetails userDetails = appUserDetailsService.loadUserByUsername(authRequest.getEmail());
        final String jwtToken = jwtUtil.generateJwtToken(userDetails);
        String role = userService.getUserRole(authRequest.getEmail());
        return new AuthResponse(authRequest.getEmail(),jwtToken, role);
    }

    private void authenticate (String email, String password) throws Exception {

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS");
        }
    }

    @PostMapping("/encode")
    public String encodePassword(@RequestBody Map<String, String> request) {

        return  passwordEncoder.encode(request.get("password"));
    }


}
