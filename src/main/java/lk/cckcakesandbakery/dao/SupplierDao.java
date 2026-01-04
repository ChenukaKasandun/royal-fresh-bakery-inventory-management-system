package lk.cckcakesandbakery.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import lk.cckcakesandbakery.entity.Supplier;

public interface SupplierDao extends JpaRepository<Supplier, Integer> {

    // Request supplier object relevent to particular supplier mobile no for
    // duplicate check
    @Query(value = " Select s from Supplier s  where s.supplier_contact=?1 ")
    Supplier getSupplierByMobileNo(String supplier_contact);

    // Request supplier object relevent to particular supplier email for
    // duplicate check
    @Query(value = " Select s from Supplier s where s.supplier_email=?1 ")
    Supplier getSupplierByEmail(String supplier_email);

}
