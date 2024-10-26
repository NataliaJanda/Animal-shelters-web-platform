package com.Sheltersapp.Sheltersapp.controller;

import com.Sheltersapp.Sheltersapp.model.Shelter;
import com.Sheltersapp.Sheltersapp.service.ShelterService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

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
}
