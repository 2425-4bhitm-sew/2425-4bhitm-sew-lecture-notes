package at.htl.vehicle.control;

import io.quarkus.logging.Log;
import io.quarkus.runtime.LaunchConfig;
import io.quarkus.runtime.LaunchMode;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;

public class InitBean {

    @Inject
    VehicleRepository vehicleRepository;

    void init(@Observes StartupEvent event) {
        if (LaunchMode.current() == LaunchMode.DEVELOPMENT) {
            vehicleRepository.createData();
        }

        // TODO: mach was
    }


}
