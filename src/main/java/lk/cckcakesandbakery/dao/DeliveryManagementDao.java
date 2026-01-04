package lk.cckcakesandbakery.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.cckcakesandbakery.entity.DeliveryManagement;

public interface DeliveryManagementDao extends JpaRepository<DeliveryManagement, Integer> {

    @Query(value = "SELECT  concat('DLV' ,coalesce(lpad(substring((max(d.deliver_no)),4) + 1,3,'0') ,0)) FROM cckcakesandbakery.delivery_management as d;", nativeQuery = true)
    String getNextDeliveryNo();

    // Select from the same Delivery no
    @Query(value = "SELECT d FROM DeliveryManagement as d where d.deliver_no =?1")
    DeliveryManagement getByDeliveryNo(String deliver_no);

}
