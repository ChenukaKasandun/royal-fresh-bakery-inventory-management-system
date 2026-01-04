package lk.cckcakesandbakery.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.cckcakesandbakery.entity.Role;

public interface RoleDao extends JpaRepository<Role, Integer> {

    // Query to get roles other than "Admin" to te font end checkboxes
    @Query(value = "Select r from Role r where r.name <> 'Admin'")
    List<Role> findAllWithoutAdmin(String name);

}
