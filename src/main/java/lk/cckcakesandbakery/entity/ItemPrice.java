package lk.cckcakesandbakery.entity;

import java.math.BigDecimal;
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
@Table(name = "item_price")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private LocalDate  date;

    private BigDecimal raw_material_cost;

    private BigDecimal whole_sale_price;

    private BigDecimal reatil_profit_ratio;

    private BigDecimal retail_price;

    private BigDecimal returned_price;

    private BigDecimal total_production_cost;

    private BigDecimal production_cost;

    private BigDecimal wholesale_profit_ratio;

    @NotNull
    private LocalDateTime added_date_time;

    private LocalDateTime update_date_time;

    private LocalDateTime delete_date_time;

    @NotNull
    private Integer added_user_id;

    private Integer update_user_id;

    private Integer delete_user_id;

    @ManyToOne
    @JoinColumn(name = "item_id", referencedColumnName = "id")
    private Item item_id;

    @ManyToOne
    @JoinColumn(name = "item_price_status_id", referencedColumnName = "id")
    private ItemPriceStatus item_price_status_id;

}
