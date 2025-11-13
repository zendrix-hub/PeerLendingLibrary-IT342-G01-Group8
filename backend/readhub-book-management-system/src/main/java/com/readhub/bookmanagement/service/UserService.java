package com.readhub.bookmanagement.service;

import com.readhub.bookmanagement.dto.UserProfileDto;
import com.readhub.bookmanagement.model.User;
import com.readhub.bookmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public UserProfileDto getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return mapToDto(user);
    }

    public UserProfileDto updateUserProfile(String email, UserProfileDto profileDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        user.setFirstName(profileDto.getFirstName());
        user.setLastName(profileDto.getLastName());

        // Optional: Allow email change if it's not already taken
        if (!email.equals(profileDto.getEmail())) {
            if (userRepository.existsByEmail(profileDto.getEmail())) {
                throw new RuntimeException("Error: Email is already in use!");
            }
            user.setEmail(profileDto.getEmail());
        }

        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }

    public void deleteUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Add logic here to handle related transactions before deleting
        // For now, we'll just delete the user
        userRepository.delete(user);
    }


    private UserProfileDto mapToDto(User user) {
        UserProfileDto dto = new UserProfileDto();
        dto.setUserId(user.getUserId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        return dto;
    }
}