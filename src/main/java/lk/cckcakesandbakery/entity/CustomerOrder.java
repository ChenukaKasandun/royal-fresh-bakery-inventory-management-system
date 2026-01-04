package lk.cckcakesandbakery.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import jakarta.persistence.CascadeType;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;

import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "customer_order")

@Data
@AllArgsConstructor
@NoArgsConstructor

public class CustomerOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String order_no;

    private BigDecimal total_price;

    private BigDecimal discounted_price;

    private BigDecimal discount_ratio;

    private BigDecimal advanced_payment;

    private BigDecimal due_payment;

    private String note;

    private LocalDate required_date;

    private LocalTime required_time;

    private String required_address;

    private LocalDate from_date;

    private LocalDate to_date;

    @NotNull
    private LocalDateTime added_date_time;

    private LocalDateTime update_date_time;

    private LocalDateTime delete_date_time;

    @NotNull
    private Integer add_user_id;

    private Integer update_user_id;

    private Integer delete_user_id;

    @ManyToOne
    @JoinColumn(name = "customer_order_status_id", referencedColumnName = "id")
    private OrderStatus customer_order_status_id;

    @ManyToOne
    @JoinColumn(name = "production_session_id", referencedColumnName = "id")
    private ProductionSession production_session_id;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    private Customer customer_id;

    @ManyToOne
    @JoinColumn(name = "vehicle_route_id", referencedColumnName = "id")
    private VehicleRoute vehicle_route_id;

    @ManyToOne
    @JoinColumn(name = "customer_order_type_id", referencedColumnName = "id")
    private CustomerOrderType customer_order_type_id;

    @ManyToOne
    @JoinColumn(name = "customer_order_nature_id", referencedColumnName = "id")
    private CustomerOrderNature customer_order_nature_id;

    @ManyToOne
    @JoinColumn(name = "collection_method_id", referencedColumnName = "id")
    private OrderCollectionMethod collection_method_id;

}
