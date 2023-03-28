import accountService from "../services/account"

export const getAccountBalance = async(req: any, res: any) => {
    try{
        const { walletId } = req.params;
        if(!walletId){
            throw Error("path/walletId is required");
        }
        const accountBalance = await accountService.getAccountBalance(walletId, req.user.id);
        res.json({
            data: accountBalance
        })
    }catch(e){
        res.status(500).json({
            error: "Failed to retrieve account balance"
        });
    }
}

export default {
    getAccountBalance
}