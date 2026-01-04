package lk.cckcakesandbakery.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.cckcakesandbakery.entity.StockStatus;

public interface StockStatusDao extends JpaRepository<StockStatus, Integer> {

}
