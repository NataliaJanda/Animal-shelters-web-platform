package com.Sheltersapp.Sheltersapp.service;

import com.Sheltersapp.Sheltersapp.model.Campaigns;
import com.Sheltersapp.Sheltersapp.repository.CampaignsRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CampaignsService {

    private final CampaignsRepository campaignsRepository;

    public CampaignsService(CampaignsRepository campaignsRepository) {
        this.campaignsRepository = campaignsRepository;
    }

    public List<Campaigns> allCampaigns(){
        return campaignsRepository.findAll();
    }
    @Transactional
    public Campaigns createCampaign(Campaigns campaigns){
        return campaignsRepository.save(campaigns);
    }

    public Optional<Campaigns> getCampaignById(Long id){
        return campaignsRepository.findById(id);
    }

    public void deleteCampaign(Long id){
        campaignsRepository.deleteById(id);
    }

    public List<Campaigns> findByShelterId(Long shelterId) {
        return campaignsRepository.findByShelterId(shelterId);
    }
}
