import { Component, computed, signal } from '@angular/core';
import { DUMMY_VEHICLES} from '../dummy-vehicles';

const randomIndex = Math.floor(Math.random() * DUMMY_VEHICLES.length);

@Component({
  selector: 'app-vehicle',
  imports: [],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.css'
})
export class VehicleComponent {
  selectedVehicle = signal(DUMMY_VEHICLES[randomIndex])
  imagePath = computed(() => 'icons/' + this.selectedVehicle().avatar)

  // get imagePath() {
  //   return 'icons/' + this.selectedVehicle.avatar
  // }

  onSelectVehicle() {
    const randomIndex = Math.floor(Math.random() * DUMMY_VEHICLES.length);
    this.selectedVehicle.set( DUMMY_VEHICLES[randomIndex])
  }
}
