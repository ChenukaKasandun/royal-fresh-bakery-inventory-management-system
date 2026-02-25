package lk.cckcakesandbakery.dao;

import lk.cckcakesandbakery.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import lk.cckcakesandbakery.entity.CustomerStatus;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CustomerStatusDao extends JpaRepository<CustomerStatus, Integer> {


    // For retriving customer status other than "Deleted"
    @Query(value = "SELECT cs FROM CustomerStatus cs where cs.status != 'Deleted'")
    List<CustomerStatus> getByCustomerStatus();

}
