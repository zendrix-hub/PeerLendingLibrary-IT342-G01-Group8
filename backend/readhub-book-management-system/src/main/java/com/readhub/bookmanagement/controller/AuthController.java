package com.readhub.bookmanagement.controller;

import com.readhub.bookmanagement.dto.AuthResponse;
import com.readhub.bookmanagement.dto.LoginRequest;
import com.readhub.bookmanagement.dto.RegisterRequest;
import com.readhub.bookmanagement.model.User;
import com.readhub.bookmanagement.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        // --- NEW DEBUGGING CODE ---
        try {
            AuthResponse authResponse = authService.loginUser(loginRequest);
            // If successful, return 200 OK
            return ResponseEntity.ok(authResponse);
        } catch (BadCredentialsException e) {
            // If authentication fails (wrong user/pass), return 401
            return ResponseEntity.status(401).body("Error: Invalid username or password");
        } catch (Exception e) {
            // Catch any other unexpected errors
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
        // --- END OF NEW CODE ---
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            User registeredUser = authService.registerUser(registerRequest);
            return ResponseEntity.ok("User registered successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}