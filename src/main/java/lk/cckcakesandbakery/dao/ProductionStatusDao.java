package lk.cckcakesandbakery.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.cckcakesandbakery.entity.ProductionStatus;

public interface ProductionStatusDao extends JpaRepository<ProductionStatus, Integer> {

}
