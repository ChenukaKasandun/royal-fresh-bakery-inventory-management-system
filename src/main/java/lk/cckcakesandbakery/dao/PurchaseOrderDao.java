package lk.cckcakesandbakery.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.cckcakesandbakery.entity.PurchaseOrder;

public interface PurchaseOrderDao extends JpaRepository<PurchaseOrder, Integer> {

    @Query(value = "SELECT CONCAT('PO_', LPAD(COALESCE(MAX(CAST(SUBSTRING(p.order_no, 4) AS UNSIGNED)), 0) + 1, 3, '0')) AS next_order_no FROM cckcakesandbakery.purchase_order AS p;", nativeQuery = true)
    String getNextOrderNo();// The result of above query fall into the body of this method automatically

}
