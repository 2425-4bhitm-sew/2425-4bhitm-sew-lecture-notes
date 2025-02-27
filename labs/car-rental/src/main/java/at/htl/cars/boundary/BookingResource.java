package at.htl.cars.boundary;

import at.htl.cars.control.BookingRepository;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("booking")
public class BookingResource {

    @Inject
    BookingRepository bookingRepository;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll() {
        return Response.ok(bookingRepository.listAll()).build();
    }

}
