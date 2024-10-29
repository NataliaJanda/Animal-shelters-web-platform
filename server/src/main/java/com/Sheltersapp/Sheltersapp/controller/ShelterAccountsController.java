package com.Sheltersapp.Sheltersapp.controller;

import com.Sheltersapp.Sheltersapp.model.Shelter_accounts;
import com.Sheltersapp.Sheltersapp.service.ShelterAccountsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/shelterAccounts")
public class ShelterAccountsController {

    private final ShelterAccountsService shelterAccountsService;
    private final PasswordEncoder passwordEncoder;

    public ShelterAccountsController(ShelterAccountsService shelterAccountsService, PasswordEncoder passwordEncoder) {
        this.shelterAccountsService = shelterAccountsService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Shelter_accounts>> getAllShelters() {
        List<Shelter_accounts> shelters = shelterAccountsService.allShelters();
        return ResponseEntity.ok(shelters);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Shelter_accounts> userData(@PathVariable Long id) {
        Optional <Shelter_accounts> users = shelterAccountsService.getAccountsById(id);
        return users.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        shelterAccountsService.deleteAccounts(id);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/edit/{id}")
    public ResponseEntity<Shelter_accounts> editUsers(@PathVariable Long id, @RequestBody Shelter_accounts updateUsers) {
        Optional<Shelter_accounts> optionalUsers = shelterAccountsService.getAccountsById(id);

        if (optionalUsers.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Shelter_accounts existingUser = optionalUsers.get();

        existingUser.setName(updateUsers.getName());
        existingUser.setLast_name(updateUsers.getLast_name());
        existingUser.setUsername(updateUsers.getUsername());
        existingUser.setEmail(updateUsers.getEmail());

        if (updateUsers.getPassword() != null && !updateUsers.getPassword().isEmpty()) {
            String hashedPassword = passwordEncoder.encode(updateUsers.getPassword());
            existingUser.setPassword(hashedPassword);
        }

        Shelter_accounts savedUser = shelterAccountsService.createUser(existingUser);

        return ResponseEntity.ok(savedUser);
    }
}
