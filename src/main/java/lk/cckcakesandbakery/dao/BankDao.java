package lk.cckcakesandbakery.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.cckcakesandbakery.entity.Bank;

public interface BankDao extends JpaRepository<Bank, Integer> {

}
