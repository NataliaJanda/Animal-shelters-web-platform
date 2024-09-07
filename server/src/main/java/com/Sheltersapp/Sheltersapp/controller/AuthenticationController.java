package com.Sheltersapp.Sheltersapp.controller;

import com.Sheltersapp.Sheltersapp.DTO.LoginUser;
import com.Sheltersapp.Sheltersapp.DTO.RegisterShelter;
import com.Sheltersapp.Sheltersapp.DTO.RegisterUser;
import com.Sheltersapp.Sheltersapp.DTO.VerifyUser;
import com.Sheltersapp.Sheltersapp.model.Shelter_accounts;
import com.Sheltersapp.Sheltersapp.model.Users;
import com.Sheltersapp.Sheltersapp.response.LoginResponse;
import com.Sheltersapp.Sheltersapp.service.AuthenticationService;
import com.Sheltersapp.Sheltersapp.service.JwtService;
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
    public ResponseEntity<Shelter_accounts> register(@RequestBody RegisterShelter registerShelter) {
        Shelter_accounts registeredShelter = authenticationService.signupShelter(registerShelter);
        return ResponseEntity.ok(registeredShelter);

    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUser loginUserDto){
        Users authenticatedUsers = authenticationService.authenticate(loginUserDto);
        String jwtToken = jwtService.generateToken(authenticatedUsers);
        LoginResponse loginResponse = new LoginResponse(jwtToken, jwtService.getExpirationTime());
        return ResponseEntity.ok(loginResponse);
    }
    @PostMapping("/login-shelter")
    public ResponseEntity<LoginResponse> authenticateShelter(@RequestBody LoginUser loginUserDto){
        Shelter_accounts authenticatedShelter = authenticationService.authenticateShelter(loginUserDto);
        String jwtToken = jwtService.generateToken(authenticatedShelter);
        LoginResponse loginResponse = new LoginResponse(jwtToken, jwtService.getExpirationTime());
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestBody VerifyUser verifyUserDto) {
        try {
            authenticationService.verifyUser(verifyUserDto);
            return ResponseEntity.ok("Account verified successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/verify-shelter")
    public ResponseEntity<?> verifyShelter(@RequestBody VerifyUser verifyUserDto) {
        try {
            authenticationService.verifyShelter(verifyUserDto);
            return ResponseEntity.ok("Account verified successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
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
}
