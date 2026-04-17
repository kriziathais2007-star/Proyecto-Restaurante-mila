package com.senati.RestauranteMili.controller;


import com.senati.RestauranteMili.entity.Usuario;
import com.senati.RestauranteMili.service.ClienteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/usuarios")
@CrossOrigin(origins = "*")
public class ClienteController {
    private final ClienteService clienteService;
    public ClienteController(ClienteService clienteService){
        this.clienteService = clienteService;
    }
    @GetMapping
    public List<Usuario> listar() {
        return clienteService.listarTodos();
    }
    @PostMapping
    public ResponseEntity<Usuario> crear(@RequestBody Usuario usuario){
        return ResponseEntity.ok(clienteService.crearUsuario(usuario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id){
        clienteService.eliminarUsuario(id);
        return ResponseEntity.noContent().build();
    }
}
