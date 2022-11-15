
export interface AppData {
    isAuth?: boolean,
    token?: String,
    CustomerToken?: any,
    transactionID?: String,
    loginType?:String,
    userId?: String,
    salesExecutive?: {
        mobileNumber?: String,
        posId?: String,
        storeId?: String
    },
}

export interface Login {
    loginType?: String,
    salesExecutive?: {
        mobileNumber?: String,
        posId?: String,
        storeId?: String,
        fromPage?: String
    },
    smRsm?: {
        sapId?: String,
        password?: String
    },
    displayOverlay?: boolean,
    fromPage?:String,
    appData?:AppData,
    dispatchAppData?: Boolean,
    SmMobileNumber?: String,
    RsmMobileNumber?:String,
    customerSearch?:CustomerSearch
}

export enum LoginType{
    SALESEXECUTIVE='SALESEXECUTIVE',
    SMRSM = 'SMRSM'
}

export enum PageName{
    LoginPage='LoginPage',
    CustomerDetails = 'CustomerDetails',
    Home= 'Home',
    SEReport= 'SEReport'
}

export interface MerchantValidateResponse{
    transactionID: String,
    responseCode: String,
    responseDescription: String
}

export interface ErrorResponse{
    error?:{}
}

export interface VerifyOTP{
    mobileNumber?: String,
    transactionID?: String,
    otp?: String
    generateToken?: Boolean,
    rsmMobileNumber?:String,
    fromPage?:String
}

export interface VerifyOTPResponse{
    token: String,
    responseCode: String,
    responseDescription: String,
    HostTransactionId: String
}

export interface SmRsmLogin{
    EntityUserName?: String,
    EntityUserPassword?: String
}

export interface CustomerSearch {
    searchCustomer?:String,
    loginType?:String,
    searchData?:String | null,
    sapId?:String,
    mobileNumber?: String
}

export interface ReportSearchData{
    searchData?: String,
    selectReport?:String,
    offset?: Number,
    limit?: Number,
    draw?: Number
}

export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];