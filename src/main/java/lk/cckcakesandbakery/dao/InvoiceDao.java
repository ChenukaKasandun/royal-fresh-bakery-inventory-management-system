package lk.cckcakesandbakery.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.cckcakesandbakery.entity.Invoice;

public interface InvoiceDao extends JpaRepository<Invoice, Integer> {

    // Generate Next Invoice No
    @Query(value = "SELECT CONCAT('INV', LPAD(COALESCE(MAX(CAST(SUBSTRING(invoice_no, 4) AS UNSIGNED)), 0) + 1, 3, '0')) AS next_invoice_no FROM cckcakesandbakery.invoice;", nativeQuery = true)

    String getNextInvoiceNo();

    // Get Invoice No by Customer ID
    @Query(value = "SELECT * FROM cckcakesandbakery.invoice as i where i.customer_order_id in ( SELECT co.id FROM cckcakesandbakery.customer_order as co where co.customer_id = ?1);", nativeQuery = true)
    List<Invoice> getInvoiceByCustomerId(Integer customerId);

    @Query(value = "SELECT * FROM cckcakesandbakery.invoice as i where i.invoice_no =?1", nativeQuery = true)
    Invoice getByInvoiceNo(String invoice_no);

    @Query(value = "SELECT * FROM cckcakesandbakery.invoice as i where i.production_session_id =?2 and i.customer_order_id in (SELECT co.id FROM cckcakesandbakery.customer_order as co where co.customer_id =?1);", nativeQuery = true)
    List<Invoice> getInvoiceByCustomerIdAndSessionId(Integer customerId, Integer sessionId );


    @Query(value = "SELECT i.total_price FROM Invoice  i where i.invoice_no =?1")
    Double getTotalPriceByInvoiceNo(String invoice_no);


    @Query(value = "SELECT i.discount_price FROM Invoice  i where i.invoice_no =?1")
    Double getDiscountedPriceByInvoiceNo(String invoice_no);
}
