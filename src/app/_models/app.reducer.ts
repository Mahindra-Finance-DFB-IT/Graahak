// import { createReducer, on } from '@ngrx/store';
import { AppData } from './app';
// import { updateAppData} from './app.action';
import { AuthService } from '../_services/auth.service';
import { LocalStorageService } from '../_services/local-storage.service';


let lss= new LocalStorageService();
let as = new AuthService(lss);

export const AppReducer = createReducer(
    getIntialState(),
    // on(updateAppData, (state,AppData) => {
    //     let newData:AppData = {
    //         ...state,
    //         ...AppData
    //     }
    //     as.save(newData)
    //     return newData;
    // })
)


function getIntialState():AppData{
    return as.getData();
}

function createReducer(arg0: AppData) {
    throw new Error('Function not implemented.');
}
