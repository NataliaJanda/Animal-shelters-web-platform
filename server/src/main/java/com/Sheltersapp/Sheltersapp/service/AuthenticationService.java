package com.Sheltersapp.Sheltersapp.service;

import com.Sheltersapp.Sheltersapp.DTO.LoginUser;
import com.Sheltersapp.Sheltersapp.DTO.RegisterShelter;
import com.Sheltersapp.Sheltersapp.DTO.RegisterUser;
import com.Sheltersapp.Sheltersapp.DTO.VerifyUser;
import com.Sheltersapp.Sheltersapp.model.Role;
import com.Sheltersapp.Sheltersapp.model.Shelter;
import com.Sheltersapp.Sheltersapp.model.Shelter_accounts;
import com.Sheltersapp.Sheltersapp.model.Users;
import com.Sheltersapp.Sheltersapp.repository.ShelterAccountsRepository;
import com.Sheltersapp.Sheltersapp.repository.ShelterRepository;
import com.Sheltersapp.Sheltersapp.repository.UserRepository;
import jakarta.mail.MessagingException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final ShelterAccountsRepository ShelterAccountsRepository;
    private final ShelterRepository shelterRepository;

    public AuthenticationService(
            UserRepository userRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder,
            EmailService emailService, ShelterAccountsRepository ShelterAccountsRepository, ShelterRepository shelterRepository
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.ShelterAccountsRepository = ShelterAccountsRepository;
        this.shelterRepository = shelterRepository;
    }

    public Users signup(RegisterUser input) {
        Users users = new Users(input.getUsername(), input.getEmail(),input.getName(), input.getLastName(), passwordEncoder.encode(input.getPassword()));
        users.setVerificationCode(generateVerificationCode());
        users.setExpired(LocalDateTime.now().plusMinutes(15));
        users.setActivated(false);
        users.setRole(Role.USER);
        sendVerificationEmail(users);
        return userRepository.save(users);
    }

    public ResponseEntity<?> signupShelter(RegisterShelter input) throws Exception {
        GusService gusService = new GusService();

        if (!gusService.verifyRegonExists(input.getRegon())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Nie znaleziono schroniska o podanym numerze REGON w bazie GUS");
        }

        Shelter shelter = new Shelter(input.getUsername(), input.getAddress(), input.getCommune(),
                input.getPost_code(), input.getTown(), input.getCounty(),
                input.getReal_estate_number(), input.getRegon(), input.getVoivodeship());

        Shelter_accounts shelter_accounts = new Shelter_accounts(input.getUsername(), input.getName(),
                input.getLast_name(), input.getEmail(), input.getPhone_number(),
                passwordEncoder.encode(input.getPassword()));

        shelter_accounts.setShelter_id(shelter);
        shelter_accounts.setVerificationCode(generateVerificationCode());
        shelter_accounts.setExpired(LocalDateTime.now().plusMinutes(15));
        shelter_accounts.setActivated(false);
        shelter_accounts.setRole(Role.SHELTER);

        shelterRepository.save(shelter);
        ShelterAccountsRepository.save(shelter_accounts);

        return ResponseEntity.ok(shelter_accounts);
    }



    public Users authenticate(LoginUser input) {
        Users users = userRepository.findByUsername(input.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!users.isEnabled()) {
            throw new RuntimeException("Account not verified. Please verify your account.");
        }
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getUsername(),
                        input.getPassword()
                )
        );

        return users;
    }

    public Shelter_accounts authenticateShelter(LoginUser input) {
        Shelter_accounts shelter_accounts = ShelterAccountsRepository.findByUsername(input.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!shelter_accounts.isEnabled()) {
            throw new RuntimeException("Account not verified. Please verify your account.");
        }
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getUsername(),
                        input.getPassword()
                )
        );

        return shelter_accounts;
    }

    public void verifyUser(VerifyUser input) {
        Optional<Users> optionalUser = userRepository.findByUsername(input.getUsername());
        if (optionalUser.isPresent()) {
            Users users = optionalUser.get();
            if (users.getExpired().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Verification code has expired");
            }
            if (users.getVerificationCode().equals(input.getVerificationCode())) {
                users.setActivated(true);
                users.setVerificationCode(null);
                users.setExpired(null);
                userRepository.save(users);
            } else {
                throw new RuntimeException("Invalid verification code");
            }
        } else {
            throw new RuntimeException("User not found");
        }
    }
    public void verifyShelter(VerifyUser input) {
        Optional<Shelter_accounts> optionalShelterAccounts = ShelterAccountsRepository.findByUsername(input.getUsername());
        if (optionalShelterAccounts.isPresent()) {
            Shelter_accounts shelter_accounts = optionalShelterAccounts.get();
            if (shelter_accounts.getExpired().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Verification code has expired");
            }
            if (shelter_accounts.getVerificationCode().equals(input.getVerificationCode())) {
                shelter_accounts.setActivated(true);
                shelter_accounts.setVerificationCode(null);
                shelter_accounts.setExpired(null);
                ShelterAccountsRepository.save(shelter_accounts);
            }
            else {
                throw new RuntimeException("Invalid verification code");
            }
        } else {
            throw new RuntimeException("Shelter not found");
        }
    }

    public void resendVerificationCode(String email) {
        Optional<Users> optionalUser = userRepository.findByUsername(email);
        if (optionalUser.isPresent()) {
            Users users = optionalUser.get();
            if (users.isEnabled()) {
                throw new RuntimeException("Account is already verified");
            }
            users.setVerificationCode(generateVerificationCode());
            users.setExpired(LocalDateTime.now().plusHours(1));
            sendVerificationEmail(users);
            userRepository.save(users);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    private void sendVerificationEmail(Users users) {
        String subject = "Account Verification";
        String verificationCode = "VERIFICATION CODE " + users.getVerificationCode();
        String htmlMessage = "<html>"
                + "<body style=\"font-family: Arial, sans-serif;\">"
                + "<div style=\"background-color: #f5f5f5; padding: 20px;\">"
                + "<h2 style=\"color: #333;\">Welcome to our app!</h2>"
                + "<p style=\"font-size: 16px;\">Please enter the verification code below to continue:</p>"
                + "<div style=\"background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
                + "<h3 style=\"color: #333;\">Verification Code:</h3>"
                + "<p style=\"font-size: 18px; font-weight: bold; color: #007bff;\">" + verificationCode + "</p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";

        try {
            emailService.sendVerificationEmail(users.getEmail(), subject, htmlMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
    private void sendVerificationEmailForShelter(Shelter_accounts shelter_accounts) {
        String subject = "Account Verification";
        String verificationCode = "VERIFICATION CODE " + shelter_accounts.getVerificationCode();
        String htmlMessage = "<html>"
                + "<body style=\"font-family: Arial, sans-serif;\">"
                + "<div style=\"background-color: #f5f5f5; padding: 20px;\">"
                + "<h2 style=\"color: #333;\">Welcome to our app!</h2>"
                + "<p style=\"font-size: 16px;\">Please enter the verification code below to continue:</p>"
                + "<div style=\"background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
                + "<h3 style=\"color: #333;\">Verification Code:</h3>"
                + "<p style=\"font-size: 18px; font-weight: bold; color: #007bff;\">" + verificationCode + "</p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";

        try {
            emailService.sendVerificationEmail(shelter_accounts.getEmail(), subject, htmlMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
    private String generateVerificationCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }
}
