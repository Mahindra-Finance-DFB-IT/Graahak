
export interface AppData {
    isAuth?: boolean,
    token?: String,
    CustomerToken?: any,
    transactionID?: String,
    loginType?: String,
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
    fromPage?: String,
    appData?: AppData,
    dispatchAppData?: Boolean,
    SmMobileNumber?: String,
    RsmMobileNumber?: String,
    customerSearch?: CustomerSearch
}

export enum LoginType {
    SALESEXECUTIVE = 'SALESEXECUTIVE',
    SMRSM = 'SMRSM'
}

export enum PageName {
    LoginPage = 'LoginPage',
    CustomerDetails = 'CustomerDetails',
    Home = 'Home',
    SEReport = 'SEReport'
}

export interface MerchantValidateResponse {
    transactionID: String,
    responseCode: String,
    responseDescription: String
}

export interface ErrorResponse {
    error?: {}
}

export interface VerifyOTP {
    mobileNumber?: String,
    transactionID?: String,
    otp?: String
    generateToken?: Boolean,
    rsmMobileNumber?: String,
    fromPage?: String
}

export interface VerifyOTPResponse {
    token: String,
    responseCode: String,
    responseDescription: String,
    HostTransactionId: String
}

export interface SmRsmLogin {
    EntityUserName?: String,
    EntityUserPassword?: String
}

export interface CustomerSearch {
    searchCustomer?: String,
    loginType?: String,
    searchData?: String | null,
    sapId?: String,
    mobileNumber?: String
}

export interface ReportSearchData {
    searchData?: String,
    selectReport?: String,
    offset?: Number,
    limit?: Number,
    draw?: Number
}

export interface SchemeModel {
    action: String,
    action_sdm_file: String,
    action_spm_file: String,
    advance_emi: String,
    dbd: String,
    dealer_group_code: String,
    id: Number
    is_pf_scheme: String,
    max_amount: String,
    min_amount: String,
    mbd_amount: String,
    mbd_percentage: String,
    mdr_amount: String,
    mdr_percentage: String,
    oem: String,
    portal_description: String,
    processing_fee: String,
    processing_fee_percentage: String,
    product_group_code: String,
    roi: String,
    scheme_description: String,
    scheme_end_date: String,
    scheme_id: String,
    scheme_irr: String,
    scheme_start_Date: String,
    special_scheme_flag: String,
    status: String,
    status_sdm_file: String,
    status_spm_file: String,
    tenure: String,
    pname: String
}

export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];