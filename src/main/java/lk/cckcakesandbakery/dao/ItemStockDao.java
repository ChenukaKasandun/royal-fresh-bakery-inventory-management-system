package lk.cckcakesandbakery.dao;

import lk.cckcakesandbakery.entity.ItemStock;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemStockDao extends JpaRepository<ItemStock,Integer> {
}
