package lk.cckcakesandbakery.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.cckcakesandbakery.entity.InvoiceStatus;

public interface InvoiceStatusDao extends JpaRepository<InvoiceStatus, Integer> {

}
