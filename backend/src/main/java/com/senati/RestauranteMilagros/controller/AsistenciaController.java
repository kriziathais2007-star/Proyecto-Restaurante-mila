package com.senati.RestauranteMilagros.controller;

import com.senati.RestauranteMilagros.entity.Asistencia;
import com.senati.RestauranteMilagros.service.AsistenciaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/asistencia")
@CrossOrigin(origins = "*")
public class AsistenciaController {
    private final AsistenciaService asistenciaService;

    public AsistenciaController(AsistenciaService asistenciaService) {
        this.asistenciaService = asistenciaService;
    }

    @GetMapping("/hoy")
    public List<Asistencia> listarHoy() {
        return asistenciaService.listarHoy();
    }

    @PostMapping("/entrada/{usuarioId}")
    public ResponseEntity<Asistencia> entrada(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(asistenciaService.marcarEntrada(usuarioId));
    }

    @PutMapping("/salida/{usuarioId}")
    public ResponseEntity<Asistencia> salida(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(asistenciaService.marcarSalida(usuarioId));
    }
}
