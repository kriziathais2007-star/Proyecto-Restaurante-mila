package com.senati.RestauranteMili.service;
import com.senati.RestauranteMili.entity.Usuario;
import com.senati.RestauranteMili.repository.ClienteRepository;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class ClienteService {
    private final ClienteRepository clienteRepository;
    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }
    public List<Usuario> listarTodos(){
        return clienteRepository.findAll();
    }
    public void eliminarUsuario(Long id){
        clienteRepository.deleteById(id);
    };
}
