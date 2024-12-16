package com.Sheltersapp.Sheltersapp.controller;

import com.Sheltersapp.Sheltersapp.model.*;
import com.Sheltersapp.Sheltersapp.repository.UserRepository;
import com.Sheltersapp.Sheltersapp.service.AdoptionService;
import com.Sheltersapp.Sheltersapp.service.AnimalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/adoption")
public class AdoptionController {
    private final AdoptionService adoptionService;
    private final AnimalService animalService;
    private final UserRepository usersRepository;

    public AdoptionController(AdoptionService adoptionService, AnimalService animalService, UserRepository usersRepository) {
        this.adoptionService = adoptionService;
        this.animalService = animalService;
        this.usersRepository = usersRepository;
    }

    @PostMapping("/admin/add")
    public ResponseEntity<Adoption> createAdoption(@RequestBody Adoption adoption) {
        System.out.println("Otrzymane dane adopcji: " + adoption);

        Users user = adoption.getUsers();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        Adoption savedAdoption = adoptionService.createAdoption(adoption);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAdoption);
    }

    @GetMapping("/")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Adoption>> getAllAdoption() {
        List<Adoption> adoptions = adoptionService.allAdoptions();
        return ResponseEntity.ok(adoptions);
    }

    @PutMapping("/admin/delete/{id}")
    public ResponseEntity<Animal> softDeleteAnimal(@PathVariable Long id) {
        Optional<Animal> optionalAnimal = animalService.getAnimalById(id);

        if (optionalAnimal.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Animal existingAnimal = optionalAnimal.get();
        existingAnimal.setAvailable(false);
        Animal savedAnimal = animalService.addAnimal(existingAnimal);

        return ResponseEntity.ok(savedAnimal);
    }

    @GetMapping("/shelter/{shelterId}")
    public ResponseEntity<List<Adoption>> getAdoptionByShelterId(@PathVariable Long shelterId) {
        try {
            List<Adoption> adoptions = adoptionService.findByShelterId(shelterId);
            if (adoptions.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(adoptions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
