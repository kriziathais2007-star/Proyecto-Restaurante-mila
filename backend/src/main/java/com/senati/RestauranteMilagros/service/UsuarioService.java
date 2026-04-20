package com.senati.RestauranteMilagros.service;

import com.senati.RestauranteMilagros.entity.Usuario;
import com.senati.RestauranteMilagros.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

import java.util.List;

@Service
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }
    public List<Usuario> listarTodos(){
        return usuarioRepository.findAll();
    }
    public Usuario crearUsuario(Usuario usuario) {
        // Encripta la contraseña antes de guardar
        usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
        return usuarioRepository.save(usuario);
    }
    public Usuario actualizarUsuario(Long id, Usuario datosNuevos) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setNombre(datosNuevos.getNombre());
        usuario.setRol(datosNuevos.getRol());
        usuario.setTelefono(datosNuevos.getTelefono());
        // Solo re-encripta si mandan una contraseña nueva
        if (datosNuevos.getContrasena() != null && !datosNuevos.getContrasena().isBlank()) {
            usuario.setContrasena(passwordEncoder.encode(datosNuevos.getContrasena()));
        }
        return usuarioRepository.save(usuario);
    }
    public void eliminarUsuario(Long id){
        usuarioRepository.deleteById(id);
    }
}
