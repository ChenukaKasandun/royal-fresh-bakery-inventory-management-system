package lk.cckcakesandbakery.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import jakarta.persistence.*;

import jakarta.persistence.GenerationType;
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

// Association table   In Here, "cascade = CascadeType.ALL" should be essential to save data into association table
//"orphanRemoval = true" should be essential to remove data from the association table
    @OneToMany(mappedBy = "customer_order_id", cascade = CascadeType.ALL , orphanRemoval = true)
   private List<CustomerOrderHasItem> customerOrderHasItemList;



}
