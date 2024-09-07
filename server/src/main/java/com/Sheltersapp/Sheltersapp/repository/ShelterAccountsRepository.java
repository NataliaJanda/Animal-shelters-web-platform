package com.Sheltersapp.Sheltersapp.repository;

import com.Sheltersapp.Sheltersapp.model.Shelter_accounts;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShelterAccountsRepository extends CrudRepository<Shelter_accounts,Long> {
    Optional<Shelter_accounts> findByEmail(String email);
}
