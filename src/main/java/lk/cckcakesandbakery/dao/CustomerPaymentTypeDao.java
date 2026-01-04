package lk.cckcakesandbakery.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.cckcakesandbakery.entity.CustomerPaymentType;

public interface CustomerPaymentTypeDao extends JpaRepository<CustomerPaymentType, Integer> {

}
