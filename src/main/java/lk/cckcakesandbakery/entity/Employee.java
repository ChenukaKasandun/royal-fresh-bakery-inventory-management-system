
package lk.cckcakesandbakery.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.validator.constraints.Length;

import jakarta.persistence.Column;
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
@Table(name = "employee")

@Data // Generate Setters and Getters and toString
@AllArgsConstructor
@NoArgsConstructor

public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "emp_no", unique = true) // Coloumn = emp_no in database,unique column
    @Length(max = 8) // maximun length char 8
    @NotNull
    private String emp_no;

    @NotNull
    private String fullname;

    @NotNull
    private String employee_callingname;

    @Column(name = "email", unique = true) // Column = email in database, unique column
    @NotNull
    private String email;

    @Column(name = "nic", unique = true) // Column = nic in database, unique column
    @Length(max = 12) // maximum length char 12
    @NotNull
    private String nic;

    @NotNull
    private String mobileno;

    @NotNull
    private String landno;

    @NotNull
    private String gender;

    @NotNull
    private String address;

    @NotNull
    private LocalDate dob;

    @NotNull
    private LocalDateTime added_datetime;

    private LocalDateTime update_datetime;

    private LocalDateTime delete_datetime;

    @NotNull
    private Integer added_user_id;

    private Integer update_user_id;

    private Integer delete_user_id;

    @ManyToOne
    @JoinColumn(name = "designation_id", referencedColumnName = "id") // foreignkeys
    private Designation designation_id;

    @ManyToOne
    @JoinColumn(name = "employeestatus_id", referencedColumnName = "id") // foreign keys
    private EmployeeStatus employeestatus_id;

    @ManyToOne
    @JoinColumn(name = "employee_civil_status_id", referencedColumnName = "id") // Foreign Keys
    private EmployeeCivilStatus employee_civil_status_id;

}
