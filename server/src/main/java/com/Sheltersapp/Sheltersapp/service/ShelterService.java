package com.Sheltersapp.Sheltersapp.service;

import com.Sheltersapp.Sheltersapp.model.Shelter;
import com.Sheltersapp.Sheltersapp.repository.ShelterRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShelterService {
    private final ShelterRepository shelterRepository;

    public ShelterService(ShelterRepository shelterRepository) {
        this.shelterRepository = shelterRepository;
    }

    @Transactional
    public Shelter createShelter(Shelter shelter){
        return shelterRepository.save(shelter);
    }
    public List<Shelter> allShelters() {return (List<Shelter>) shelterRepository.findAll();}

    public Optional<Shelter> getShelterById(Long id){
        return shelterRepository.findById(id);
    }

    public void deleteShelter(Long id){
        shelterRepository.deleteById(id);
    }
}
