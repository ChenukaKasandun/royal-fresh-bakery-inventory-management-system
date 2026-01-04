package lk.cckcakesandbakery.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.cckcakesandbakery.entity.CustomerTypes;

public interface CustomerTypeDao extends JpaRepository<CustomerTypes, Integer> {

}
