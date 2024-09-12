package com.Sheltersapp.Sheltersapp.repository;

import com.Sheltersapp.Sheltersapp.model.Shelter_accounts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShelterAccountsRepository extends JpaRepository<Shelter_accounts,Long> {
    Optional<Shelter_accounts> findByUsername(String username);
}
