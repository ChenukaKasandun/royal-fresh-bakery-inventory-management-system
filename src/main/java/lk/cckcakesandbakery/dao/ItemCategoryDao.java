package lk.cckcakesandbakery.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.cckcakesandbakery.entity.ItemCategory;

public interface ItemCategoryDao extends JpaRepository<ItemCategory, Integer> {

}
