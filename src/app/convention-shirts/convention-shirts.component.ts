import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-convention-shirts',
  templateUrl: './convention-shirts.component.html',
  styleUrls: ['./convention-shirts.component.scss']
})
export class ConventionShirtsComponent implements OnInit {

  conventions = [
    {
      conventionName: 'PAX Unplugged 2017',
      conventionImage: '../assets/images/paxu2017.png',
      gameName: 'Pandemic',
      saying: 'Pandemic Was My Gateway Game',
      mattImage: '',
      kellyImage: '',
      jenImage: '',
      alyssaImage: '',
    },
    {
      conventionName: 'PAX Unplugged 2018',
      conventionImage: '../assets/images/paxu2018.jpg',
      gameName: 'Charterstone',
      saying: '',
      mattImage: '../assets/images/Charterstone_Icon_Grey.png',
      kellyImage: '../assets/images/Charterstone_Icon_Yellow.png',
      jenImage: '../assets/images/Charterstone_Icon_Blue.png',
      alyssaImage: '../assets/images/Charterstone_Icon_Purple.png',
    },
    {
      conventionName: 'PAX Unplugged 2019',
      conventionImage: '../assets/images/paxu2019.jpg',
      gameName: 'Root',
      saying: '',
      mattImage: '../assets/images/rootFaceWoodland.png',
      kellyImage: '../assets/images/rootFaceVagabond.png',
      jenImage: '../assets/images/rootFaceMarquise.png',
      alyssaImage: '../assets/images/rootFaceEyrie.png',
    },
    {
      conventionName: 'PAX Unplugged 2021',
      conventionImage: '../assets/images/paxu2021.jpg',
      gameName: 'Scythe',
      saying: '',
      mattImage: '../assets/images/scytheOrange.png',
      kellyImage: '../assets/images/scytheYellow.png',
      jenImage: '../assets/images/scytheTeal.png',
      alyssaImage: '../assets/images/scytheWhite.png',
    }
  ]
  constructor(private authenticationService: AuthenticationService,
    private router: Router) { }

  ngOnInit(): void {
    this.authenticationService.userData.subscribe(user => {
      if (!user) {
        this.router.navigate(['/home']);
      }
    })
  }

}
