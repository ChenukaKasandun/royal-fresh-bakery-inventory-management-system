package lk.cckcakesandbakery.entity;

import java.math.BigDecimal;
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
@Table(name = "material")

@Data
@AllArgsConstructor
@NoArgsConstructor

public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private String material_name;

    private String note;

    @NotNull
    private BigDecimal measuring_unit;

    @NotNull
    private BigDecimal purchasing_unit;

    @ManyToOne
    @JoinColumn(name = "unit_type_id", referencedColumnName = "id") // Foreign Key
    private UnitType unit_type_id;

    @NotNull
    private BigDecimal rop;

    @NotNull
    private BigDecimal roq;

    @NotNull
    private LocalDateTime add_date_time;

    private LocalDateTime update_date_time;

    private LocalDateTime delete_date_time;

    @NotNull
    private Integer add_user_id;

    private Integer update_user_id;

    private Integer delete_user_id;

    @ManyToOne
    @JoinColumn(name = "rawmaterial_status_id", referencedColumnName = "id")
    private RawMaterialStatus rawmaterial_status_id;

    // Item Constructor that created to request a selected List of properties from
    // the dataBase using a query at rawMaterialDao
//    public Material(Integer id, String material_name, Integer rawMaterialStatus) {
//
//        this.id = id;
//        this.material_name = material_name;
//        this.rawmaterial_status_id = rawMaterialStatus;
//
//    }

}
