package com.Sheltersapp.Sheltersapp.controller;

import com.Sheltersapp.Sheltersapp.DTO.LoginUser;
import com.Sheltersapp.Sheltersapp.DTO.RegisterShelter;
import com.Sheltersapp.Sheltersapp.DTO.RegisterUser;
import com.Sheltersapp.Sheltersapp.DTO.VerifyUser;
import com.Sheltersapp.Sheltersapp.model.Role;
import com.Sheltersapp.Sheltersapp.model.Shelter_accounts;
import com.Sheltersapp.Sheltersapp.model.Users;
import com.Sheltersapp.Sheltersapp.response.LoginResponse;
import com.Sheltersapp.Sheltersapp.response.LoginResponseShelter;
import com.Sheltersapp.Sheltersapp.service.AuthenticationService;
import com.Sheltersapp.Sheltersapp.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/auth")
@RestController
public class AuthenticationController {
    private final JwtService jwtService;

    private final AuthenticationService authenticationService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/signup")
    public ResponseEntity<Users> register(@RequestBody RegisterUser registerUserDto) {
        Users registeredUsers = authenticationService.signup(registerUserDto);
        return ResponseEntity.ok(registeredUsers);
    }
    @PostMapping("/signup-shelter")
    public ResponseEntity<?> register(@RequestBody RegisterShelter registerShelter) throws Exception {
        return authenticationService.signupShelter(registerShelter);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUser loginUserDto) {
        try {
            Users authenticatedUsers = authenticationService.authenticate(loginUserDto);
            String jwtToken = jwtService.generateToken(authenticatedUsers);
            Role role = authenticatedUsers.getRole();
            Long userId = authenticatedUsers.getId();
            LoginResponse loginResponse = new LoginResponse(jwtToken, role, jwtService.getExpirationTime(), userId);
            return ResponseEntity.ok(loginResponse);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponse(e.getMessage()));
        }
    }
    @PostMapping("/login-shelter")
    public ResponseEntity<LoginResponseShelter> authenticateShelter(@RequestBody LoginUser loginUserDto) {
        try {
            Shelter_accounts authenticatedShelter = authenticationService.authenticateShelter(loginUserDto);
            String jwtToken = jwtService.generateToken(authenticatedShelter);
            Long shelterId = authenticatedShelter.getShelter_id().getId();
            Role role = authenticatedShelter.getRole();
            LoginResponseShelter loginResponse = new LoginResponseShelter(jwtToken, role, shelterId, jwtService.getExpirationTime());
            return ResponseEntity.ok(loginResponse);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponseShelter(e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestBody VerifyUser verifyUserDto) {
        try {
            authenticationService.verifyUser(verifyUserDto);
            return ResponseEntity.ok("Konto zostało pomyślnie zweryfikowane");
        } catch (RuntimeException e) {
            String message = e.getMessage();
            if (message.contains("Nie znaleziono użytkownika")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(message);
            } else if (message.contains("Kod weryfikacyjny wygasł")) {
                return ResponseEntity.status(HttpStatus.GONE).body(message);
            } else if (message.contains("Niepoprawny kod weryfikacyjny")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(message);
            } else {
                return ResponseEntity.badRequest().body("Wystąpił nieoczekiwany błąd");
            }
        }
    }
    @PostMapping("/verify-shelter")
    public ResponseEntity<?> verifyShelter(@RequestBody VerifyUser verifyUserDto) {
        try {
            authenticationService.verifyShelter(verifyUserDto);
            return ResponseEntity.ok("Konto zostało pomyślnie zweryfikowane");
        } catch (RuntimeException e) {
            String message = e.getMessage();
            if (message.contains("Nie znaleziono schroniska")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(message);
            } else if (message.contains("Kod weryfikacyjny wygasł")) {
                return ResponseEntity.status(HttpStatus.GONE).body(message);
            } else if (message.contains("Niepoprawny kod weryfikacyjny")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(message);
            } else {
                return ResponseEntity.badRequest().body("Wystąpił nieoczekiwany błąd");
            }
        }
    }

    @PostMapping("/resend")
    public ResponseEntity<?> resendVerificationCode(@RequestParam String email) {
        try {
            authenticationService.resendVerificationCode(email);
            return ResponseEntity.ok("Verification code sent");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/resend-shelter")
    public ResponseEntity<?> resendVerificationCodeShelter(@RequestParam String email) {
        try {
            authenticationService.resendVerificationCodeShelter(email);
            return ResponseEntity.ok("Verification code sent");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
