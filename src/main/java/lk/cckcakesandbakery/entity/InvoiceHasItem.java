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
@Table(name = "invoice_has_item") // table mapping

@Data // setter and getters, toString
@AllArgsConstructor // All Argument constructor
@NoArgsConstructor // Default constructor / empty constructor
public class InvoiceHasItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "invoice_id" , referencedColumnName = "id")
    @JsonIgnore // This is for blocking the reference to this object on order to avoid recursion
    private Invoice invoice_id;

    @ManyToOne
    @JoinColumn(name = "item_id" , referencedColumnName = "id")
    private Item item_id;

    @NotNull
    private BigDecimal qty ;

    @NotNull
    private BigDecimal line_price;

}
