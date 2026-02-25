package lk.cckcakesandbakery.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.cckcakesandbakery.entity.CustomerOrder;

public interface CustomerOrderDao extends JpaRepository<CustomerOrder, Integer> {

    // Query To generate next order no
    @Query(value = "SELECT CONCAT('ODR', LPAD(COALESCE(MAX(CAST(SUBSTRING(c.order_no, 4) AS UNSIGNED)), 0) + 1, 3, '0')) AS next_order_no FROM cckcakesandbakery.customer_order as c;", nativeQuery = true)
    String getNextOrderNo();

    // Query to get order no by customer id
    @Query(value = "SELECT co FROM CustomerOrder as co where co.customer_id.id = ?1")
    List<CustomerOrder> getCustomerOrderByCustomerId(Integer customerId);

    @Query(value = "SELECT co.total_price FROM cckcakesandbakery.customer_order as co where co.id in(SELECT i.customer_order_id FROM cckcakesandbakery.invoice as i where i.invoice_no =?1);" , nativeQuery = true)
    Double getTotalPriceByInvoice(String invoiceNo);

    @Query(value = "SELECT co.discounted_price FROM cckcakesandbakery.customer_order as co where co.id in(SELECT i.customer_order_id FROM cckcakesandbakery.invoice as i where i.invoice_no =?1)" ,nativeQuery = true)
    Double getDiscountedPriceByInvoice(String invoiceNo);

    @Query(value = "SELECT co.advanced_payment FROM cckcakesandbakery.customer_order as co where co.id in(SELECT i.customer_order_id FROM cckcakesandbakery.invoice as i where i.invoice_no =?1)" ,nativeQuery = true)
    Double getAdvancedPaymentByInvoice(String invoiceNo);

    @Query(value ="SELECT co.total_price FROM CustomerOrder co where co.id =?1")
    Double getTotalPriceByCustomerOrderId(Integer customerOrderId);


    @Query(value ="SELECT co.discounted_price FROM CustomerOrder co where co.id =?1")
    Double getDiscountedPriceByCustomerOrderId(Integer customerOrderId);

}
