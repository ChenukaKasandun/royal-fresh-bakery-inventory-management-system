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
@Table(name = "return_items_has_item")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReturnItemHasItem {

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

    // Foreign Key
    @ManyToOne
    @JoinColumn(name = "return_items_id", referencedColumnName = "id")
    @JsonIgnore
    private ReturnItems return_items_id;



}
