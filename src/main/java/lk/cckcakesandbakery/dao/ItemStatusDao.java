package lk.cckcakesandbakery.dao;

import java.util.List;

import lk.cckcakesandbakery.entity.ItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.cckcakesandbakery.entity.ItemReturnStatus;

public interface ItemStatusDao extends JpaRepository<ItemStatus, Integer> {

    @Query(value = "SELECT i FROM ItemStatus as i where i.id <> 3")
    List<ItemStatus>getStatusById();

}
