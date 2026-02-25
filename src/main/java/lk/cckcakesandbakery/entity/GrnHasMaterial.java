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
@Table(name = "grn_has_material")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GrnHasMaterial {

    @Id // PK
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AI
    private Integer id;

    @NotNull
    private Integer qty;

    @NotNull
    private BigDecimal unit_price;

    @NotNull
    private BigDecimal line_price;

    // Foreign Key
    @ManyToOne
    @JoinColumn(name = "material_id" , referencedColumnName = "id")
    private Material material_id;


    // Foreign Key
    @ManyToOne
    @JoinColumn(name = "grn_id", referencedColumnName = "id")
    @JsonIgnore
    private Grn grn_id;



}
