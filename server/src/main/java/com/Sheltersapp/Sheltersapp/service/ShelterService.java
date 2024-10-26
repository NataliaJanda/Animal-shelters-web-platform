package com.Sheltersapp.Sheltersapp.service;

import com.Sheltersapp.Sheltersapp.model.Shelter;
import com.Sheltersapp.Sheltersapp.repository.ShelterRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShelterService {
    private final ShelterRepository shelterRepository;

    public ShelterService(ShelterRepository shelterRepository) {
        this.shelterRepository = shelterRepository;
    }

    public List<Shelter> allShelters() {return (List<Shelter>) shelterRepository.findAll();}

}
