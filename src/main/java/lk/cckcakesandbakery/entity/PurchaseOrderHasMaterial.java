package lk.cckcakesandbakery.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.persistence.GenerationType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity // this class generate as an entity
@Table(name = "purchase_order_has_material") // table mapping

@Data // setter and getters, toString
@AllArgsConstructor // All Argument constructor
@NoArgsConstructor // Default constructor / empty constructor
public class PurchaseOrderHasMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "purchase_order_id" , referencedColumnName = "id")
    @JsonIgnore // This is for blocking the reference to this object on order to avoid recursion
    private PurchaseOrder purchase_order_id;

    @ManyToOne
    @JoinColumn(name = "material_id" , referencedColumnName = "id")
    private Material material_id;

    @NotNull
    private BigDecimal purchase_price ;

    @NotNull
    private BigDecimal quantity ;

    @NotNull
    private BigDecimal line_price;

}
