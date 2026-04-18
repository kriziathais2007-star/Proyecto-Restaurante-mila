package com.senati.RestauranteMili.service;

import com.senati.RestauranteMili.entity.Usuario;
import com.senati.RestauranteMili.repository.UsuarioRepository;
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
    public void eliminarUsuario(Long id){
        usuarioRepository.deleteById(id);
    }
}
