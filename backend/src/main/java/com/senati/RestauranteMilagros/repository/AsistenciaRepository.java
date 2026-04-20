package com.senati.RestauranteMilagros.repository;

import com.senati.RestauranteMilagros.entity.Asistencia;
import com.senati.RestauranteMilagros.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {
    List<Asistencia> findByFecha(LocalDate fecha);
    Optional<Asistencia> findByUsuarioIdAndFecha(Long usuarioId, LocalDate fecha);
}
