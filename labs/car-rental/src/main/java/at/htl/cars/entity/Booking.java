package at.htl.cars.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "RES_BOOKING")
public class Booking {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "B_ID")
    private Long id;

    @Column(name = "B_CUSTOMER_NAME")
    private String customerName;

    @Column(name = "B_FROM")
    private LocalDate from;

    @Column(name = "B_TO")
    private LocalDate to;

    @ManyToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.PERSIST})
    @JoinColumn(name = "B_C_ID")
    private Car car;


    public Booking() {
    }

    public Booking(String customerName, LocalDate from, LocalDate to, Car car) {
        this.customerName = customerName;
        this.from = from;
        this.to = to;
        this.car = car;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public LocalDate getFrom() {
        return from;
    }

    public void setFrom(LocalDate from) {
        this.from = from;
    }

    public LocalDate getTo() {
        return to;
    }

    public void setTo(LocalDate to) {
        this.to = to;
    }

    public Car getCar() {
        return car;
    }

    public void setCar(Car car) {
        this.car = car;
    }

    @Override
    public String toString() {
        return String.format("%s rents %s from %td.%<tm.%<tY to %td.%<tm.%<tY", customerName, car, from, to);
    }
}
