package lk.cckcakesandbakery.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.cckcakesandbakery.entity.ItemProductionOrderStatus;

public interface ProductionOrderStatusDao extends JpaRepository<ItemProductionOrderStatus, Integer> {

}
