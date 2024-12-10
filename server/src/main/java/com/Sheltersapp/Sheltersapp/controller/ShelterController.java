package com.Sheltersapp.Sheltersapp.controller;

import com.Sheltersapp.Sheltersapp.DTO.AdoptionFormDTO;
import com.Sheltersapp.Sheltersapp.model.Shelter;
import com.Sheltersapp.Sheltersapp.service.ShelterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/shelter")
public class ShelterController {

    private final ShelterService shelterService;
    @Autowired
    private JavaMailSender mailSender;

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

    @GetMapping("/animal/{animalId}/email")
    public ResponseEntity<String> getShelterEmailByAnimal(@PathVariable Long animalId) {
        String email = shelterService.getShelterEmailByAnimalId(animalId);
        return ResponseEntity.ok(email);
    }

    @PostMapping("/send-email")
    public ResponseEntity<String> sendAdoptionEmail(@RequestBody AdoptionFormDTO form) {
        try {
            if (form.getShelterEmail() == null || form.getShelterEmail().isEmpty()) {
                throw new IllegalArgumentException("Shelter email is empty");
            }

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(form.getShelterEmail());
            message.setSubject("Nowe zgłoszenie adopcyjne");
            message.setText("Szczegóły zgłoszenia:\n" +
                    "Imię: " + form.getName() + "\n" +
                    "Naziwsko: " + form.getSurname() + "\n" +
                    "Adres: " + form.getAddress() + "\n" +
                    "Numer telefonu: " + form.getPhoneNumber() + "\n" +
                    "Email: " + form.getEmail() + "\n" +
                    "Doświadczenie: " + form.getExperience()+ "\n" +
                    "Id zwierzęcia: " + form.getAnimal_id());


            mailSender.send(message);
            return ResponseEntity.ok("ok");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (MailException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error " + e.getMessage());
        }
    }
}
