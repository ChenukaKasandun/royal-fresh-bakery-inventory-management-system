package lk.cckcakesandbakery.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import lk.cckcakesandbakery.entity.Employee;

public interface EmployeeDao extends JpaRepository<Employee, Integer> {

    // Query to auto increment the emp_no from the database
    @Query(value = "SELECT lpad(max(e.emp_no) + 1 , 8 , 0) FROM cckcakesandbakery.employee as e;", nativeQuery = true)
    String getNextEmpNo();// The result of above query fall into the body of this method automatically

    // For NIC
    @Query(value = "select e from Employee e where e.nic=?1") // This is not native query.This is called JPA query which
                                                              // follows ORM. For example in this, e --> all (*)
                                                              // Employee e --> employee table in data base
    Employee getByNIC(String nic);

    // For Email
    @Query(value = "select e from Employee e where e.email=:email") // Secpond way of writing the above query using
                                                                    // @Param annotation
    Employee getByEmail(@Param("email") String email);

    // For Mobile
    @Query(value = "select e from Employee e where e.mobileno =?1")

    Employee getByMobile(String mobileno);

    // List employee without user account
    @Query(value = "SELECT * FROM cckcakesandbakery.employee as e where e.id not in (select u.employee_id FROM cckcakesandbakery.user as u where u.employee_id is not null)", nativeQuery = true)

    List<Employee> listWithoutUserAccount();

}
