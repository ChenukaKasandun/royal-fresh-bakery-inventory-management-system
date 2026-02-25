package lk.cckcakesandbakery.dao;

import lk.cckcakesandbakery.entity.CustomerHasItem;
import lk.cckcakesandbakery.entity.InvoiceHasItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface InvoiceHaItemDao extends JpaRepository<InvoiceHasItem,Integer> {


//    Getting Invoice Has Item Data by giving InvoiceId
    @Query(value = "SELECT ihi FROM InvoiceHasItem  ihi where ihi.invoice_id.id=?1")
    List<InvoiceHasItem> findInvoiceHaItemByInvoiceId(Integer invoiceId);
}
