package lk.cckcakesandbakery.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.cckcakesandbakery.entity.ProductionSession;

public interface ProductionSessionDao extends JpaRepository<ProductionSession, Integer> {

}
