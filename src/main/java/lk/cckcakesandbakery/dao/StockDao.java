package lk.cckcakesandbakery.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.cckcakesandbakery.entity.stock;

public interface StockDao extends JpaRepository<stock, Integer> {

}
