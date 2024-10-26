package com.Sheltersapp.Sheltersapp.controller;

import com.Sheltersapp.Sheltersapp.model.Users;
import com.Sheltersapp.Sheltersapp.repository.UserRepository;
import com.Sheltersapp.Sheltersapp.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RequestMapping("/users")
@RestController
public class UserController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/me")
    public ResponseEntity<Users> authenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Users currentUsers = (Users) authentication.getPrincipal();
        return ResponseEntity.ok(currentUsers);
    }

    @GetMapping("/")
    public ResponseEntity<List<Users>> allUsers() {
        List <Users> users = userService.allUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Users> userData(@PathVariable Long id) {
        Optional <Users> users = userService.getUserById(id);
        return users.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/edit/{id}")
    public ResponseEntity<Users> editUsers(@PathVariable Long id, @RequestBody Users updateUsers) {
        Optional<Users> optionalUsers = userService.getUserById(id);

        if (optionalUsers.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Users existingUser = optionalUsers.get();

        existingUser.setName(updateUsers.getName());
        existingUser.setLast_name(updateUsers.getLast_name());
        existingUser.setUsername(updateUsers.getUsername());
        existingUser.setEmail(updateUsers.getEmail());

        if (updateUsers.getPassword() != null && !updateUsers.getPassword().isEmpty()) {
            String hashedPassword = passwordEncoder.encode(updateUsers.getPassword());
            existingUser.setPassword(hashedPassword);
        }

        Users savedUser = userService.createUser(existingUser);

        return ResponseEntity.ok(savedUser);
    }


}
