package at.htl.vehicle.entity;

import jakarta.persistence.*;

import java.util.Objects;

@NamedQueries({
        @NamedQuery(name = "Vehicle.findAll",
                query = "select v from Vehicle v"
        ),
        @NamedQuery(name = "Vehicle.deleteAll",
                query = "delete from Vehicle v"
        )
})
@Entity
@Table(name = "V_VEHICLE")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "VE_ID")
    private Long id;

    @Column(name = "VE_BRAND")
    private String brand;

    @Column(name = "VE_MODEL")
    private String model;

    @Column(name = "VE_PRICE_PER_DAY")
    private double pricePerDay;

    public Vehicle(String brand, String model, double pricePerDay) {
        this.brand = brand;
        this.model = model;
        this.pricePerDay = pricePerDay;
    }

    public Vehicle(String brand, String model) {
        this(brand, model, Double.NaN);
    }

    public Vehicle() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public double getPricePerDay() {
        return pricePerDay;
    }

    public void setPricePerDay(double price) {
        this.pricePerDay = price;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Vehicle vehicle = (Vehicle) o;
        return Objects.equals(id, vehicle.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return String.format("%d: %s %s (%.2f €)", getId(), getBrand(), getModel(), getPricePerDay());
    }


}
