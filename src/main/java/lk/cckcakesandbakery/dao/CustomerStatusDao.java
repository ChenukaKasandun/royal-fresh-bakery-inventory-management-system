package lk.cckcakesandbakery.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.cckcakesandbakery.entity.CustomerStatus;

public interface CustomerStatusDao extends JpaRepository<CustomerStatus, Integer> {

}
