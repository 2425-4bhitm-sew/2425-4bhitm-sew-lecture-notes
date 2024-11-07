package at.htl.vehicle.control;

import at.htl.vehicle.entity.Vehicle;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Singleton;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

@Singleton
public class VehicleRepository {

    private List<Vehicle> vehicles = new LinkedList<>();

    public boolean isEmpty() {
        return vehicles.isEmpty();
    }

    public void persist(Vehicle vehicle) {
        if (vehicles.contains(vehicle)) {
            int index = vehicles.indexOf(vehicle);
            vehicles.set(index, vehicle);
        } else {
            vehicles.add(vehicle);
        }
    }

    public List<Vehicle> getAll() {
        return Collections.unmodifiableList(vehicles);
        //return List.copyOf(vehicles);
    }

    public void deleteAll() {
        vehicles.clear();
    }



    void createData() {
        Log.info("Create Example Data ...");
        persist(new Vehicle("Opel", "Kadett"));
        persist(new Vehicle("Opel", "Kapitän"));
        persist(new Vehicle("VW", "Käfer"));
        persist(new Vehicle("Ford", "Mustang"));
    }



}
