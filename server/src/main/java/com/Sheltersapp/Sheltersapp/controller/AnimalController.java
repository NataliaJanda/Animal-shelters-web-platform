package com.Sheltersapp.Sheltersapp.controller;

import com.Sheltersapp.Sheltersapp.model.*;
import com.Sheltersapp.Sheltersapp.repository.AnimalRepository;
import com.Sheltersapp.Sheltersapp.repository.PhotoRepository;
import com.Sheltersapp.Sheltersapp.repository.ShelterAccountsRepository;
import com.Sheltersapp.Sheltersapp.repository.SpeciesRepository;
import com.Sheltersapp.Sheltersapp.service.AdoptionService;
import com.Sheltersapp.Sheltersapp.service.AnimalService;
import com.Sheltersapp.Sheltersapp.service.JwtService;
import com.Sheltersapp.Sheltersapp.service.PhotoService;
import jakarta.persistence.NonUniqueResultException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/animal")
public class AnimalController {
    private static final Logger logger = LoggerFactory.getLogger(CampaignsController.class);
    private final JwtService jwtService;
    private final ShelterAccountsRepository shelterAccountsRepository;
    private final AnimalService animalService;
    private final SpeciesRepository speciesRepository;
    private final AnimalRepository animalRepository;
    private final PhotoRepository photoRepository;
    private final PhotoService photoService;
    private final AdoptionService adoptionService;

    public AnimalController(JwtService jwtService, ShelterAccountsRepository shelterAccountsRepository, AnimalService animalService, SpeciesRepository speciesRepository, AnimalRepository animalRepository, PhotoRepository photoRepository, AdoptionService adoptionService, PhotoService photoService, AdoptionService adoptionService1) {
        this.jwtService = jwtService;
        this.shelterAccountsRepository = shelterAccountsRepository;
        this.animalService = animalService;
        this.speciesRepository = speciesRepository;
        this.animalRepository = animalRepository;
        this.photoRepository = photoRepository;
        this.photoService = photoService;
        this.adoptionService = adoptionService1;
    }

    @PostMapping("/admin/add")
    public ResponseEntity<Animal> addAnimal(@RequestBody Map<String, Object> animalData, @RequestHeader("Authorization") String authHeader) {

        String jwtToken = authHeader.substring(7);
        String username = jwtService.extractUsername(jwtToken);
        Optional<Shelter_accounts> shelterAccountsOptional = shelterAccountsRepository.findByUsername(username);

        if (shelterAccountsOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Shelter_accounts shelterAccounts = shelterAccountsOptional.get();
        Shelter userShelter = shelterAccounts.getShelter_id();

        Animal animal = new Animal();

        animal.setName((String) animalData.get("name"));
        animal.setAtitude((String) animalData.get("atitude"));
        animal.setRace((String) animalData.get("race"));
        animal.setSex((String) animalData.get("sex"));
        animal.setSize((String) animalData.get("size"));
        animal.setDescription((String) animalData.get("description"));
        animal.setVaccination((Boolean) animalData.get("vaccination"));

        animal.setAvailable(false);

        Integer age = null;
        try {
            age = (Integer) animalData.get("age");
            if (age == null) {
                throw new NumberFormatException("Age is null");
            }
        } catch (ClassCastException | NumberFormatException e) {
            return ResponseEntity.badRequest().body(null);
        }
        animal.setAge(age);

        animal.setShelter(userShelter);

        Long speciesId = null;
        try {
            speciesId = Long.valueOf((Integer) animalData.get("species"));
            if (speciesId == null) {
                throw new NumberFormatException("Species ID is null");
            }
        } catch (ClassCastException | NumberFormatException e) {
            return ResponseEntity.badRequest().body(null);
        }

        Optional<Species> speciesOptional = speciesRepository.findById(speciesId);

        if (speciesOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        Species species = speciesOptional.get();

        Integer amount = species.getAmount();
        amount = (amount != null) ? amount + 1 : 1;
        species.setAmount(amount);

        animal.setSpecies(species);

        try {
            Animal savedAnimal = animalService.addAnimal(animal);
            return ResponseEntity.ok(savedAnimal);
        } catch (Exception e) {
            logger.error("Error creating animal", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Animal>> getAllAnimals() {
        List<Animal> animals = animalService.allAnimals();
        return ResponseEntity.ok(animals);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Animal> getAnimalById(@PathVariable Long id) {
        Optional<Animal> animal = animalService.getAnimalById(id);
        return animal.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/shelter/{shelter_id}")
    public ResponseEntity<List<Animal>> getAnimalsByShelterId(@PathVariable Long shelter_id) {
        try {
            List<Animal> animals = animalService.findByShelterId(shelter_id);
            if (animals.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(animals);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/species/{species_id}")
    public ResponseEntity<List<Animal>> getAnimalsBySpeciesId(@PathVariable Long species_id) {
        try {
            List<Animal> animals = animalService.findBySpeciesId(species_id);
            if (animals.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(animals);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/admin/delete/{id}")
    @Transactional
    public ResponseEntity<Void> deleteAnimal(@PathVariable Long id) {
        try {
            Optional<Animal> optAnimal = animalRepository.findById(id);

            if (optAnimal.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            Animal animal = optAnimal.get();

            List<Photo> photos = photoRepository.findByAnimal(animal);
            for (Photo photo : photos) {
                photoService.deletePhoto(photo.getId());
            }

            int amount = animal.getSpecies().getAmount();
            --amount;
            animal.getSpecies().setAmount(amount);

            animalService.deleteAnimal(id);

            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Błąd ogólny przy usuwaniu zwierzęcia: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/admin/edit/{id}")
    public ResponseEntity<Animal> editAnimal(@PathVariable Long id, @RequestBody Animal updatedAnimal) {
        Optional<Animal> optionalAnimal = animalService.getAnimalById(id);

        if (optionalAnimal.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Animal existingAnimal = optionalAnimal.get();
        existingAnimal.setName(updatedAnimal.getName());
        existingAnimal.setAtitude(updatedAnimal.getAtitude());
        existingAnimal.setAge(updatedAnimal.getAge());
        existingAnimal.setDescription(updatedAnimal.getDescription());
        existingAnimal.setRace(updatedAnimal.getRace());
        existingAnimal.setSex(updatedAnimal.getSex());
        existingAnimal.setSize(updatedAnimal.getSize());
        existingAnimal.setVaccination(updatedAnimal.isVaccination());

        Animal savedAnimal = animalService.addAnimal(existingAnimal);

        return ResponseEntity.ok(savedAnimal);
    }

    @PostMapping("/{animalId}/photo")
    public ResponseEntity<String> uploadAnimalPhoto(@PathVariable Long animalId, @RequestParam("file") MultipartFile file) {
        try {
            Optional<Animal> animalOptional = animalRepository.findById(animalId);

            if (animalOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Zwierzę nie znalezione");
            }

            Animal animal = animalOptional.get();

            Photo photo = new Photo();
            photo.setAnimal(animal);
            photo.setData(file.getBytes());

            photoRepository.save(photo);

            return ResponseEntity.ok("Zdjęcie zostało zapisane.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Błąd podczas zapisywania zdjęcia");
        }
    }

    @GetMapping("/photo/list/{animalId}")
    @Transactional
    public ResponseEntity<List<byte[]>> getAnimalPhotos(@PathVariable Long animalId) {
        Optional<Animal> animalOptional = animalRepository.findById(animalId);

        if (animalOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        Animal animal = animalOptional.get();
        List<Photo> photos = photoRepository.findByAnimal(animal);

        if (photos.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        List<byte[]> photoDataList = photos.stream()
                .map(Photo::getData)
                .collect(Collectors.toList());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(photoDataList);
    }

    @GetMapping("/photo/{animalId}")
    @Transactional
    public ResponseEntity<byte[]> getAnimalPhoto(@PathVariable Long animalId) {
        Optional<Animal> animalOptional = animalRepository.findById(animalId);

        if (animalOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        Animal animal = animalOptional.get();
        List<Photo> photoOptional = photoRepository.findByAnimal(animal);

        if (photoOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        Photo photo = photoOptional.get(0);

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(photo.getData());
    }

    @PutMapping("/admin/setAvailable/{id}")
    public ResponseEntity<Animal> softDeleteAnimal(@PathVariable Long id) {
        Optional<Animal> optionalAnimal = animalService.getAnimalById(id);

        if (optionalAnimal.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Animal existingAnimal = optionalAnimal.get();
        existingAnimal.setAvailable(true);
        Animal savedAnimal = animalService.addAnimal(existingAnimal);

        return ResponseEntity.ok(savedAnimal);
    }

}
