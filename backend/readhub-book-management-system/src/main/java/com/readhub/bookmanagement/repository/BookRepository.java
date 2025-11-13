package com.readhub.bookmanagement.repository;

import com.readhub.bookmanagement.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    // You can add custom find methods here later, e.g., findByTitle()
}