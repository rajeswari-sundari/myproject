import { Injectable }  from '@angular/core';
import { HttpClient }from '@angular/common/http';
import { AppUserService }from './app-user.service';
 
@Injectable()
export class AppInitService {

    constructor(private httpClient: HttpClient,private userService: AppUserService) {
    }
    
    Init() {
 
        return new Promise<void>((resolve, reject) => {
            let user= {userID : "573435",userName:"Suresh" };
         //    this.userService.getUser();
                    console.log(this.userService); 
            /*this.httpClient.get<any>("Home/GetAuthenticatedUser").subscribe(data => {
                    user = data;
                    //console.log(data);
                    this.userService.setUser(data);
                    resolve();
            });*/
        });
    }
}
