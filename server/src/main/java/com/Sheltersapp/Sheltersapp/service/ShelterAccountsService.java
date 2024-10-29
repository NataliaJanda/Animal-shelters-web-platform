package com.Sheltersapp.Sheltersapp.service;

import com.Sheltersapp.Sheltersapp.model.Shelter_accounts;
import com.Sheltersapp.Sheltersapp.repository.ShelterAccountsRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShelterAccountsService {

    private final ShelterAccountsRepository shelterAccountsRepository;

    public ShelterAccountsService(ShelterAccountsRepository shelterAccountsRepository) {
        this.shelterAccountsRepository = shelterAccountsRepository;
    }
    @Transactional
    public Shelter_accounts createUser(Shelter_accounts shelterAccounts){
        return shelterAccountsRepository.save(shelterAccounts);
    }
    public List<Shelter_accounts> allShelters() {return (List<Shelter_accounts>) shelterAccountsRepository.findAll();}

    public Optional<Shelter_accounts> getAccountsById(Long id){
        return shelterAccountsRepository.findById(id);
    }

    public void deleteAccounts(Long id){
        shelterAccountsRepository.deleteById(id);
    }
}
