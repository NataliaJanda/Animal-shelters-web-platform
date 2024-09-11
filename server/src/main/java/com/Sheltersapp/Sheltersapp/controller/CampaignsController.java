package com.Sheltersapp.Sheltersapp.controller;

import com.Sheltersapp.Sheltersapp.model.Campaigns;
import com.Sheltersapp.Sheltersapp.service.CampaignsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/campaigns")
public class CampaignsController {
    private final CampaignsService campaignsService;

    @Autowired
    public CampaignsController(CampaignsService campaignsService) {
        this.campaignsService = campaignsService;
    }

    @PostMapping("/add")
    public ResponseEntity<Campaigns> createCampaign(@RequestBody Campaigns campaign) {
        Campaigns savedCampaign = campaignsService.createCampaign(campaign);
        return ResponseEntity.ok(savedCampaign);
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
