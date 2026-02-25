package lk.cckcakesandbakery.dao;

import lk.cckcakesandbakery.entity.PurchaseOrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PurchaseOrderStatusDao extends JpaRepository<PurchaseOrderStatus,Integer> {


    //Retriving purchase ordeer statuses except "Delete"
    @Query(value = "SELECT p FROM PurchaseOrderStatus p where p.name != 'Deleted'")
    List<PurchaseOrderStatus> FindPurchaseOrderStatusExceptDelete();
}
