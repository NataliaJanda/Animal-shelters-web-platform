package com.Sheltersapp.Sheltersapp.controller;

import com.Sheltersapp.Sheltersapp.model.Role;
import com.Sheltersapp.Sheltersapp.model.Users;
import com.Sheltersapp.Sheltersapp.repository.UserRepository;
import com.Sheltersapp.Sheltersapp.response.LoginResponse;
import com.Sheltersapp.Sheltersapp.service.AuthenticationService;
import com.Sheltersapp.Sheltersapp.service.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.springframework.http.HttpStatus.FORBIDDEN;

@RestController
@RequestMapping("/auth")
public class OAuth2Controller {

    private final UserRepository userRepository;
    private final AuthenticationService authenticationService;
    private final JwtService jwtService;

    public OAuth2Controller(UserRepository userRepository, AuthenticationService authenticationService, JwtService jwtService) {
        this.userRepository = userRepository;
        this.authenticationService = authenticationService;
        this.jwtService = jwtService;
    }

    @GetMapping("/oauth2/success")
    public ResponseEntity<String> oauth2LoginOrRegisterSuccess(Authentication authentication, HttpServletResponse response) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String givenName = oAuth2User.getAttribute("given_name");
        String familyName = oAuth2User.getAttribute("family_name");

        Optional<Users> existingUser = userRepository.findUsersByEmail(email);

        if (existingUser.isPresent()) {
            Users authenticatedUser = existingUser.get();

            if (authenticatedUser.isActivated()) {
                String jwtToken = jwtService.generateToken(authenticatedUser);
                Role role = authenticatedUser.getRole();
                Long userId = authenticatedUser.getId();

                LoginResponse loginResponse = new LoginResponse(jwtToken, role, jwtService.getExpirationTime(), userId);
                return ResponseEntity.ok(String.valueOf(loginResponse));
            } else {
                return ResponseEntity.status(FORBIDDEN)
                        .body("Konto nie jest aktywowane. Sprawdź swoją skrzynkę e-mail.");
            }

        } else {
            Users user = new Users();
            user.setUsername(email);
            user.setName(givenName);
            user.setEmail(email);
            user.setLast_name(familyName);
            user.setVerificationCode(authenticationService.generateVerificationCode());
            user.setExpired(LocalDateTime.now().plusMinutes(15));
            user.setActivated(false);
            user.setRole(Role.USER);
            user.setPassword("");

            authenticationService.sendVerificationEmail(user);
            userRepository.save(user);

            response.sendRedirect("http://localhost:3000/RegisterAccept");

            return null;
        }
    }

    @GetMapping("/oauth2/success-login")
    public void oauth2LoginOrLoginSuccess(HttpServletResponse response, Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        Optional<Users> existingUser = userRepository.findUsersByEmail(email);

        if (existingUser.isPresent()) {
            Users authenticatedUser = existingUser.get();

            if (authenticatedUser.isActivated()) {
                String jwtToken = jwtService.generateToken(authenticatedUser);
                Role role = authenticatedUser.getRole();
                Long userId = authenticatedUser.getId();

                String redirectUrl = String.format(
                        "http://localhost:3000/signin?token=%s&role=%s&userId=%d",
                        jwtToken, role, userId
                );
                response.sendRedirect(redirectUrl);
            } else {
                response.sendRedirect("http://localhost:3000/signin?error=account_not_activated");
            }
        } else {
            response.sendRedirect("http://localhost:3000/signin?error=user_not_found");
        }
    }

}

