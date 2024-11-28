package com.Sheltersapp.Sheltersapp.repository;

import com.Sheltersapp.Sheltersapp.model.Shelter;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface ShelterRepository extends CrudRepository<Shelter, Long> {
@Query("SELECT a.shelter.id FROM Animal a WHERE a.id = :animalId")
Optional<Long> findShelterIdByAnimalId(@Param("animalId") Long animalId);

}
