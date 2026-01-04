package lk.cckcakesandbakery.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.cckcakesandbakery.entity.CustomerOrderType;

public interface CustomerOrderTypeDao extends JpaRepository<CustomerOrderType, Integer> {

}
