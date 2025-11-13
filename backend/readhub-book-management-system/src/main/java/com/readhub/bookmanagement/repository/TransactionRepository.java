package com.readhub.bookmanagement.repository;

import com.readhub.bookmanagement.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    // You can add custom find methods here later, e.g., findByUser()
}