package lk.cckcakesandbakery.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.cckcakesandbakery.entity.SupplierRegStatus;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SupplierStatuSDao extends JpaRepository<SupplierRegStatus, Integer> {


//Query to retrive supplier status other than "Delete"
@Query( value = "SELECT s FROM SupplierRegStatus as s where s.status !='Deleted'")
List<SupplierRegStatus> findAllStatusExceptDelete();
}
