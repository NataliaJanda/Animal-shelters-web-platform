package com.Sheltersapp.Sheltersapp.repository;

import com.Sheltersapp.Sheltersapp.model.Adoption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdoptionRepository extends JpaRepository<Adoption, Long> {
    @Query("SELECT a FROM Adoption a JOIN Animal an ON a.animal_id = an.id WHERE an.shelter.id = :shelterId")
    List<Adoption> findByShelterId(@Param("shelterId") Long shelterId);
}

