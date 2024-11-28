package com.Sheltersapp.Sheltersapp.controller;

import com.Sheltersapp.Sheltersapp.model.*;
import com.Sheltersapp.Sheltersapp.repository.AnimalRepository;
import com.Sheltersapp.Sheltersapp.repository.ShelterAccountsRepository;
import com.Sheltersapp.Sheltersapp.service.AdoptionService;
import com.Sheltersapp.Sheltersapp.service.AnimalService;
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
    private final AnimalService animalService;

    public AdoptionController(JwtService jwtService, ShelterAccountsRepository shelterAccountsRepository, AdoptionService adoptionService, AnimalRepository animalRepository, AnimalService animalService) {
        this.jwtService = jwtService;
        this.shelterAccountsRepository = shelterAccountsRepository;
        this.adoptionService = adoptionService;
        this.animalRepository = animalRepository;
        this.animalService = animalService;
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

        Adoption adoption = new Adoption();
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
}
