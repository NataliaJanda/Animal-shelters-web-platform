package com.Sheltersapp.Sheltersapp.service;

import com.Sheltersapp.Sheltersapp.DTO.LoginUser;
import com.Sheltersapp.Sheltersapp.DTO.RegisterUser;
import com.Sheltersapp.Sheltersapp.DTO.VerifyUser;
import com.Sheltersapp.Sheltersapp.model.Users;
import com.Sheltersapp.Sheltersapp.repository.UserRepository;
import jakarta.mail.MessagingException;
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

    public AuthenticationService(
            UserRepository userRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder,
            EmailService emailService
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public Users signup(RegisterUser input) {
        Users users = new Users(input.getUsername(), input.getEmail(),input.getName(), input.getLastName(), passwordEncoder.encode(input.getPassword()));
        users.setVerificationCode(generateVerificationCode());
        users.setExpired(LocalDateTime.now().plusMinutes(15));
        users.setActivated(false);
        sendVerificationEmail(users);
        return userRepository.save(users);
    }

    public Users authenticate(LoginUser input) {
        Users users = userRepository.findByEmail(input.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!users.isEnabled()) {
            throw new RuntimeException("Account not verified. Please verify your account.");
        }
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getEmail(),
                        input.getPassword()
                )
        );

        return users;
    }

    public void verifyUser(VerifyUser input) {
        Optional<Users> optionalUser = userRepository.findByEmail(input.getEmail());
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

    public void resendVerificationCode(String email) {
        Optional<Users> optionalUser = userRepository.findByEmail(email);
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
            // Handle email sending exception
            e.printStackTrace();
        }
    }
    private String generateVerificationCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }
}
