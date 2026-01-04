package lk.cckcakesandbakery.entity;

import java.time.LocalDateTime;
import java.util.Set;

import jakarta.persistence.*;
import jakarta.persistence.GenerationType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "supplier")

@Data
@AllArgsConstructor
@NoArgsConstructor

public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private String supplier_name;

    private String brn;

    @NotNull
    private String supplier_address;

    @NotNull
    private String supplier_contact;

    @NotNull
    private String supplier_email;

    private String note;

    private String account_no;

    private String holder_name;

    @NotNull
    private LocalDateTime add_date_time;

    private LocalDateTime update_date_time;

    private LocalDateTime delete_date_time;

    @NotNull
    private Integer add_user_id;

    private Integer update_user_id;

    private Integer delete_user_id;

    @ManyToOne
    @JoinColumn(name = "material_id", referencedColumnName = "id")
    private Material material_id;

    @ManyToOne
    @JoinColumn(name = "branch_id", referencedColumnName = "id")
    private Branch branch_id;

    @ManyToOne
    @JoinColumn(name = "bank_id", referencedColumnName = "id")
    private Bank bank_id;

    @ManyToOne
    @JoinColumn(name = "supplier_registration_status_id", referencedColumnName = "id")
    private SupplierRegStatus supplier_registration_status_id;

    @ManyToOne
    @JoinColumn(name = "supplier_delivery_method_id", referencedColumnName = "id")
    private SupplierDeliveryMethod supplier_delivery_method_id;

    // Foreign Table--> Association table
    @ManyToMany
    @JoinTable(name = "supplier_has_item", joinColumns = @JoinColumn(name = "supplier_id"), inverseJoinColumns = @JoinColumn(name = "item_id"))
    private Set<Item> items;




}
