package com.readhub.bookmanagement.model;

public enum TransactionStatus {
    REQUESTED,  // User requests a book
    APPROVED,   // Admin approves the request
    REJECTED,   // Admin rejects the request
    BORROWED,   // Admin confirms physical pickup
    RETURNED    // Admin confirms physical return
}