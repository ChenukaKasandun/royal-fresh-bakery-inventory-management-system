package lk.cckcakesandbakery.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import lk.cckcakesandbakery.entity.Supplier;

import java.util.List;

public interface SupplierDao extends JpaRepository<Supplier, Integer> {

    // Request supplier object relevent to particular supplier mobile no for
    // duplicate check
    @Query(value = " Select s from Supplier s  where s.supplier_contact=?1 ")
    Supplier getSupplierByMobileNo(String supplier_contact);

    // Request supplier object relevent to particular supplier email for
    // duplicate check
    @Query(value = " Select s from Supplier s where s.supplier_email=?1 ")
    Supplier getSupplierByEmail(String supplier_email);

    //    Request supplier object relevant to a particular purchase order id   //  p.supplier_id.id ==> in purchase order entity , supplier_id is a foreign key
    //thus if we need to identify the id of that foreign key(supplier object) we need to call it as "p.supplier_id.id"
    @Query(value =" select s from Supplier s where s.id in ( select p.supplier_id.id from PurchaseOrder  p where p.id =?1)")
    public List<Supplier> getSupplierByPoId(Integer poId);
}
