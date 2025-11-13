package com.readhub.bookmanagement.controller;

import com.readhub.bookmanagement.dto.UserProfileDto;
import com.readhub.bookmanagement.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Principal automatically injected by Spring Security, contains the logged-in user's email
    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('BORROWER', 'ADMIN')") // Redundant but good practice
    public ResponseEntity<UserProfileDto> getUserProfile(Principal principal) {
        UserProfileDto profile = userService.getUserProfile(principal.getName());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    @PreAuthorize("hasAnyRole('BORROWER', 'ADMIN')")
    public ResponseEntity<?> updateUserProfile(Principal principal, @Valid @RequestBody UserProfileDto profileDto) {
        try {
            UserProfileDto updatedProfile = userService.updateUserProfile(principal.getName(), profileDto);
            return ResponseEntity.ok(updatedProfile);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/profile")
    @PreAuthorize("hasAnyRole('BORROWER', 'ADMIN')")
    public ResponseEntity<?> deleteUserProfile(Principal principal) {
        userService.deleteUserProfile(principal.getName());
        return ResponseEntity.ok("User profile deleted successfully.");
    }
}