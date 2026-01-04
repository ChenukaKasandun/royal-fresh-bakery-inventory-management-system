package lk.cckcakesandbakery.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.cckcakesandbakery.entity.Branch;

public interface BranchDao extends JpaRepository<Branch, Integer> {

}
