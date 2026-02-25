package lk.cckcakesandbakery.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.persistence.GenerationType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "customer_order_has_item")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerOrderHasItem {

    @Id // PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id;

    @NotNull
    private Integer qty;

    @NotNull
    private BigDecimal line_price;

    // Foreign Key
    @ManyToOne
    @JoinColumn(name = "item_id" , referencedColumnName = "id")
    private Item item_id;

    @ManyToOne
    @JoinColumn(name = "production_session_id" , referencedColumnName = "id")
    private ProductionSession production_session_id;

    // Foreign Key
    @ManyToOne
    @JoinColumn(name = "customer_order_id", referencedColumnName = "id")
    @JsonIgnore
    private CustomerOrder customer_order_id;



}
