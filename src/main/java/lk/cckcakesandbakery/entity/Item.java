package lk.cckcakesandbakery.entity;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "item")

@Data
@AllArgsConstructor
@NoArgsConstructor

public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    private String item_name;

    private String item_code;

    @NotNull
    private LocalDateTime add_date_time;

    private LocalDateTime update_date_time;

    private LocalDateTime delete_date_time;

    @NotNull
    private Integer add_user_id;

    private Integer update_user_id;

    private Integer delete_user_id;

    // Foreign Key
    @ManyToOne
    @JoinColumn(name = "item_return_status_id", referencedColumnName = "id")
    private ItemReturnStatus item_return_status_id;

    // Foreign Key
    @ManyToOne
    @JoinColumn(name = "item_status_id", referencedColumnName = "id")
    private ItemStatus item_status_id;


    // Foreign Key
    @ManyToOne
    @JoinColumn(name = "item_category_id", referencedColumnName = "id")
    private ItemCategory item_category_id;

    // Association table   In Here, "cascade = CascadeType.ALL" should be essential to save data into association table
    //"orphanRemoval = true" should be essential to remove data from the association table
    @OneToMany(mappedBy = "item_id" , cascade = CascadeType.ALL ,orphanRemoval = true )
    private List<ItemHasMaterial>itemHasMaterialList;

//    // Item Constructor that created to request a selected List of properties from
//    // the dataBase using a query at itemDao
//    public Item(Integer id, String item_name, String item_code) {
//
//        this.id = id;
//        this.item_name = item_name;
//        this.item_code = item_code;
//
//
//    }

}
