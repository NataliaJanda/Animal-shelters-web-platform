package com.Sheltersapp.Sheltersapp.service;

import com.Sheltersapp.Sheltersapp.model.Adoption;
import com.Sheltersapp.Sheltersapp.repository.AdoptionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdoptionService {
    private final AdoptionRepository adoptionRepository;

    public AdoptionService(AdoptionRepository adoptionRepository) {
        this.adoptionRepository = adoptionRepository;
    }

    @Transactional
    public Adoption createAdoption(Adoption adoption) {
        System.out.println("Zapisywanie adopcji: " + adoption);
        try {
            return adoptionRepository.save(adoption);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Błąd podczas zapisywania adopcji: " + e.getMessage());
        }
    }

    public List<Adoption> allAdoptions() {return adoptionRepository.findAll();}

//    public List<Adoption> findByAnimalShelterId(Long shelterId) {
//        return adoptionRepository.findByAnimalShelterId(shelterId);
//    }

    public Optional<Adoption> getAdoptionById(Long id){
        return adoptionRepository.findById(id);
    }

}
