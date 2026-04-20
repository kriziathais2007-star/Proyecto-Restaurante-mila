package com.senati.RestauranteMilagros.controller;

import com.senati.RestauranteMilagros.entity.Usuario;
import com.senati.RestauranteMilagros.repository.UsuarioRepository;
import com.senati.RestauranteMilagros.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UsuarioRepository usuarioRepository;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          UsuarioRepository usuarioRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            body.get("nombre"),
                            body.get("contrasena")
                    )
            );

            Usuario u = usuarioRepository.findByNombre(body.get("nombre"))
                    .orElseThrow();

            String token = jwtUtil.generateToken(u.getNombre(), u.getRol().name());

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "rol", u.getRol().name(),
                    "nombre", u.getNombre()
            ));

        } catch (Exception e) {
            e.printStackTrace(); // ← agrega esta línea
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Usuario o contraseña incorrectos"));
        }
    }
}
