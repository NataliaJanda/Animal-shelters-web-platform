package com.Sheltersapp.Sheltersapp.service;

import com.Sheltersapp.Sheltersapp.model.Shelter;
import com.Sheltersapp.Sheltersapp.repository.ShelterAccountsRepository;
import com.Sheltersapp.Sheltersapp.repository.ShelterRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShelterService {
    private final ShelterRepository shelterRepository;
    private final ShelterAccountsRepository shelterAccountsRepository;

    public ShelterService(ShelterRepository shelterRepository, ShelterAccountsRepository shelterAccountsRepository) {
        this.shelterRepository = shelterRepository;
        this.shelterAccountsRepository = shelterAccountsRepository;
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
    public String getShelterEmailByAnimalId(Long animalId) {
        Long shelterId = shelterRepository.findShelterIdByAnimalId(animalId)
                .orElseThrow(() -> new RuntimeException("Shelter for animal not found"));
        System.out.println("Shelter ID: " + shelterId);

        String email = shelterAccountsRepository.findEmailByShelterId(shelterId)
                .orElseThrow(() -> new RuntimeException("Shelter account not found"));
        System.out.println("Shelter Email: " + email);
        return email;
    }


}
