package lk.cckcakesandbakery.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.cckcakesandbakery.entity.VehicleStatus;

public interface VehicleStatusDao extends JpaRepository<VehicleStatus, Integer> {

}
