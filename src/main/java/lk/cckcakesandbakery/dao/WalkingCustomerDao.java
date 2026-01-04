package lk.cckcakesandbakery.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.cckcakesandbakery.entity.WalkingCustomer;

public interface WalkingCustomerDao extends JpaRepository<WalkingCustomer, Integer> {

}
