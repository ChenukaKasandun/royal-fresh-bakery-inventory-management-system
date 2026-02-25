package lk.cckcakesandbakery.dao;

import lk.cckcakesandbakery.entity.ReturnItems;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ReturnItemDao extends JpaRepository<ReturnItems, Integer> {


    @Query(value = "SELECT r.total_returning_price FROM ReturnItems r where r.invoice_id.id =?1")
    Double getTotalReturningPrice(Integer invoice_id);
}
