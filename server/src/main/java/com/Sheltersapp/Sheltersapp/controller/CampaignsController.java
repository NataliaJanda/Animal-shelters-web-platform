package com.Sheltersapp.Sheltersapp.controller;

import com.Sheltersapp.Sheltersapp.model.Campaigns;
import com.Sheltersapp.Sheltersapp.service.CampaignsService;
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


    @Autowired
    public CampaignsController(CampaignsService campaignsService) {
        this.campaignsService = campaignsService;
    }

    @PostMapping("/add")
    public ResponseEntity<Campaigns> createCampaign(@RequestBody Campaigns campaign) {
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

    @GetMapping()
    public ResponseEntity<List<Campaigns>> getAllCampaigns() {
        List<Campaigns> campaigns = campaignsService.allCampaigns();
        return ResponseEntity.ok(campaigns);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Campaigns> getCampaignById(@PathVariable Long id) {
        Optional<Campaigns> campaign = campaignsService.getCampaignById(id);
        return campaign.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCampaign(@PathVariable Long id) {
        campaignsService.deleteCampaign(id);
        return ResponseEntity.noContent().build();
    }
}
