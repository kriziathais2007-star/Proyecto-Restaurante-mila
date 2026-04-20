package com.senati.RestauranteMilagros.service;

import com.senati.RestauranteMilagros.entity.Plato;
import com.senati.RestauranteMilagros.repository.PlatoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlatoService {
    private final PlatoRepository platoRepository;

    public PlatoService(PlatoRepository platoRepository) {
        this.platoRepository = platoRepository;
    }

    public List<Plato> listarTodos() {
        return platoRepository.findAll();
    }

    public Plato crearPlato(Plato plato) {
        return platoRepository.save(plato);
    }

    public void eliminarPlato(Long id) {
        platoRepository.deleteById(id);
    }
}
