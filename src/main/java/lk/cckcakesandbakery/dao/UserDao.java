package lk.cckcakesandbakery.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Query;

import lk.cckcakesandbakery.entity.User;

public interface UserDao extends JpaRepository<User, Integer> {

    // Retrive data according to the username
    @Query(value = "select u from User u where u.username=?1")
    User getByUsername(String username);

    // This is for whena paerticular User or admin logged in to the system their
    // informations should not be visible to themselves as they can edit or delete
    // their own information
    @Query(value = "select u from User u where u.username<> ?1 and u.username <> 'Admin' order by u.id desc")
    List<User> findAll(String username);

}
