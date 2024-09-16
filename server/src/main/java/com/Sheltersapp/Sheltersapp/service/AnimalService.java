package com.Sheltersapp.Sheltersapp.service;

import com.Sheltersapp.Sheltersapp.model.Animal;
import com.Sheltersapp.Sheltersapp.repository.AnimalRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnimalService {

    private final AnimalRepository animalRepository;

    public AnimalService(AnimalRepository animalRepository) {
        this.animalRepository = animalRepository;
    }

    public List<Animal> allAnimals() {return animalRepository.findAll();}

    public Animal addAnimal(Animal animal){return animalRepository.save(animal);}

    public Optional<Animal> getAnimalById(Long id){
        return animalRepository.findById(id);
    }

    public void deleteAnimal(Long id){
        animalRepository.deleteById(id);
    }

    public List<Animal> findByShelterId(Long shelterId) {
        return animalRepository.findByShelterId(shelterId);
    }

    public List<Animal> findBySpeciesId(Long species_id) {
        return animalRepository.findBySpeciesId(species_id);
    }

}
