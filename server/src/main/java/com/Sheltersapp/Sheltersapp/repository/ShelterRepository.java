package com.Sheltersapp.Sheltersapp.repository;

import com.Sheltersapp.Sheltersapp.model.Shelter;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

//import java.util.Optional;

@Repository
public interface ShelterRepository extends CrudRepository<Shelter, Long> {
//    @Override
//    Optional<Shelter> findById(Long aLong);
}
