package lk.cckcakesandbakery.entity;

import jakarta.persistence.*;
import jakarta.persistence.GenerationType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // this class generate as an entity
@Table(name = "item_stock") // table mapping

@Data // setter and getters, toString
@AllArgsConstructor // All Argument constructor
@NoArgsConstructor // Default constructor / empty constructor
public class ItemStock {

    @Id // PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id;

    @NotNull
    private Integer available_qty;

    @ManyToOne
    @JoinColumn(name = "invoice_id" , referencedColumnName = "id")
    private Invoice invoice_id;

    @ManyToOne
    @JoinColumn(name = "production_id" , referencedColumnName = "id")
    private ProductionManagement production_id;


}
