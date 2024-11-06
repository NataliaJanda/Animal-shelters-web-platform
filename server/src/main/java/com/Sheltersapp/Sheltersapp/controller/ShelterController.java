package com.Sheltersapp.Sheltersapp.controller;

import com.Sheltersapp.Sheltersapp.model.Shelter;
import com.Sheltersapp.Sheltersapp.service.ShelterService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/shelter")
public class ShelterController {

    private final ShelterService shelterService;


    public ShelterController(ShelterService shelterService) {
        this.shelterService = shelterService;
    }

    @GetMapping("/")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Shelter>> getAllShelters() {
        List<Shelter> shelters = shelterService.allShelters();
        return ResponseEntity.ok(shelters);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shelter> userData(@PathVariable Long id) {
        Optional <Shelter> shelter = shelterService.getShelterById(id);
        return shelter.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        shelterService.deleteShelter(id);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/edit/{id}")
    public ResponseEntity<Shelter> editUsers(@PathVariable Long id, @RequestBody Shelter updateUsers) {
        Optional<Shelter> optionalUsers = shelterService.getShelterById(id);

        if (optionalUsers.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Shelter existingUser = optionalUsers.get();

        existingUser.setName(updateUsers.getName());
        existingUser.setAddress(updateUsers.getAddress());
        existingUser.setCommune(updateUsers.getCommune());
        existingUser.setPost_code(updateUsers.getPost_code());
        existingUser.setTown(updateUsers.getTown());
        existingUser.setVoivodeship(updateUsers.getVoivodeship());

        Shelter savedUser = shelterService.createShelter(existingUser);

        return ResponseEntity.ok(savedUser);
    }
}
