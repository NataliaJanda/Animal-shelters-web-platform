package com.Sheltersapp.Sheltersapp.service;

import com.Sheltersapp.Sheltersapp.model.Adoption;
import com.Sheltersapp.Sheltersapp.repository.AdoptionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

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

}
