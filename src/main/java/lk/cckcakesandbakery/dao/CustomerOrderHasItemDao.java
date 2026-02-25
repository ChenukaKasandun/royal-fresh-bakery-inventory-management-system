package lk.cckcakesandbakery.dao;

import lk.cckcakesandbakery.entity.CustomerHasItem;
import lk.cckcakesandbakery.entity.CustomerOrderHasItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CustomerOrderHasItemDao extends JpaRepository<CustomerOrderHasItem,Integer> {


//    Getting Customer Order Has Item Data by giving customer id
    @Query(value = "SELECT cohi FROM CustomerOrderHasItem as cohi where cohi.customer_order_id.id =?1")
    List<CustomerOrderHasItem> findCustomerOrderHasItemByCustomerId(Integer customerorderid);

    @Query(value = "SELECT * FROM cckcakesandbakery.customer_order_has_item as cohi where cohi.customer_order_id in(SELECT i.customer_order_id FROM cckcakesandbakery.invoice  as i where i.invoice_no =?1)", nativeQuery = true)
    List<CustomerOrderHasItem> findCustomerOrderHasItemByInvoiceNo(String invoiceno);

    @Query(value = "SELECT * FROM cckcakesandbakery.customer_order_has_item as cohi where cohi.customer_order_id =?2 and cohi.production_session_id =?1" , nativeQuery = true)
    List<CustomerOrderHasItem> findCustomerOrderHasItemByProductionSessionIdAndOrderId(Integer sessionId,Integer customerOrderId);
}
