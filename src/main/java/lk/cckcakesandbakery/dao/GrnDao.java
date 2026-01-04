package lk.cckcakesandbakery.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import lk.cckcakesandbakery.entity.Grn;

public interface GrnDao extends JpaRepository<Grn, Integer> {

    // Generate nect GRN no
    @Query(value = "SELECT CONCAT('GRN', LPAD(COALESCE(MAX(CAST(SUBSTRING(g.grn_no, 4) AS UNSIGNED)), 0) + 1, 3, '0')) AS next_grn_no FROM cckcakesandbakery.grn as g;", nativeQuery = true)
    String getNextGrnNo();

    // Select from thesame GRN no
    @Query(value = "SELECT g FROM Grn as g where g.grn_no =?1")
    Grn getByGrnNo(String grn_no);

}
