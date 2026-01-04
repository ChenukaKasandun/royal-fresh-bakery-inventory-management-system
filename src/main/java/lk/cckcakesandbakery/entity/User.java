package lk.cckcakesandbakery.entity;

import java.time.LocalDateTime;
import java.util.Set;

import jakarta.persistence.CascadeType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user")

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    @Column(name = "username", unique = true)
    private String username;

    @NotNull
    @Column(name = "password", unique = true)
    private String password;

    @NotNull

    @Column(name = "email", unique = true)
    private String email;

    @NotNull
    private Boolean status;

    private byte[] userphoto;

    @NotNull
    private LocalDateTime added_date_time;

    private LocalDateTime update_date_time;

    private LocalDateTime delete_date_time;

    @NotNull
    private Integer added_user_id;

    private Integer update_user_id;

    private Integer delete_user_id;

    // Foreign column
    @ManyToOne(optional = true) // optional= true ---> this is not required fielsd(no not null)
    @JoinColumn(name = "employee_id", referencedColumnName = "id") // foreign key
    private Employee employee_id;

    // Foreign Table--> Association table
    @ManyToMany(cascade = CascadeType.MERGE) // to accesss data of the association table
    @JoinTable(name = "user_has_role", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id")) // Association
                                                                                                                                        // Table
    private Set<Role> roles;

}
