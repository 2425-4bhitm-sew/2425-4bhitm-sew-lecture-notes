import { Component, computed, EventEmitter, input, Input, output, Output, signal } from '@angular/core';
import { DUMMY_VEHICLES } from '../dummy-vehicles';

const randomIndex = Math.floor(Math.random() * DUMMY_VEHICLES.length);

@Component({
  selector: 'app-vehicle',
  imports: [],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.css'
})
export class VehicleComponent {

  @Input({ required: true }) id!: string
  @Input({ required: true }) avatar!: string
  @Input({ required: true }) brand!: string
  //@Output() select  = new EventEmitter<string>()
  select = output<string>()

  // avatar = input.required<string>()
  // brand = input.required<string>()

  get imagePath() {
    return 'icons/' + this.avatar
  }

  // imagePath = computed(() => 'icons/' + this.avatar())

  onSelectVehicle() {
    this.select.emit(this.id)
  }
}
