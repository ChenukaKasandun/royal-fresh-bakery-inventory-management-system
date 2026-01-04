package lk.cckcakesandbakery.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import lk.cckcakesandbakery.entity.OrderStatus;

public interface OrderStatusDao extends JpaRepository<OrderStatus, Integer> {

}
