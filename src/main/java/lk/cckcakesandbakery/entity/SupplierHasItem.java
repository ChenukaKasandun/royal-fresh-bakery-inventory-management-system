package lk.cckcakesandbakery.entity;


import jakarta.persistence.*;
import jakarta.persistence.GenerationType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "supplier_has_item")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SupplierHasItem {

    @Id // PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "supplier_id" , referencedColumnName = "id")
    private  Supplier supplier_id;

    @ManyToOne
    @JoinColumn(name = "item_id" , referencedColumnName = "id")
    private Item item_id;





}
