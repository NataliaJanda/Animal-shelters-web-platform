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
    public Adoption createAdoption(Adoption adoption){
        return adoptionRepository.save(adoption);
    }

    public List<Adoption> allAdoptions() {return adoptionRepository.findAll();}

    public List<Adoption> findByShelterId(Long shelterId) {
        return adoptionRepository.findByShelterId(shelterId);
    }

    public Optional<Adoption> getAdoptionById(Long id){
        return adoptionRepository.findById(id);
    }

    public void deleteAdoption(Long id){
        adoptionRepository.deleteById(id);
    }

    public List<Adoption> findAdoptionsBySpeciesId(Long speciesId) {
        return adoptionRepository.findByAnimalSpeciesId(speciesId);
    }

}
