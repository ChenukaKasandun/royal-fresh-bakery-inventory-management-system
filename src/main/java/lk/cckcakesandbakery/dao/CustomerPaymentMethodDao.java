package lk.cckcakesandbakery.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.cckcakesandbakery.entity.CustomerPaymentMethod;

public interface CustomerPaymentMethodDao extends JpaRepository<CustomerPaymentMethod, Integer> {

}
