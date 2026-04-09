package com.senati.RestauranteMili.repository;

import com.senati.RestauranteMili.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends JpaRepository<Usuario, Long> {

}
