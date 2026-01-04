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
    @Query(value = "SELECT co.order_no FROM cckcakesandbakery.customer_order as co where co.customer_id = ?1", nativeQuery = true)
    List<String> getOrderNoByCustomerId(Integer customerId); // In here return type is List<String> because one customer
                                                             // can have multiple orders

    // Query to get total price by order no
    @Query(value = "SELECT co.total_price FROM cckcakesandbakery.customer_order as co where co.order_no = ?1", nativeQuery = true)
    String getTotalPriceByOrderNo(String customerOrderNo);

    // Query to get Discounted Price by order no
    @Query(value = "SELECT co.discounted_price FROM cckcakesandbakery.customer_order as co where co.order_no =?1", nativeQuery = true)
    String getDiscountedPriceByOrderNo(String customerOrderNo);

}
