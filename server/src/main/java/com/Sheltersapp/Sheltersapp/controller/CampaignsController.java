package com.Sheltersapp.Sheltersapp.controller;

import com.Sheltersapp.Sheltersapp.model.Campaigns;
import com.Sheltersapp.Sheltersapp.model.Shelter;
import com.Sheltersapp.Sheltersapp.model.Shelter_accounts;
import com.Sheltersapp.Sheltersapp.repository.ShelterAccountsRepository;
import com.Sheltersapp.Sheltersapp.service.CampaignsService;
import com.Sheltersapp.Sheltersapp.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/campaigns")
public class CampaignsController {
    private final CampaignsService campaignsService;
    private static final Logger logger = LoggerFactory.getLogger(CampaignsController.class);
    private final JwtService jwtService;
    private final ShelterAccountsRepository shelterAccountsRepository;

    @Autowired
    public CampaignsController(CampaignsService campaignsService, JwtService jwtService, ShelterAccountsRepository shelterAccountsRepository) {
        this.campaignsService = campaignsService;
        this.jwtService = jwtService;
        this.shelterAccountsRepository = shelterAccountsRepository;
    }

    @PostMapping("/add")
    public ResponseEntity<Campaigns> createCampaign(@RequestBody Campaigns campaign, @RequestHeader("Authorization")String authHeader ){

        String jwtToken = authHeader.substring(7);
        String username = jwtService.extractUsername(jwtToken);
        Optional<Shelter_accounts> shelter_accounts_Optional = shelterAccountsRepository.findByUsername(username);
        Shelter_accounts shelter_accounts = shelter_accounts_Optional.get();
        Shelter userShelter = shelter_accounts.getShelter_id();
        campaign.setShelter(userShelter);

        logger.info("Request received to create campaign: {}", campaign);

        try {
            Campaigns savedCampaign = campaignsService.createCampaign(campaign);
            logger.info("Campaign successfully created: {}", savedCampaign);
            return ResponseEntity.ok(savedCampaign);
        } catch (Exception e) {
            logger.error("Error creating campaign", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/")
    public ResponseEntity<List<Campaigns>> getAllCampaigns() {
        List<Campaigns> campaigns = campaignsService.allCampaigns();
        return ResponseEntity.ok(campaigns);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Campaigns> getCampaignById(@PathVariable Long id) {
        Optional<Campaigns> campaign = campaignsService.getCampaignById(id);
        return campaign.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/shelter/{shelter_id}")
    public ResponseEntity<List<Campaigns>> getCampaignsByShelterId(@PathVariable Long shelter_id) {
        try {
            List<Campaigns> campaigns = campaignsService.findByShelterId(shelter_id);

            if (campaigns.isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            return ResponseEntity.ok(campaigns);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCampaign(@PathVariable Long id) {
        campaignsService.deleteCampaign(id);
        return ResponseEntity.noContent().build();
    }
}
