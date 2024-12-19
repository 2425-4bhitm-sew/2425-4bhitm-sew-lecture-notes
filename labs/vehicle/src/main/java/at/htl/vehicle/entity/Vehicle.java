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

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String brand;
    private String model;

    public Vehicle(String brand, String model) {
        this.brand = brand;
        this.model = model;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Vehicle vehicle = (Vehicle) o;
        return Objects.equals(brand, vehicle.brand) && Objects.equals(model, vehicle.model);
    }

    @Override
    public int hashCode() {
        return Objects.hash(brand, model);
    }

    @Override
    public String toString() {
        return String.format("%s %s", getBrand(), getModel());
    }


}
