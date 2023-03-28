import Axios,{ AxiosInstance } from "axios";

export class AxiosService{

    static INSTANCE: AxiosService;

    private axios: AxiosInstance;


    private constructor(){
    }

    static getInstance():AxiosService{
        if(!this.INSTANCE){
            this.INSTANCE = new AxiosService();
            this.INSTANCE.axios = Axios.create({
            })
        }
        return this.INSTANCE;
    }

    get client():AxiosInstance{
        return this.axios;
    }
}