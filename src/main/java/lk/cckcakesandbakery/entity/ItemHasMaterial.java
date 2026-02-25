package lk.cckcakesandbakery.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

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

import java.math.BigDecimal;

@Entity
@Table(name = "item_has_material")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemHasMaterial {

    @Id // PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id;

    @NotNull
    private BigDecimal qty;

    // Foreign Key
    @ManyToOne
    @JoinColumn(name = "item_id", referencedColumnName = "id")
    @JsonIgnore
    private Item item_id;

    // Foreign Key
    @ManyToOne
    @JoinColumn(name = "material_id", referencedColumnName = "id")
    private Material material_id;

}
