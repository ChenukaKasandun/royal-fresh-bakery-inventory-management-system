package lk.cckcakesandbakery.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.cckcakesandbakery.entity.ItemPrice;

public interface ItemPriceDao extends JpaRepository<ItemPrice, Integer> {

    // Query to request item id from the data base for dupplicate check the item at
    // front end
    @Query(value = "SELECT * FROM cckcakesandbakery.item_price as ip where ip.item_id=?1", nativeQuery = true)
    ItemPrice getByItem_id(Integer Item_id);

}
