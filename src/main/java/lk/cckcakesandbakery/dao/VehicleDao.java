package lk.cckcakesandbakery.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.cckcakesandbakery.entity.Vehicle;

public interface VehicleDao extends JpaRepository<Vehicle, Integer> {

}
