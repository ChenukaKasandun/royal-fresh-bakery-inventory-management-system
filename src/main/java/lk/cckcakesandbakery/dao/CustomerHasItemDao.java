package lk.cckcakesandbakery.dao;

import lk.cckcakesandbakery.entity.CustomerHasItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CustomerHasItemDao extends JpaRepository<CustomerHasItem,Integer> {


//    Getting Customer Has Item Data by giving customer id
    @Query(value = "SELECT chi FROM CustomerHasItem chi where chi.customer_id.id =?1")
    List<CustomerHasItem> findCustomerItemByCustomerId(Integer customerid);
}
