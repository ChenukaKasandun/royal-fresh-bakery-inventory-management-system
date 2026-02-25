package lk.cckcakesandbakery.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.cckcakesandbakery.entity.Customer;

public interface CustomerDao extends JpaRepository<Customer, Integer> {

    // Query To generate next customer reg no
    @Query(value = "SELECT CONCAT('CTM', LPAD(CAST(SUBSTRING(MAX(c.reg_no), 4) AS UNSIGNED) + 1, LENGTH(SUBSTRING(MAX(c.reg_no), 4)), '0')) AS next_reg_no FROM cckcakesandbakery.customer AS c;", nativeQuery = true)
    String getNextCustomerRegNo();

    // Query to get customer id by customer name
    @Query(value = "SELECT c.id FROM cckcakesandbakery.customer as c where c.name = ?1 ;", nativeQuery = true)
    Integer getCustomerIdByName(String customerName); // In here return type is Integer because customer name is
                                                      // unique(Customer_id is a Integer)
    // Request customer object relevent to particular customer mobile no for
    // duplicate check
    @Query(value = " Select c from Customer c where c.mobileno=?1 ")
    Customer getCustomerByMobileNo(String mobileno);

    // Request customer object relevent to particular customer email for
    // duplicate check
    @Query(value = " Select c from Customer c where c.email=?1 ")
    Customer getCustomerByEmail(String email);

    @Query(value = "SELECT * FROM cckcakesandbakery.customer as c where c.customer_type_id=?1 ", nativeQuery = true)
    List<Customer> getCustomerByType(Integer customer_type_id);

    @Query(value = "SELECT * FROM cckcakesandbakery.customer as c where c.id in (SELECT co.customer_id FROM cckcakesandbakery.customer_order as co where co.customer_order_type_id = 2)", nativeQuery = true)
    List<Customer> getByShopCustomerAndHaveOrder();


    @Query(value = "SELECT * FROM cckcakesandbakery.customer as c where c.id in (SELECT co.customer_id FROM cckcakesandbakery.customer_order as co where co.customer_order_type_id = 1)", nativeQuery = true)
    List<Customer> getByIndividualCustomerAndHaveOrder();

    @Query(value = "SELECT * FROM cckcakesandbakery.customer as c where c.id IN(SELECT co.customer_id FROM cckcakesandbakery.customer_order as co where co.customer_order_type_id = \"2\" and co.id IN (SELECT i.customer_order_id FROM cckcakesandbakery.invoice as i));" , nativeQuery = true)
    List<Customer> getByShopCustomerOrderAndHaveInvoice();

    @Query(value = "SELECT * FROM cckcakesandbakery.customer as c where c.id in (SELECT co.customer_id FROM cckcakesandbakery.customer_order as co where co.customer_order_type_id = \"1\" and co.id In(SELECT i.customer_order_id FROM cckcakesandbakery.invoice as i));" , nativeQuery = true)
    List <Customer> getByIndividualCustomerOrderAndHaveInvoice();

}
