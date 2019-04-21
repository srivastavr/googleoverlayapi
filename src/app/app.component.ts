import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { } from '@types/googlemaps';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private http: HttpClient,
    private ngxXml2jsonService: NgxXml2jsonService
  ) { }
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  model : any;
  data: any;
  lat: any[] = [];
  lon: any[] = [];
  objs: any = {};
  isHidden = false;

  ngOnInit() {
    let mapProp = {
      center: new google.maps.LatLng(13.1935950, 77.6491150),
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.http.get('https://dl.dropboxusercontent.com/s/8nvqnasci6l76nz/Problem.gpx', { responseType: 'text' }).subscribe(response => {
      // console.log(response);
      this.data = response;
      const parser = new DOMParser();
      const xml = parser.parseFromString(response, 'text/xml');
      const obj = this.ngxXml2jsonService.xmlToJson(xml);
      this.objs = obj;
      //console.log(this.objs.gpx.trk.trkseg.trkpt); //[0]["@attributes"]
      for (var i = 0; i < this.objs.gpx.trk.trkseg.trkpt.length; i++) {
        var x = this.objs.gpx.trk.trkseg.trkpt[i]["@attributes"].lat;
        var y = +x;
        var x1 = this.objs.gpx.trk.trkseg.trkpt[i]["@attributes"].lon;
        var y1 = +x1;
        var temp = { lat: y, lng: y1 };
        this.lat.push(temp);
      }
      let marker = new google.maps.Polyline({
        path: this.lat,
        geodesic: true,
        strokeColor: 'blue',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
      marker.setMap(this.map);
    });
  }
}
