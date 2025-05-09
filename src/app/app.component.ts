import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SwPush, SwUpdate, VersionEvent } from '@angular/service-worker';
import { Action } from 'rxjs/internal/scheduler/Action';
import { interval } from 'rxjs';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'pwaMoby';
  data!:any;
  constructor(private http:HttpClient,private pushService:SwPush,private updated:SwUpdate){ 
    console.log('start');
    
  }

  ngOnInit(): void {
    this.pushService.messages.subscribe((message)=>{
      console.log(message);
      
    })

    this.pushService.notificationClicks.subscribe(({action,notification})=>{
     window.open(notification.data.url)
    })

    this.http.get("https://jsonplaceholder.typicode.com/posts").subscribe(
      (responce)=>{
        this.data=responce;
      })

    if(!this.updated.isEnabled){console.log('not enable');
      return
    }
    this.handleUpdate()
    this.pushFromServer()
    this.checkForUpdata()
  }


  handleUpdate(){
    this.updated.versionUpdates.subscribe((versionEvent:VersionEvent)=>{
      alert(versionEvent.type)

      if(versionEvent.type==='VERSION_READY'&&confirm(`new version ${versionEvent.latestVersion.hash} update?`)){
         window.location.reload()
      }

    })
  }
  checkForUpdata() {
    const intervalTime = 6 * 60 * 60 * 1000;
    const updateInterval = interval(intervalTime);
    updateInterval.subscribe(() => {
      this.updated.checkForUpdate().then(() => {
        console.log("checked...")
      })

    })
    console.log("update checked...");

  }
  pushFromServer(){
    if(!this.pushService.isEnabled){
      console.log('not enable');
      return
    }
    this.pushService.requestSubscription({serverPublicKey:
      'BEpcjPA0C0b7vrynPOv4n3OgTn2KtigIVROnGa-juFiG8T4Xb0L7Q63eGdQiBvuMRvkY9h6uNfiEVjZaDWqrkfI'}).then(
        (sub)=>{
          console.log(JSON.stringify(sub));
          
        }
      ).catch((err)=>{
        console.error(err);
        
      })
  }
}
