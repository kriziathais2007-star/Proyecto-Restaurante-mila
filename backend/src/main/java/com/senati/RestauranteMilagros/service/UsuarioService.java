package com.senati.RestauranteMilagros.service;

import com.senati.RestauranteMilagros.entity.Usuario;
import com.senati.RestauranteMilagros.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository){
        this.usuarioRepository = usuarioRepository;
    }
    public List<Usuario> listarTodos(){
        return usuarioRepository.findAll();
    }
    public Usuario crearUsuario(Usuario usuario){
        return usuarioRepository.save(usuario);
    }
    public Usuario actualizarUsuario(Long id, Usuario datosNuevos) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setNombre(datosNuevos.getNombre());
        usuario.setRol(datosNuevos.getRol());
        usuario.setTelefono(datosNuevos.getTelefono());
        usuario.setContrasena(datosNuevos.getContrasena());

        return usuarioRepository.save(usuario);
    }
    public void eliminarUsuario(Long id){
        usuarioRepository.deleteById(id);
    }
}
