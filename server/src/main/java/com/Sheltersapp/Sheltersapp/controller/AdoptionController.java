package com.Sheltersapp.Sheltersapp.controller;

import com.Sheltersapp.Sheltersapp.model.*;
import com.Sheltersapp.Sheltersapp.repository.AnimalRepository;
import com.Sheltersapp.Sheltersapp.repository.ShelterAccountsRepository;
import com.Sheltersapp.Sheltersapp.service.AdoptionService;
import com.Sheltersapp.Sheltersapp.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/adoption")
public class AdoptionController {
    private static final Logger logger = LoggerFactory.getLogger(CampaignsController.class);
    private final JwtService jwtService;
    private final ShelterAccountsRepository shelterAccountsRepository;
    private final AdoptionService adoptionService;
    private final AnimalRepository animalRepository;

    public AdoptionController(JwtService jwtService, ShelterAccountsRepository shelterAccountsRepository, AdoptionService adoptionService, AnimalRepository animalRepository) {
        this.jwtService = jwtService;
        this.shelterAccountsRepository = shelterAccountsRepository;
        this.adoptionService = adoptionService;
        this.animalRepository = animalRepository;
    }

    @PostMapping("/admin/add")
    public ResponseEntity<Adoption> createAdoption(@RequestBody Map<String, Object> requestBody, @RequestHeader("Authorization") String authHeader) {

        String jwtToken = authHeader.substring(7);
        String username = jwtService.extractUsername(jwtToken);
        Optional<Shelter_accounts> shelterAccountsOptional = shelterAccountsRepository.findByUsername(username);
        Shelter_accounts shelterAccounts = shelterAccountsOptional.orElseThrow(() -> new RuntimeException("Shelter account not found"));
        Shelter userShelter = shelterAccounts.getShelter_id();

        Object animalIdObj = requestBody.get("animal_id");
        Long animalId;

        if (animalIdObj instanceof Integer) {
            animalId = ((Integer) animalIdObj).longValue();
        } else if (animalIdObj instanceof Long) {
            animalId = (Long) animalIdObj;
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        String description = (String) requestBody.get("description");

        if (animalId == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        Optional<Animal> animalOptional = animalRepository.findById(animalId);
        Animal animal = animalOptional.orElseThrow(() -> new RuntimeException("Animal not found with id: " + animalId));

        Adoption adoption = new Adoption();
        adoption.setShelter(userShelter);
        adoption.setAnimal(animal);
        adoption.setDescription(description);
        adoption.setDate(LocalDateTime.now());

        logger.info("Request received to create adoption: {}", adoption);

        try {
            Adoption savedAdoption = adoptionService.createAdoption(adoption);
            logger.info("Adoption successfully created: {}", savedAdoption);
            return ResponseEntity.ok(savedAdoption);
        } catch (Exception e) {
            logger.error("Error creating adoption", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Adoption>> getAllAdoption() {
        List<Adoption> adoptions = adoptionService.allAdoptions();
        return ResponseEntity.ok(adoptions);
    }

    @GetMapping("/shelter/{shelter_id}")
    public ResponseEntity<List<Adoption>> getAnimalsByShelterId(@PathVariable Long shelter_id) {
        try {
            List<Adoption> adoptions = adoptionService.findByShelterId(shelter_id);
            if (adoptions.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(adoptions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<Void> deleteAdoption(@PathVariable Long id) {
        adoptionService.deleteAdoption(id);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/admin/edit/{id}")
    public ResponseEntity<Adoption> editAdoption(@PathVariable Long id, @RequestBody Adoption updatedAdoption) {
        Optional<Adoption> optionalAdoption = adoptionService.getAdoptionById(id);

        if (optionalAdoption.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Adoption existingAdoption = optionalAdoption.get();
        existingAdoption.setDescription(updatedAdoption.getDescription());

        Adoption savedAnimal = adoptionService.createAdoption(existingAdoption);

        return ResponseEntity.ok(savedAnimal);
    }

    @GetMapping("/species/{species_id}")
    public ResponseEntity<List<Adoption>> getAdoptionsBySpeciesId(@PathVariable Long species_id) {
        try {
            List<Adoption> adoptions = adoptionService.findAdoptionsBySpeciesId(species_id);
            if (adoptions.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(adoptions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
