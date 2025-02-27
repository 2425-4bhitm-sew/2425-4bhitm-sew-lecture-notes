package at.htl.cars.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.Map;

@Entity
@Table(name = "RES_CAR")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Car {

    public static final double MILES_TO_KM_CONVERSION_FACTOR = 1.609344;
    public static final double GALLON_TO_LITER_CONVERSION_FACTOR = 3.78541178;
    public static final double MPG_TO_LITERPERKM_CONVERSION_FACTOR
            = GALLON_TO_LITER_CONVERSION_FACTOR / MILES_TO_KM_CONVERSION_FACTOR * 100.0;



    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "C_ID")
    private Long id;

    @Column(name = "C_NAME")
    private String name;

    @Column(name = "C_LITER_PER_100_KM")
    private double literPer100Km;

    @Column(name = "C_YYYY")
    private int yyyy;                  // Baujahr

    @Column(name = "C_ORIGIN")
    private String origin;                // Herkunft: zB USA, Japan, ...

    //region Constructors
    public Car() {
    }

    public Car(
            String name,
            double literPer100Km,
            int yyyy,
            String origin) {
        this.name = name;
        this.literPer100Km = literPer100Km;
        this.yyyy = yyyy;
        this.origin = origin;
    }
    //endregion

    //region getter and setter
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getLiterPer100Km() {
        return literPer100Km;
    }

    public void setLiterPer100Km(double literPer100Km) {
        this.literPer100Km = literPer100Km;
    }

    public int getYyyy() {
        return yyyy;
    }

    public void setYyyy(int yyyy) {
        this.yyyy = yyyy;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }
    //endregion

    @Override
    public String toString() {
        return String.format("%s (%d)", name, yyyy);
    }


    /**
     * mpg ... miles per gallon
     * mpg = mile / gallon
     *
     * x [miles/gallon] = x * 1.6 km / 3.7 l
     *                  = x * (1.6 * 100) / 3.7 [100km/l]
     * x [gallons/mile] = 1 / x * (3.7 / (1.6 * 100)) [l/100km]
     *                  = 235.215 / x
     *
     * @param milesPerGallon no of miles per gallon
     * @return consumption of liters per 100km
     */
    public static double convertMilesPerGallonToLiterPer100Km(Double milesPerGallon) {
        if (milesPerGallon == 0.0) {
            return -1.0;
        }
        return Math.round(MPG_TO_LITERPERKM_CONVERSION_FACTOR / milesPerGallon * 10.0) / 10.0;
    }




}
