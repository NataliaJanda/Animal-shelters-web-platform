package com.Sheltersapp.Sheltersapp.repository;

import com.Sheltersapp.Sheltersapp.model.Shelter_accounts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShelterAccountsRepository extends JpaRepository<Shelter_accounts,Long> {
    Optional<Shelter_accounts> findByUsername(String username);
    @Query("SELECT sa.email FROM Shelter_accounts sa WHERE sa.shelter_id.id = :shelterId")
    Optional<String> findEmailByShelterId(@Param("shelterId") Long shelterId);

}
