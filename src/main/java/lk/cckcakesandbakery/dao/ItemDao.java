package lk.cckcakesandbakery.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.cckcakesandbakery.entity.Item;

public interface ItemDao extends JpaRepository<Item, Integer> {

    // Auto generate next item code
    @Query(value = "SELECT CONCAT('ITM', LPAD(SUBSTRING(MAX(i.item_code), 4) + 1, 3, '0')) AS next_item_code FROM cckcakesandbakery.item as i;", nativeQuery = true)
    String getNextItemCode();

    // Query to request item object with entered item name for duplicate check
    @Query(value = "SELECT i FROM Item i where i.item_name =?1")
    Item getByName(String item_name);

    // Query to get Raw material price by item Name
    @Query(value = "SELECT i.raw_material_cost FROM cckcakesandbakery.item  as i  where i.item_name =?1 ", nativeQuery = true)
    List<String> getRawMaterialCostByItemName(String item_name);


    @Query(value = "SELECT i FROM Item as i where i.item_status_id.id =?1")
    List<Item> getByItemStatusId(Integer returnItemStatus);




}
