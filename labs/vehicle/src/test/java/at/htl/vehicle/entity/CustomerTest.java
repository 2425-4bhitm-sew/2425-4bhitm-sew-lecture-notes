package at.htl.vehicle.entity;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class CustomerTest {

    @Test
    void toStringTest() {
        var susi = new Customer(LocalDate.now(), "Susi");
        System.out.println(susi);
    }
}