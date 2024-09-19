package com.Sheltersapp.Sheltersapp.controller;

import com.Sheltersapp.Sheltersapp.model.News;
import com.Sheltersapp.Sheltersapp.model.Shelter;
import com.Sheltersapp.Sheltersapp.model.Shelter_accounts;
import com.Sheltersapp.Sheltersapp.repository.ShelterAccountsRepository;
import com.Sheltersapp.Sheltersapp.service.JwtService;
import com.Sheltersapp.Sheltersapp.service.NewsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/news")
public class NewsController {
    private static final Logger logger = LoggerFactory.getLogger(CampaignsController.class);
    private final JwtService jwtService;
    private final ShelterAccountsRepository shelterAccountsRepository;
    private final NewsService newsService;

    public NewsController(JwtService jwtService, ShelterAccountsRepository shelterAccountsRepository, NewsService newsService) {
        this.jwtService = jwtService;
        this.shelterAccountsRepository = shelterAccountsRepository;
        this.newsService = newsService;
    }

    @PostMapping("/admin/add")
    public ResponseEntity<News> createNews(@RequestBody News news, @RequestHeader("Authorization")String authHeader ){

        String jwtToken = authHeader.substring(7);
        String username = jwtService.extractUsername(jwtToken);
        Optional<Shelter_accounts> shelter_accounts_Optional = shelterAccountsRepository.findByUsername(username);
        Shelter_accounts shelter_accounts = shelter_accounts_Optional.get();
        Shelter userShelter = shelter_accounts.getShelter_id();
        news.setShelter(userShelter);

        news.setDate(LocalDateTime.now());

        logger.info("Request received to create campaign: {}", news);

        try {
            News savedNews = newsService.createNews(news);
            logger.info("Campaign successfully created: {}", savedNews);
            return ResponseEntity.ok(savedNews);
        } catch (Exception e) {
            logger.error("Error creating campaign", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/")
    @Transactional(readOnly = true)
    public ResponseEntity<List<News>> getAllCampaigns() {
        List<News> campaigns = newsService.allNews();
        return ResponseEntity.ok(campaigns);
    }

    @GetMapping("/{id}")
    public ResponseEntity<News> getCampaignById(@PathVariable Long id) {
        Optional<News> news = newsService.getNewsById(id);
        return news.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/shelter/{shelter_id}")
    public ResponseEntity<List<News>> getCampaignsByShelterId(@PathVariable Long shelter_id) {
        try {
            List<News> news = newsService.findByShelterId(shelter_id);

            if (news.isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            return ResponseEntity.ok(news);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<Void> deleteCampaign(@PathVariable Long id) {
        newsService.deleteNews(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/admin/edit/{id}")
    public ResponseEntity<News> editAdoption(@PathVariable Long id, @RequestBody News updateNews) {
        Optional<News> optionalCampaigns = newsService.getNewsById(id);

        if (optionalCampaigns.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        News existingNews = optionalCampaigns.get();
        existingNews.setDescription(updateNews.getDescription());
        existingNews.setTitle(updateNews.getTitle());

        News savedNews = newsService.createNews(existingNews);

        return ResponseEntity.ok(savedNews);
    }
}
