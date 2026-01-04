package lk.cckcakesandbakery.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
@Table(name = "item_production_order")

@Data
@AllArgsConstructor
@NoArgsConstructor

public class ItemProductionOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private LocalDate production_date;

    private String production_order_no;

    private LocalDate from_date;

    private LocalDate to_date;

    @ManyToOne
    @JoinColumn(name = "item_production_order_status_id ", referencedColumnName = "id")
    private ItemProductionOrderStatus item_production_order_status_id;

    @ManyToOne
    @JoinColumn(name = "production_session_id", referencedColumnName = "id")
    private ProductionSession production_session_id;

    @ManyToOne
    @JoinColumn(name = "customer_order_id", referencedColumnName = "id")
    private CustomerOrder customer_order_id;

    @ManyToOne
    @JoinColumn(name = "production_order_type_id", referencedColumnName = "id")
    private ProductionOrderType production_order_type_id;

    @ManyToOne
    @JoinColumn(name = "production_order_nature_id", referencedColumnName = "id")
    private ProductionOrderNature production_order_nature_id;

    private String note;

    @NotNull
    private LocalDateTime add_date_time;

    private LocalDateTime update_date_time;

    private LocalDateTime delete_date_time;

    @NotNull
    private Integer added_user_id;

    private Integer update_user_id;

    private Integer delete_userr_id;

}
