package com.Sheltersapp.Sheltersapp.repository;

import com.Sheltersapp.Sheltersapp.model.Adoption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdoptionRepository extends JpaRepository<Adoption, Long> {
    Optional<Adoption> findById(Long aLong);

    List<Adoption> findByShelterId(Long id);

}
