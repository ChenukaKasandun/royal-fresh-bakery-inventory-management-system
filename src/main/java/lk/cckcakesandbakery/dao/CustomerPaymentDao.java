package lk.cckcakesandbakery.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.cckcakesandbakery.entity.CustomerPayment;

public interface CustomerPaymentDao extends JpaRepository<CustomerPayment, Integer> {

}
