package lk.cckcakesandbakery.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.cckcakesandbakery.entity.DeliveryStatus;

public interface DeliveryStatusDao extends JpaRepository<DeliveryStatus, Integer> {

}
