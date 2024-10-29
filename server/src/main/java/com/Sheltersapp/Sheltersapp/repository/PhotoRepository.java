package com.Sheltersapp.Sheltersapp.repository;

import com.Sheltersapp.Sheltersapp.model.Animal;
import com.Sheltersapp.Sheltersapp.model.Photo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PhotoRepository extends JpaRepository<Photo,Long> {
    List<Photo> findByAnimal(Animal animal);
    Optional<Photo> findByAnimalId(Long aLong);

}
