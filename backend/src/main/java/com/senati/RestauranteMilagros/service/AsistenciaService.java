package com.senati.RestauranteMilagros.service;

import com.senati.RestauranteMilagros.entity.Asistencia;
import com.senati.RestauranteMilagros.entity.Usuario;
import com.senati.RestauranteMilagros.repository.AsistenciaRepository;
import com.senati.RestauranteMilagros.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class AsistenciaService {
    // ── Cambia esta hora según tu horario ──
    private static final LocalTime HORA_LIMITE = LocalTime.of(7, 10);

    private final AsistenciaRepository asistenciaRepository;
    private final UsuarioRepository usuarioRepository;

    public AsistenciaService(AsistenciaRepository asistenciaRepository,
                             UsuarioRepository usuarioRepository) {
        this.asistenciaRepository = asistenciaRepository;
        this.usuarioRepository    = usuarioRepository;
    }

    public List<Asistencia> listarHoy() {
        return asistenciaRepository.findByFecha(LocalDate.now());
    }

    public Asistencia marcarEntrada(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        LocalDate hoy   = LocalDate.now();
        LocalTime ahora = LocalTime.now();

        // Si ya marcó entrada hoy, devuelve la existente sin duplicar
        return asistenciaRepository.findByUsuarioIdAndFecha(usuarioId, hoy)
                .orElseGet(() -> {
                    Asistencia a = new Asistencia();
                    a.setUsuario(usuario);
                    a.setFecha(hoy);
                    a.setHoraEntrada(ahora);
                    a.setEstado(ahora.isAfter(HORA_LIMITE)
                            ? Asistencia.Estado.tarde
                            : Asistencia.Estado.asistio);
                    return asistenciaRepository.save(a);
                });
    }

    public Asistencia marcarSalida(Long usuarioId) {
        Asistencia a = asistenciaRepository
                .findByUsuarioIdAndFecha(usuarioId, LocalDate.now())
                .orElseThrow(() -> new RuntimeException("No hay entrada registrada hoy"));
        a.setHoraSalida(LocalDateTime.now());
        return asistenciaRepository.save(a);
    }
}
