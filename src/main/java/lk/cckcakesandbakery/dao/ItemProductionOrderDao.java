package lk.cckcakesandbakery.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.cckcakesandbakery.entity.ItemProductionOrder;

public interface ItemProductionOrderDao extends JpaRepository<ItemProductionOrder, Integer> {

    @Query(value = "SELECT CONCAT('PODR', LPAD(COALESCE(MAX(CAST(SUBSTRING(i.production_order_no, 5) AS UNSIGNED)), 0) + 1, 3, '0')) AS next_production_order_no FROM cckcakesandbakery.item_production_order as i", nativeQuery = true)
    String getNextProductionOrderNo();

}
